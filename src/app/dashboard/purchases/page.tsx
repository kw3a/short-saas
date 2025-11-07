"use client"

import { useEffect, useState } from "react"
import { CircleDollarSign, RefreshCw, ChevronDown } from "lucide-react"

type Purchase = { id: string; amountCents: number; status: string; createdAt: string; pkgName: string | null; pkgCredits: number | null }

export default function DashboardPurchasesPage() {
  const [items, setItems] = useState<Purchase[]>([])
  const [cursor, setCursor] = useState<string | null>(null)
  const [hasMore, setHasMore] = useState(false)
  const [loading, setLoading] = useState(false)

  async function load(reset = false) {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      if (!reset && cursor) params.set("cursorCreatedAt", cursor)
      const res = await fetch(`/api/credits/purchases?${params.toString()}`, { cache: "no-store" })
      const json = await res.json()
      const newItems: Purchase[] = json.items || []
      setItems(prev => reset ? newItems : [...prev, ...newItems])
      setCursor(json.nextCursor?.cursorCreatedAt ?? null)
      setHasMore(Boolean(json.nextCursor))
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load(true) }, [])

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <h1 className="text-xl font-semibold inline-flex items-center gap-2"><CircleDollarSign size={18} className="text-yellow-400" /> Purchase History</h1>
        <button onClick={() => load(true)} disabled={loading} className="inline-flex items-center gap-2 px-3 py-1.5 rounded bg-zinc-800 hover:bg-zinc-700 text-white border border-zinc-700">
          <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
          Refresh
        </button>
      </div>

      {items.length === 0 ? (
        <div className="text-sm text-zinc-400">No purchases yet.</div>
      ) : (
        <ul className="divide-y divide-zinc-800 border border-zinc-800 rounded-md overflow-hidden">
          {items.map((p) => (
            <li key={p.id} className="grid grid-cols-4 items-center gap-2 px-3 py-2 text-sm">
              <span className="text-zinc-300">{new Date(p.createdAt as any).toLocaleString()}</span>
              <span className="text-zinc-300 truncate">{p.pkgName ?? "Custom"}</span>
              <span className="text-zinc-400">{p.pkgCredits ? `${p.pkgCredits.toLocaleString()} credits` : "-"}</span>
              <div className="flex items-center justify-end gap-2">
                <span className="text-zinc-400">{(p.amountCents/100).toLocaleString(undefined,{style:'currency',currency:'USD'})}</span>
                <span className="capitalize px-2 py-0.5 rounded bg-zinc-800 text-zinc-200">{p.status}</span>
              </div>
            </li>
          ))}
        </ul>
      )}

      {hasMore && (
        <div className="mt-3">
          <button onClick={() => load(false)} disabled={loading} className="inline-flex items-center gap-2 px-3 py-1.5 rounded bg-zinc-800 hover:bg-zinc-700 text-white border border-zinc-700">
            <ChevronDown size={16} className={loading ? "animate-bounce" : ""} />
            Load more
          </button>
        </div>
      )}
    </div>
  )
}
