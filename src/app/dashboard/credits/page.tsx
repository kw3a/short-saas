"use client"

import { useEffect, useState } from "react"
import { CircleDollarSign, RefreshCw, ChevronDown } from "lucide-react"
import type { Locale } from "@/lib/i18n"

type Spend = { id: string; status: string; creditCost: number | null; createdAt: string }
type Adjustment = { id: string; amount: number; type: string; reason: string | null; createdAt: string }

const creditsTexts: Record<Locale, {
  title: string
  subtitle: string
  refresh: string
  spentTab: string
  adjustmentsTab: string
  spentHeading: string
  spentEmpty: string
  adjustmentsHeading: string
  adjustmentsEmpty: string
  loadMore: string
  date: string
  amount: string
  status: string
  type: string
  reason: string
  creditsSuffix: string
}> = {
  en: {
    title: "Credit History",
    subtitle: "Track spent credits and other adjustments.",
    refresh: "Refresh",
    spentTab: "Spent Credits",
    adjustmentsTab: "Other Adjustments",
    spentHeading: "Spent Credits",
    spentEmpty: "No spend events yet.",
    adjustmentsHeading: "Other Adjustments",
    adjustmentsEmpty: "No adjustments yet.",
    loadMore: "Load more",
    date: "Date",
    amount: "Amount",
    status: "Status",
    type: "Type",
    reason: "Reason",
    creditsSuffix: "credits",
  },
  es: {
    title: "Historial de créditos",
    subtitle: "Revisa créditos gastados y otros ajustes.",
    refresh: "Actualizar",
    spentTab: "Créditos gastados",
    adjustmentsTab: "Otros ajustes",
    spentHeading: "Créditos gastados",
    spentEmpty: "Aún no hay movimientos de gasto.",
    adjustmentsHeading: "Otros ajustes",
    adjustmentsEmpty: "Aún no hay ajustes.",
    loadMore: "Cargar más",
    date: "Fecha",
    amount: "Cantidad",
    status: "Estado",
    type: "Tipo",
    reason: "Motivo",
    creditsSuffix: "créditos",
  },
}

function getInitialLocale(): Locale {
  if (typeof document === "undefined") return "en"
  const match = document.cookie.match(/(?:^|; )lang=(en|es)(?:;|$)/)
  return (match?.[1] as Locale | undefined) ?? "en"
}

export default function DashboardCreditsPage() {
  const [spends, setSpends] = useState<Spend[]>([])
  const [spendsCursor, setSpendsCursor] = useState<string | null>(null)
  const [spendsHasMore, setSpendsHasMore] = useState(false)
  const [spendsLoading, setSpendsLoading] = useState(false)

  const [adjustments, setAdjustments] = useState<Adjustment[]>([])
  const [adjCursor, setAdjCursor] = useState<string | null>(null)
  const [adjHasMore, setAdjHasMore] = useState(false)
  const [adjLoading, setAdjLoading] = useState(false)

  const [tab, setTab] = useState<"spends" | "adjustments">("spends")
  const [locale, setLocale] = useState<Locale>(getInitialLocale)

  async function loadSpends(reset = false) {
    setSpendsLoading(true)
    try {
      const params = new URLSearchParams({ type: "spends", limit: "20" })
      if (!reset && spendsCursor) params.set("cursorCreatedAt", spendsCursor)
      const res = await fetch(`/api/credits/history?${params.toString()}`, { cache: "no-store" })
      const json = await res.json()
      const items: Spend[] = json.items || []
      setSpends(prev => reset ? items : [...prev, ...items])
      setSpendsCursor(json.nextCursor?.cursorCreatedAt ?? null)
      setSpendsHasMore(Boolean(json.nextCursor))
    } finally {
      setSpendsLoading(false)
    }
  }

  async function loadAdjustments(reset = false) {
    setAdjLoading(true)
    try {
      const params = new URLSearchParams({ type: "adjustments", limit: "20" })
      if (!reset && adjCursor) params.set("cursorCreatedAt", adjCursor)
      const res = await fetch(`/api/credits/history?${params.toString()}`, { cache: "no-store" })
      const json = await res.json()
      const items: Adjustment[] = json.items || []
      setAdjustments(prev => reset ? items : [...prev, ...items])
      setAdjCursor(json.nextCursor?.cursorCreatedAt ?? null)
      setAdjHasMore(Boolean(json.nextCursor))
    } finally {
      setAdjLoading(false)
    }
  }

  useEffect(() => {
    // initial loads
    loadSpends(true)
    loadAdjustments(true)
  }, [])

  useEffect(() => {
    const id = setInterval(() => {
      const next = getInitialLocale()
      setLocale((prev) => (prev === next ? prev : next))
    }, 3000)
    return () => clearInterval(id)
  }, [])

  const t = creditsTexts[locale] ?? creditsTexts.en

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold inline-flex items-center gap-2"><CircleDollarSign size={18} className="text-yellow-400" /> {t.title}</h1>
          <p className="text-sm text-zinc-400">{t.subtitle}</p>
        </div>
        <button
          onClick={() => (tab === "spends" ? loadSpends(true) : loadAdjustments(true))}
          disabled={tab === "spends" ? spendsLoading : adjLoading}
          className="inline-flex items-center gap-2 px-3 py-1.5 rounded bg-zinc-800 hover:bg-zinc-700 text-white border border-zinc-700"
        >
          <RefreshCw size={16} className={(tab === "spends" ? spendsLoading : adjLoading) ? "animate-spin" : ""} />
          {t.refresh}
        </button>
      </div>

      <div className="flex items-center gap-3">
        <button onClick={() => setTab("spends")} className={`px-3 py-1.5 rounded border ${tab === "spends" ? "bg-zinc-800 text-white border-zinc-700" : "bg-transparent text-zinc-300 border-zinc-800"}`}>{t.spentTab}</button>
        <button onClick={() => setTab("adjustments")} className={`px-3 py-1.5 rounded border ${tab === "adjustments" ? "bg-zinc-800 text-white border-zinc-700" : "bg-transparent text-zinc-300 border-zinc-800"}`}>{t.adjustmentsTab}</button>
      </div>

      {tab === "spends" && (
        <div className="mb-2">
          <h2 className="text-base font-medium mb-2">{t.spentHeading}</h2>
          {spends.length === 0 ? (
            <div className="text-sm text-zinc-400">{t.spentEmpty}</div>
          ) : (
            <div className="overflow-x-auto border border-zinc-800 rounded-md">
              <table className="min-w-full text-sm">
                <thead className="bg-zinc-900 text-zinc-300">
                  <tr>
                    <th className="text-left px-3 py-2 font-medium">{t.date}</th>
                    <th className="text-left px-3 py-2 font-medium">{t.amount}</th>
                    <th className="text-left px-3 py-2 font-medium">{t.status}</th>
                  </tr>
                </thead>
                <tbody>
                  {spends.map((s) => (
                    <tr key={s.id} className="border-t border-zinc-800">
                      <td className="px-3 py-2 text-zinc-300">{new Date(s.createdAt as any).toLocaleString()}</td>
                      <td className="px-3 py-2 text-red-400">-{(s.creditCost ?? 0).toLocaleString()} {t.creditsSuffix}</td>
                      <td className="px-3 py-2"><span className="capitalize inline-block px-2 py-0.5 rounded bg-zinc-800 text-zinc-200">{s.status}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          {spendsHasMore && (
            <div className="mt-3">
              <button onClick={() => loadSpends(false)} disabled={spendsLoading} className="inline-flex items-center gap-2 px-3 py-1.5 rounded bg-zinc-800 hover:bg-zinc-700 text-white border border-zinc-700">
                <ChevronDown size={16} className={spendsLoading ? "animate-bounce" : ""} />
                {t.loadMore}
              </button>
            </div>
          )}
        </div>
      )}

      {tab === "adjustments" && (
        <div>
          <h2 className="text-base font-medium mb-2">{t.adjustmentsHeading}</h2>
          {adjustments.length === 0 ? (
            <div className="text-sm text-zinc-400">{t.adjustmentsEmpty}</div>
          ) : (
            <div className="overflow-x-auto border border-zinc-800 rounded-md">
              <table className="min-w-full text-sm">
                <thead className="bg-zinc-900 text-zinc-300">
                  <tr>
                    <th className="text-left px-3 py-2 font-medium">{t.date}</th>
                    <th className="text-left px-3 py-2 font-medium">{t.amount}</th>
                    <th className="text-left px-3 py-2 font-medium">{t.type}</th>
                    <th className="text-left px-3 py-2 font-medium">{t.reason}</th>
                  </tr>
                </thead>
                <tbody>
                  {adjustments.map((a) => (
                    <tr key={a.id} className="border-t border-zinc-800">
                      <td className="px-3 py-2 text-zinc-300">{new Date(a.createdAt as any).toLocaleString()}</td>
                      <td className={`px-3 py-2 ${a.amount >= 0 ? "text-green-400" : "text-red-400"}`}>
                        {a.amount >= 0 ? "+" : ""}{(a.amount ?? 0).toLocaleString()} {t.creditsSuffix}
                      </td>
                      <td className="px-3 py-2 capitalize text-zinc-200">{a.type}</td>
                      <td className="px-3 py-2 text-zinc-400">{a.reason || "—"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          {adjHasMore && (
            <div className="mt-3">
              <button onClick={() => loadAdjustments(false)} disabled={adjLoading} className="inline-flex items-center gap-2 px-3 py-1.5 rounded bg-zinc-800 hover:bg-zinc-700 text-white border border-zinc-700">
                <ChevronDown size={16} className={adjLoading ? "animate-bounce" : ""} />
                {t.loadMore}
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
