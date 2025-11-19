import { CreditBalanceProvider } from "@/contexts/CreditBalanceContext"
import Sidebar from "@/components/dashboard/Sidebar"
import MobileTopBar from "@/components/dashboard/MobileTopBar"
import { headers } from "next/headers"
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

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const locale = await resolveLocale()
  const messages = getDashboardMessages(locale)
  return (
    <CreditBalanceProvider>
      <div className="h-screen bg-zinc-950 text-white">
        <div className="md:hidden"><MobileTopBar messages={messages.mobile} /></div>
        <div className="flex h-[calc(100%-48px)] md:h-full">
          <Sidebar messages={messages.sidebar} />
          <main className="flex-1 h-full overflow-y-auto p-4 md:p-6">
            {children}
          </main>
        </div>
      </div>
    </CreditBalanceProvider>
  )
}
