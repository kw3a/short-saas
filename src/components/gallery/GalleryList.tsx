"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import { Loader2 } from "lucide-react"
import { authClient } from "@/lib/auth-client"
import { VideoCard } from "./VideoCard"

type Item = { id: string; status: "completed"|"rendering"|"queued"|"failed"; progress: number; createdAt: string; type: string; creditCost: number|null; thumbUrl: string|null }

type Cursor = { cursorCreatedAt: string; cursorId: string }
type Page = { items: Item[]; nextCursor: Cursor | null }

async function fetchGalleryPage(cursor?: Cursor | null): Promise<Page> {
  const qs = new URLSearchParams()
  if (cursor) {
    qs.set("cursorCreatedAt", cursor.cursorCreatedAt)
    qs.set("cursorId", cursor.cursorId)
  }
  const res = await fetch(`/api/video/gallery?${qs.toString()}`)
  if (!res.ok) throw new Error("failed")
  return res.json()
}

export default function GalleryList() {
  const { data: session } = authClient.useSession()
  const [items, setItems] = useState<Item[]>([])
  // Start in the loading state so the initial mount fetch doesn't need a
  // synchronous setState inside the effect (which the rules of hooks forbid).
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string|null>(null)
  const [nextCursor, setNextCursor] = useState<Cursor | null>(null)
  const [initialLoaded, setInitialLoaded] = useState(false)
  const sentinelRef = useRef<HTMLDivElement | null>(null)
  const loadingRef = useRef(false)

  const applyPage = useCallback((data: Page) => {
    setItems((prev) => {
      const map = new Map<string, Item>()
      for (const it of prev) map.set(it.id, it)
      for (const it of data.items) if (!map.has(it.id)) map.set(it.id, it)
      return Array.from(map.values())
    })
    setNextCursor(data.nextCursor ?? null)
    setError(null)
  }, [])

  const loadPage = useCallback(async (cursor?: Cursor | null) => {
    if (loadingRef.current) return
    loadingRef.current = true
    setLoading(true)
    try {
      applyPage(await fetchGalleryPage(cursor))
    } catch {
      setError("Failed to load gallery")
    } finally {
      loadingRef.current = false
      setLoading(false)
      setInitialLoaded(true)
    }
  }, [applyPage])

  const refreshAll = useCallback(async () => {
    if (loadingRef.current) return
    setItems([])
    setNextCursor(null)
    setError(null)
    setInitialLoaded(false)
    await loadPage(null)
  }, [loadPage])

  // Initial load on mount: keep every setState inside async callbacks so the
  // effect body never calls setState synchronously.
  useEffect(() => {
    if (!session?.user?.id || initialLoaded) return
    let cancelled = false
    loadingRef.current = true
    fetchGalleryPage(null)
      .then((data) => { if (!cancelled) applyPage(data) })
      .catch(() => { if (!cancelled) setError("Failed to load gallery") })
      .finally(() => {
        if (cancelled) return
        loadingRef.current = false
        setLoading(false)
        setInitialLoaded(true)
      })
    return () => { cancelled = true }
  }, [session?.user?.id, initialLoaded, applyPage])

  useEffect(() => {
    const el = sentinelRef.current
    if (!el) return
    const io = new IntersectionObserver((entries) => {
      const first = entries[0]
      if (first.isIntersecting && !loadingRef.current && nextCursor) {
        setLoading(true)
        loadPage(nextCursor)
      }
    })
    io.observe(el)
    return () => io.disconnect()
  }, [nextCursor, loadPage])

  // Listen for external refresh requests from the page header
  useEffect(() => {
    function onExternalRefresh() {
      refreshAll()
    }
    window.addEventListener('gallery:refresh', onExternalRefresh)
    return () => window.removeEventListener('gallery:refresh', onExternalRefresh)
  }, [refreshAll])

  if (!session?.user?.id) {
    return <div className="text-center text-sm text-zinc-400">Please sign in to view your gallery.</div>
  }

  if (initialLoaded && items.length === 0) {
    return <div className="text-center text-sm text-zinc-400">You don&apos;t have any videos yet.</div>
  }

  return (
    <div>
      <div className="p-4 sm:p-6 md:p-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-5 gap-4">
          {items.map((it) => (
            <VideoCard
              key={it.id}
              id={it.id}
              status={it.status}
              progress={it.progress}
              thumbUrl={it.thumbUrl}
              type={it.type}
              creditCost={it.creditCost}
              createdAt={it.createdAt}
            />
          ))}
        </div>
      </div>
      <div ref={sentinelRef} className="h-8" />
      {loading && (
        <div className="flex items-center justify-center py-4">
          <Loader2 className="h-6 w-6 animate-spin text-zinc-500" />
        </div>
      )}
      {error && <div className="text-center text-xs text-red-400 py-2">{error}</div>}
      {!nextCursor && initialLoaded && items.length > 0 && (
        <div className="text-center text-xs text-zinc-500 py-2">End of results</div>
      )}
    </div>
  )
}
