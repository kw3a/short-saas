"use client"

import { useEffect, useRef, useState } from "react"
import { Loader2 } from "lucide-react"
import { authClient } from "@/lib/auth-client"
import { VideoCard } from "./VideoCard"

type Item = { id: string; status: "completed"|"rendering"|"queued"|"failed"; createdAt: string; type: string; creditCost: number|null; thumbUrl: string|null }

type Page = { items: Item[]; nextCursor: { cursorCreatedAt: string; cursorId: string } | null }

export default function GalleryList() {
  const { data: session } = authClient.useSession()
  const [items, setItems] = useState<Item[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string|null>(null)
  const [nextCursor, setNextCursor] = useState<{ cursorCreatedAt: string; cursorId: string } | null>(null)
  const [initialLoaded, setInitialLoaded] = useState(false)
  const sentinelRef = useRef<HTMLDivElement | null>(null)

  async function loadPage(cursor?: { cursorCreatedAt: string; cursorId: string } | null) {
    setLoading(true)
    setError(null)
    try {
      const qs = new URLSearchParams()
      if (cursor) {
        qs.set("cursorCreatedAt", cursor.cursorCreatedAt)
        qs.set("cursorId", cursor.cursorId)
      }
      const res = await fetch(`/api/video/gallery?${qs.toString()}`)
      if (!res.ok) throw new Error("failed")
      const data: Page = await res.json()
      setItems((prev) => {
        const map = new Map<string, Item>()
        for (const it of prev) map.set(it.id, it)
        for (const it of data.items) if (!map.has(it.id)) map.set(it.id, it)
        return Array.from(map.values())
      })
      setNextCursor(data.nextCursor ?? null)
    } catch {
      setError("Failed to load gallery")
    } finally {
      setLoading(false)
      setInitialLoaded(true)
    }
  }

  async function refreshAll() {
    if (loading) return
    setItems([])
    setNextCursor(null)
    setError(null)
    setInitialLoaded(false)
    await loadPage(null)
  }

  useEffect(() => {
    if (!session?.user?.id) return
    if (initialLoaded) return
    loadPage(null)
  }, [session?.user?.id])

  useEffect(() => {
    const el = sentinelRef.current
    if (!el) return
    const io = new IntersectionObserver((entries) => {
      const first = entries[0]
      if (first.isIntersecting && !loading && nextCursor) {
        loadPage(nextCursor)
      }
    })
    io.observe(el)
    return () => io.disconnect()
  }, [nextCursor, loading])

  // Listen for external refresh requests from the page header
  useEffect(() => {
    function onExternalRefresh() {
      refreshAll()
    }
    window.addEventListener('gallery:refresh', onExternalRefresh)
    return () => window.removeEventListener('gallery:refresh', onExternalRefresh)
  }, [loading])

  if (!session?.user?.id) {
    return <div className="text-center text-sm text-zinc-400">Please sign in to view your gallery.</div>
  }

  if (initialLoaded && items.length === 0) {
    return <div className="text-center text-sm text-zinc-400">You don't have any videos yet.</div>
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
