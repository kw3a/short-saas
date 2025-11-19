"use client"
import GalleryList from "@/components/gallery/GalleryList"
import { RefreshCcw } from "lucide-react"
import { useEffect, useState } from "react"
import type { Locale } from "@/lib/i18n"

const galleryTexts: Record<Locale, { title: string; subtitle: string; refreshAria: string }> = {
  en: {
    title: "Your Gallery",
    subtitle: "Click a thumbnail to load and play the video.",
    refreshAria: "Refresh gallery",
  },
  es: {
    title: "Tu galería",
    subtitle: "Haz clic en una miniatura para cargar y reproducir el video.",
    refreshAria: "Actualizar galería",
  },
}

function getInitialLocale(): Locale {
  if (typeof document === "undefined") return "en"
  const match = document.cookie.match(/(?:^|; )lang=(en|es)(?:;|$)/)
  return (match?.[1] as Locale | undefined) ?? "en"
}

export default function DashboardGalleryPage() {
  const [locale, setLocale] = useState<Locale>(getInitialLocale)

  useEffect(() => {
    // Keep locale in sync if cookie changes via navbar toggle
    const id = setInterval(() => {
      const next = getInitialLocale()
      setLocale((prev) => (prev === next ? prev : next))
    }, 3000)
    return () => clearInterval(id)
  }, [])

  const t = galleryTexts[locale] ?? galleryTexts.en
  return (
    <div>
      <div className="p-4 sm:p-6 md:p-8">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h1 className="text-xl font-semibold text-white mb-2">{t.title}</h1>
            <p className="text-sm text-zinc-400">{t.subtitle}</p>
          </div>
          <button
            type="button"
            aria-label={t.refreshAria}
            onClick={() => window.dispatchEvent(new Event('gallery:refresh'))}
            className="inline-flex items-center justify-center h-11 w-11 aspect-square rounded-md bg-zinc-800 hover:bg-zinc-700 text-white"
          >
            <RefreshCcw className="h-5 w-5" />
          </button>
        </div>
      </div>
      <GalleryList />
    </div>
  )
}
