import type { Metadata } from "next"
import { headers } from "next/headers"
import { PricingPlans } from "@/components/pricing-plans"
import { getActivePricingPlans } from "@/lib/pricing"
import { CircleDollarSign } from "lucide-react"
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

export default async function DashboardBuyCreditsPage() {
  const plans = getActivePricingPlans()
  const locale = await resolveLocale()
  const messages = getDashboardMessages(locale)
  
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      <div className="mb-10 text-center">
        <h1 className="text-3xl font-bold text-white mb-3 inline-flex items-center justify-center gap-2">
          <CircleDollarSign size={24} className="text-yellow-400" /> {messages.forms.buy.title}
        </h1>
        <p className="text-zinc-400 max-w-2xl mx-auto">
          {messages.forms.buy.subtitle}
        </p>
      </div>
      <div className="max-w-5xl mx-auto">
        <PricingPlans plans={plans} />
      </div>
    </div>
  )
}
