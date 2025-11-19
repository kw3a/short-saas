import type { Metadata } from "next"
import { headers } from "next/headers"
import Link from "next/link"
import { Play, MessageSquare, Plus } from "lucide-react"
import Image from "next/image"
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

export default async function DashboardPage() {
  const assetsURL = process.env.NEXT_PUBLIC_ASSETS_URL
  const locale = await resolveLocale()
  const messages = getDashboardMessages(locale)
  return (
    <div className="container mx-auto px-4 py-6 space-y-10">
      {/* Steps + Promo side-by-side */}
      <section>
        <div className="grid gap-6 lg:grid-cols-3 items-stretch">
          {/* Steps (span 2) */}
          <div className="lg:col-span-2">
            <h2 className="text-xl font-semibold text-white mb-4">{messages.main.stepsTitle}</h2>
            <ol className="grid gap-6 sm:grid-cols-3">
              <li className="flex items-start gap-3">
                <span className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-white text-zinc-900 text-sm font-semibold">1</span>
                <div>
                  <div className="font-medium text-white">{messages.main.step1Title}</div>
                  <p className="text-sm text-zinc-400">{messages.main.step1Description}</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-white text-zinc-900 text-sm font-semibold">2</span>
                <div>
                  <div className="font-medium text-white">{messages.main.step2Title}</div>
                  <p className="text-sm text-zinc-400">{messages.main.step2Description}</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-white text-zinc-900 text-sm font-semibold">3</span>
                <div>
                  <div className="font-medium text-white">{messages.main.step3Title}</div>
                  <p className="text-sm text-zinc-400">{messages.main.step3Description}</p>
                </div>
              </li>
            </ol>
          </div>
          {/* Promo (span 1) */}
          <div className="p-5 bg-zinc-950 border border-zinc-800 border-l-4 border-l-yellow-400 shadow-sm flex flex-col items-start justify-between gap-4">
            <div>
              <h2 className="text-lg font-semibold text-white">{messages.main.promoTitle}</h2>
              <p className="text-sm text-zinc-400 mt-1">{messages.main.promoSubtitle}</p>
            </div>
            <Link href="/dashboard/buy" className="inline-flex items-center justify-center rounded-md bg-blue-600 text-white px-4 py-2 text-sm font-medium hover:bg-blue-500">
              {messages.main.promoCta}
            </Link>
          </div>
        </div>
      </section>

      {/* Tools section */}
      <section>
        <h2 className="text-xl font-semibold text-white mb-4">{messages.main.toolsTitle}</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {/* Narration card */}
          <div className="rounded-lg border border-zinc-800 bg-zinc-950 overflow-hidden">
            <div className="aspect-square bg-zinc-900 relative overflow-hidden">
              <Image
                src={`${assetsURL}/example1.jpg`}
                alt="Narration"
                fill
                className="object-cover"
                sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                priority={false}
              />
            </div>
            <div className="p-4 space-y-2">
              <h3 className="text-white font-medium">{messages.main.narrationTitle}</h3>
              <p className="text-sm text-zinc-400">{messages.main.narrationDescription}</p>
              <Link href="/dashboard/narration" className="inline-flex items-center gap-2 justify-center rounded-md bg-white text-zinc-900 hover:bg-zinc-200 px-3 py-2 text-sm font-medium">
                <Plus className="w-4 h-4" />
                {messages.main.narrationCta}
              </Link>
            </div>
          </div>

          {/* AskReddit card */}
          <div className="rounded-lg border border-zinc-800 bg-zinc-950 overflow-hidden">
            <div className="aspect-square bg-zinc-900 relative overflow-hidden">
              <Image
                src={`${assetsURL}/askreddit1.jpg`}
                alt="Askreddit Example"
                fill
                className="object-cover"
                sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                priority={false}
              />
            </div>
            <div className="p-4 space-y-2">
              <h3 className="text-white font-medium">{messages.main.askredditTitle}</h3>
              <p className="text-sm text-zinc-400">{messages.main.askredditDescription}</p>
              <Link href="/dashboard/askreddit" className="inline-flex items-center gap-2 justify-center rounded-md bg-white text-zinc-900 hover:bg-zinc-200 px-3 py-2 text-sm font-medium">
                <Plus className="w-4 h-4" />
                {messages.main.askredditCta}
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
