import type { Metadata } from "next"
import { headers } from "next/headers"
import NarratedVideoForm from "@/components/narrated-video-form"
import { detectLocale, supportedLocales, type Locale, getDashboardMessages } from "@/lib/i18n"

async function resolveLocale(): Promise<Locale> {
  const h = await headers()
  const cookieHeader = h.get("cookie") ?? ""
  if (cookieHeader) {
    const match = cookieHeader.match(/(?:^|; )lang=(en|es)(?:;|$)/)
    const cookieLang = match?.[1] as Locale | undefined
    if (cookieLang && supportedLocales.includes(cookieLang)) {
      return cookieLang
    }
  }
  return detectLocale(h.get("accept-language") ?? null)
}

export async function generateMetadata(): Promise<Metadata> {
  const locale = await resolveLocale()
  const messages = getDashboardMessages(locale)
  return {
    title: messages.metadata.title,
    description: messages.metadata.description,
  }
}

export default async function DashboardGeneratePage() {
  const locale = await resolveLocale()
  const messages = getDashboardMessages(locale)
  return (
    <div>
      <h1 className="text-xl font-semibold mb-2 text-center">{messages.forms.narration.pageTitle}</h1>
      <p className="text-sm text-zinc-400 mb-4 text-center">{messages.forms.narration.pageSubtitle}</p>
      <NarratedVideoForm messages={messages.forms.narration} />
    </div>
  )
}
