"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import type { Locale } from "@/lib/i18n"

interface LanguageToggleProps {
  size?: "nav" | "full"
  onBeforeToggle?: () => void
}

export function LanguageToggle({ size = "nav", onBeforeToggle }: LanguageToggleProps) {
  const [currentLocale, setCurrentLocale] = useState<Locale>("en")

  useEffect(() => {
    if (typeof document === "undefined") return
    const match = document.cookie.match(/(?:^|; )lang=(en|es)(?:;|$)/)
    const lang = (match?.[1] as Locale | undefined) ?? "en"
    setCurrentLocale(lang)
  }, [])

  const handleToggle = () => {
    onBeforeToggle?.()
    const next: Locale = currentLocale === "en" ? "es" : "en"
    document.cookie = `lang=${next}; path=/; max-age=${60 * 60 * 24 * 365}`
    window.location.reload()
  }

  const wrapperClass =
    size === "nav"
      ? "ml-3 w-[140px] bg-gradient-to-r from-emerald-400 via-lime-400 to-green-500 rounded-md p-[2px] shadow-[0_0_12px_rgba(34,197,94,0.6)]"
      : "w-full bg-gradient-to-r from-emerald-400 via-lime-400 to-green-500 rounded-md p-[2px] shadow-[0_0_12px_rgba(34,197,94,0.6)]"

  return (
    <div className={wrapperClass}>
      <Button
        onClick={handleToggle}
        variant="outline"
        className="w-full border-none text-zinc-200 bg-zinc-900 hover:bg-zinc-800 flex items-center justify-center gap-2"
      >
        <span>{currentLocale === "en" ? "\uD83C\uDDFA\uD83C\uDDF8" : "\uD83C\uDDEA\uD83C\uDDF8"}</span>
        <span className="text-sm font-medium">
          <span className={currentLocale === "en" ? "font-semibold text-white" : "text-zinc-400"}>EN</span>
          <span className="mx-1 text-zinc-500">/</span>
          <span className={currentLocale === "es" ? "font-semibold text-white" : "text-zinc-400"}>ES</span>
        </span>
      </Button>
    </div>
  )
}
