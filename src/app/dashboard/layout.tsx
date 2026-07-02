import type { Metadata } from "next"
import { CreditBalanceProvider } from "@/contexts/CreditBalanceContext"
import Sidebar from "@/components/dashboard/Sidebar"
import MobileTopBar from "@/components/dashboard/MobileTopBar"
import { getDashboardMessages, resolveRequestLocale } from "@/lib/i18n"

// Private, auth-gated area — keep it out of search engines.
export const metadata: Metadata = {
  robots: { index: false, follow: false },
}

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const locale = await resolveRequestLocale()
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
