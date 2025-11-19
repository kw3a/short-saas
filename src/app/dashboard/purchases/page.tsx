"use client"

import { useEffect, useState } from "react"
import { CircleDollarSign, RefreshCw, ChevronDown } from "lucide-react"
import type { Locale } from "@/lib/i18n"

type Purchase = { id: string; amountCents: number; status: string; createdAt: string; pkgName: string | null; pkgCredits: number | null }

const purchasesTexts: Record<Locale, {
  title: string
  refresh: string
  empty: string
  loadMore: string
  customLabel: string
  creditsSuffix: string
}> = {
  en: {
    title: "Purchase History",
    refresh: "Refresh",
    empty: "No purchases yet.",
    loadMore: "Load more",
    customLabel: "Custom",
    creditsSuffix: "credits",
  },
  es: {
    title: "Historial de compras",
    refresh: "Actualizar",
    empty: "Aún no hay compras.",
    loadMore: "Cargar más",
    customLabel: "Personalizado",
    creditsSuffix: "créditos",
  },
}

function getInitialLocale(): Locale {
  if (typeof document === "undefined") return "en"
  const match = document.cookie.match(/(?:^|; )lang=(en|es)(?:;|$)/)
  return (match?.[1] as Locale | undefined) ?? "en"
}

export default function DashboardPurchasesPage() {
  const [items, setItems] = useState<Purchase[]>([])
  const [cursor, setCursor] = useState<string | null>(null)
  const [hasMore, setHasMore] = useState(false)
  const [loading, setLoading] = useState(false)
  const [locale, setLocale] = useState<Locale>(getInitialLocale)

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

  useEffect(() => {
    const id = setInterval(() => {
      const next = getInitialLocale()
      setLocale((prev) => (prev === next ? prev : next))
    }, 3000)
    return () => clearInterval(id)
  }, [])

  const t = purchasesTexts[locale] ?? purchasesTexts.en

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <h1 className="text-xl font-semibold inline-flex items-center gap-2"><CircleDollarSign size={18} className="text-yellow-400" /> {t.title}</h1>
        <button onClick={() => load(true)} disabled={loading} className="inline-flex items-center gap-2 px-3 py-1.5 rounded bg-zinc-800 hover:bg-zinc-700 text-white border border-zinc-700">
          <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
          {t.refresh}
        </button>
      </div>

      {items.length === 0 ? (
        <div className="text-sm text-zinc-400">{t.empty}</div>
      ) : (
        <ul className="divide-y divide-zinc-800 border border-zinc-800 rounded-md overflow-hidden">
          {items.map((p) => (
            <li key={p.id} className="grid grid-cols-4 items-center gap-2 px-3 py-2 text-sm">
              <span className="text-zinc-300">{new Date(p.createdAt as any).toLocaleString()}</span>
              <span className="text-zinc-300 truncate">{p.pkgName ?? t.customLabel}</span>
              <span className="text-zinc-400">{p.pkgCredits ? `${p.pkgCredits.toLocaleString()} ${t.creditsSuffix}` : "-"}</span>
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
            {t.loadMore}
          </button>
        </div>
      )}
    </div>
  )
}
