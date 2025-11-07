import { CreditBalanceProvider } from "@/contexts/CreditBalanceContext"
import Sidebar from "@/components/dashboard/Sidebar"
import MobileTopBar from "@/components/dashboard/MobileTopBar"

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <CreditBalanceProvider>
      <div className="h-screen bg-zinc-950 text-white">
        <div className="md:hidden"><MobileTopBar /></div>
        <div className="flex h-[calc(100%-48px)] md:h-full">
          <Sidebar />
          <main className="flex-1 h-full overflow-y-auto p-4 md:p-6">
            {children}
          </main>
        </div>
      </div>
    </CreditBalanceProvider>
  )
}
