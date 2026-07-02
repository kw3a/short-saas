import type { Locale } from "@/lib/i18n"

/**
 * Canonical, absolute URL of the production site (no trailing slash).
 * Override per-environment with NEXT_PUBLIC_SITE_URL.
 */
export const siteUrl = (
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://viralshort.app"
).replace(/\/$/, "")

export const siteConfig = {
  name: "ViralShort",
  url: siteUrl,
  twitter: "@viralshort",
  keywords: [
    "AI video generator",
    "faceless video generator",
    "viral shorts",
    "AskReddit videos",
    "TikTok video maker",
    "YouTube Shorts maker",
    "Reels generator",
    "text to video",
    "AI voiceover",
    "narrated story video",
  ],
} as const

/** Build an absolute URL from a site-relative path. */
export function absoluteUrl(path = "/"): string {
  return `${siteUrl}${path.startsWith("/") ? path : `/${path}`}`
}

/** Open Graph locale codes keyed by app locale. */
export const ogLocale: Record<Locale, string> = {
  en: "en_US",
  es: "es_ES",
}
