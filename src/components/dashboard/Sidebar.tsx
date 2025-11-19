"use client"

import { useState, useEffect } from 'react'
import Link from "next/link"
import { useCredits } from "@/contexts/CreditBalanceContext"
import { authClient } from "@/lib/auth-client"
import { Button } from "@/components/ui/button"
import { LoginModal } from "@/components/login-modal"
import { Logo } from "@/components/logo"
import { LanguageToggle } from "@/components/language-toggle"
import { 
  CircleDollarSign, 
  Plus, 
  Clock, 
  History, 
  User, 
  LogOut, 
  Play, 
  MessageSquare,
  Image as ImageIcon 
} from "lucide-react"
import type { DashboardMessages } from "@/lib/i18n"

type SidebarMessages = DashboardMessages["sidebar"]

export default function Sidebar({ messages }: { messages: SidebarMessages }) {
  const { data: session, isPending } = authClient.useSession() as any
  const [loginOpen, setLoginOpen] = useState(false)
  const { credits, isLoading: creditsLoading } = useCredits()
  const sessionLoading = Boolean(isPending)

  useEffect(() => {
    const openHandler = () => setLoginOpen(true)
    window.addEventListener("open-login", openHandler as EventListener)
    return () => {
      window.removeEventListener("open-login", openHandler as EventListener)
    }
  }, [])

  return (
    <aside className="w-64 shrink-0 h-full overflow-y-auto border-r border-zinc-800 bg-zinc-950 p-4 hidden md:flex md:flex-col">
      {/* App Logo */}
      <Link href="/dashboard" className="mb-6 block">
        <Logo />
      </Link>
      
      {/* Main Navigation */}
      <nav className="flex-1 space-y-6">
        <div>
          <h3 className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-2 px-3">{messages.videoGenerationSection}</h3>
          <div className="space-y-1">
            <Link href="/dashboard/narration" className="flex items-center gap-2 px-3 py-2 rounded text-zinc-300 hover:text-white hover:bg-zinc-800/50 transition-colors">
              <Play className="w-4 h-4" />
              <span>{messages.narrationLink}</span>
            </Link>
            <Link href="/dashboard/askreddit" className="flex items-center gap-2 px-3 py-2 rounded text-zinc-300 hover:text-white hover:bg-zinc-800/50 transition-colors">
              <MessageSquare className="w-4 h-4" />
              <span>{messages.askredditLink}</span>
            </Link>
          </div>
        </div>

        <div>
          <h3 className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-2 px-3">{messages.historySection}</h3>
          <div className="space-y-1">
            <Link href="/dashboard/gallery" className="flex items-center gap-2 px-3 py-2 rounded text-zinc-300 hover:text-white hover:bg-zinc-800/50 transition-colors">
              <ImageIcon className="w-4 h-4" />
              <span>{messages.galleryLink}</span>
            </Link>
            <Link href="/dashboard/purchases" className="flex items-center gap-2 px-3 py-2 rounded text-zinc-300 hover:text-white hover:bg-zinc-800/50 transition-colors">
              <History className="w-4 h-4" />
              <span>{messages.purchaseHistoryLink}</span>
            </Link>
            <Link href="/dashboard/credits" className="flex items-center gap-2 px-3 py-2 rounded text-zinc-300 hover:text-white hover:bg-zinc-800/50 transition-colors">
              <Clock className="w-4 h-4" />
              <span>{messages.creditHistoryLink}</span>
            </Link>
          </div>
        </div>
        <div className="px-3 pt-4">
          <LanguageToggle size="full" />
        </div>
      </nav>

      {/* User Section */}
      <div className="pt-4 border-t border-zinc-800 mt-auto">
        {sessionLoading ? (
          <div className="flex items-center justify-center py-2">
            <div className="h-6 w-6 rounded-full border-2 border-zinc-700 border-t-white animate-spin" />
          </div>
        ) : session ? (
          <div className="space-y-3">
            {credits !== null && (
              <div className="bg-zinc-900/50 rounded-lg p-3 mb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 px-2 py-1.5 rounded-md hover:bg-zinc-800">
                    <CircleDollarSign size={18} className="text-yellow-400" />
                    <span className="text-sm">
                      {creditsLoading ? messages.creditsLoading : `${credits?.toLocaleString()} ${messages.creditsSuffix}`}
                    </span>
                  </div>
                  <Link 
                    href="/dashboard/buy" 
                    className="p-1.5 rounded-md bg-yellow-500/20 hover:bg-yellow-500/30 text-yellow-400 hover:text-yellow-300 transition-colors"
                    title={messages.buyCreditsTitle}
                  >
                    <Plus className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            )}
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full flex items-center justify-center">
                  <User className="w-4 h-4 text-zinc-400" />
                </div>
                <div>
                  <div className="text-xs text-zinc-400 truncate max-w-[140px]">{session.user.email}</div>
                </div>
              </div>
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => authClient.signOut().then(() => { window.location.href = "/" })}
                className="text-zinc-400 hover:bg-zinc-800 hover:text-white"
                title={messages.signOut}
              >
                <LogOut className="w-4 h-4" />
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-2">
            <Button 
              onClick={() => setLoginOpen(true)} 
              className="w-full bg-zinc-800 hover:bg-zinc-700 text-white"
            >
              {messages.signIn}
            </Button>
            <LoginModal open={loginOpen} onOpenChange={setLoginOpen} />
          </div>
        )}
      </div>
    </aside>
  )
}
