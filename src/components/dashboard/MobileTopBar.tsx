"use client"

import { Menu, X, Play, MessageSquare, Image as ImageIcon, History, Clock, CircleDollarSign, Plus, User } from "lucide-react"
import { useState } from "react"
import Link from "next/link"
import { authClient } from "@/lib/auth-client"
import { Button } from "@/components/ui/button"
import { LoginModal } from "@/components/login-modal"
import { useCredits } from "@/contexts/CreditBalanceContext"
import { Logo } from "@/components/logo"

export default function MobileTopBar() {
  const { data: session, isPending } = authClient.useSession() as any
  const [open, setOpen] = useState(false)
  const [loginOpen, setLoginOpen] = useState(false)
  const { credits, isLoading: creditsLoading } = useCredits()

  return (
    <div className="md:hidden sticky top-0 z-20 bg-zinc-950 border-b border-zinc-800 h-12 px-3 flex items-center justify-between">
      <Link href="/dashboard">
        <Logo className="-ml-1" />
      </Link>
      <button aria-label="Open menu" className="text-zinc-300" onClick={() => setOpen(true)}>
        <Menu size={20} />
      </button>

      {open && (
        <div className="fixed inset-0 z-30 bg-black/50" onClick={() => setOpen(false)}>
          <div className="absolute right-0 top-0 bottom-0 w-72 bg-zinc-950 border-l border-zinc-800 p-4" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <div className="text-white font-semibold">Menu</div>
              <button aria-label="Close menu" className="text-zinc-300" onClick={() => setOpen(false)}>
                <X size={18} />
              </button>
            </div>

            <div className="space-y-6">
              {/* Video Generation Section */}
              <div>
                <h3 className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-2 px-3">Video Generation</h3>
                <nav className="space-y-1 text-sm">
                  <Link 
                    href="/dashboard/narration" 
                    onClick={() => setOpen(false)} 
                    className="flex items-center gap-2 px-3 py-2 rounded text-zinc-300 hover:text-white hover:bg-zinc-800/50 transition-colors"
                  >
                    <Play className="w-4 h-4" />
                    <span>Narrated Story</span>
                  </Link>
                  <Link 
                    href="/dashboard/askreddit" 
                    onClick={() => setOpen(false)} 
                    className="flex items-center gap-2 px-3 py-2 rounded text-zinc-300 hover:text-white hover:bg-zinc-800/50 transition-colors"
                  >
                    <MessageSquare className="w-4 h-4" />
                    <span>AskReddit</span>
                  </Link>
                </nav>
              </div>

              {/* History Section */}
              <div>
                <h3 className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-2 px-3">History</h3>
                <nav className="space-y-1 text-sm">
                  <Link 
                    href="/dashboard/gallery" 
                    onClick={() => setOpen(false)} 
                    className="flex items-center gap-2 px-3 py-2 rounded text-zinc-300 hover:text-white hover:bg-zinc-800/50 transition-colors"
                  >
                    <ImageIcon className="w-4 h-4" />
                    <span>Gallery</span>
                  </Link>
                  <Link 
                    href="/dashboard/purchases" 
                    onClick={() => setOpen(false)} 
                    className="flex items-center gap-2 px-3 py-2 rounded text-zinc-300 hover:text-white hover:bg-zinc-800/50 transition-colors"
                  >
                    <History className="w-4 h-4" />
                    <span>Purchase History</span>
                  </Link>
                  <Link 
                    href="/dashboard/credits" 
                    onClick={() => setOpen(false)} 
                    className="flex items-center gap-2 px-3 py-2 rounded text-zinc-300 hover:text-white hover:bg-zinc-800/50 transition-colors"
                  >
                    <Clock className="w-4 h-4" />
                    <span>Credit History</span>
                  </Link>
                </nav>
              </div>
            </div>

            <div className="mt-4 border-t border-zinc-800 pt-3">
              {isPending ? (
                <div className="flex items-center justify-center py-2">
                  <div className="h-6 w-6 rounded-full border-2 border-zinc-700 border-t-white animate-spin" />
                </div>
              ) : session ? (
                <div className="space-y-3">
                  <div className="bg-zinc-900/50 rounded-lg p-3 mb-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 px-3 py-2 text-sm bg-zinc-800/50 rounded-lg">
                        <CircleDollarSign size={16} className="text-yellow-400" />
                        <span>{creditsLoading ? 'Loading...' : credits?.toLocaleString() || 0} credits</span>
                      </div>
                      <Link 
                        href="/dashboard/buy" 
                        className="p-1.5 rounded-md bg-yellow-500/20 hover:bg-yellow-500/30 text-yellow-400 hover:text-yellow-300 transition-colors"
                        title="Buy more credits"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <Plus className="w-4 h-4" />
                      </Link>
                    </div>
                  </div>
                  <div className="text-xs text-zinc-400 truncate">{session.user.email}</div>
                  <Button 
                    onClick={() => authClient.signOut().then(() => { window.location.href = "/" })} 
                    className="w-full bg-zinc-800 hover:bg-zinc-700 text-white"
                  >
                    Sign Out
                  </Button>
                </div>
              ) : (
                <>
                  <Button onClick={() => setLoginOpen(true)} className="w-full bg-white text-zinc-900 hover:bg-zinc-100">Log in</Button>
                  <LoginModal open={loginOpen} onOpenChange={setLoginOpen} />
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
