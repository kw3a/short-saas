"use client"

import { useState, useEffect } from "react"
import { usePathname } from "next/navigation"
import Link from "next/link"
import { authClient } from "@/lib/auth-client"
import { Button } from "@/components/ui/button"
import { Menu, X } from "lucide-react"
import { LoginModal } from "@/components/login-modal"
import { Logo } from "@/components/logo"

export function NavBar() {
  const { data: session } = authClient.useSession()
  const [loginOpen, setLoginOpen] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    const openHandler = () => setLoginOpen(true)
    window.addEventListener("open-login", openHandler as EventListener)
    
    return () => {
      window.removeEventListener("open-login", openHandler as EventListener)
    }
  }, [])

  const handleSignIn = async () => {
    setLoginOpen(true)
  }

  const handleSignOut = async () => {
    await authClient.signOut()
    window.location.href = "/"
  }

  const isLanding = pathname === "/"

  return (
    <div className="w-full border-b border-zinc-800 bg-zinc-900/50 backdrop-blur supports-[backdrop-filter]:bg-zinc-900/30">
      <div className="container mx-auto px-4 h-14 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center">
            <Logo className="text-2xl" />
          </Link>
          <div className="hidden md:flex items-center gap-6">
            {isLanding ? (
              <>
                <Link href="/#pricing" className="text-zinc-300 hover:text-white">Pricing</Link>
              </>
            ) : (
              <>
                <Link href="/pricing" className="text-zinc-300 hover:text-white">Pricing</Link>
                <Link href="/dashboard" className="text-zinc-300 hover:text-white">Dashboard</Link>
                <Link href="/gallery" className="text-zinc-300 hover:text-white">Gallery</Link>
              </>
            )}
          </div>
        </div>
        <div className="hidden md:flex items-center gap-3">
          {isLanding ? (
            session ? (
              <Link href="/dashboard" className="px-3 py-2 rounded bg-white text-zinc-900 hover:bg-zinc-100">Dashboard</Link>
            ) : (
              <Button onClick={handleSignIn} className="bg-white text-zinc-900 hover:bg-zinc-100">Log in</Button>
            )
          ) : (
            session ? (
              <>
                <div className="flex items-center gap-3 text-zinc-300 text-sm">
                  <span className="truncate max-w-[180px]">{session.user.email}</span>
                </div>
                <Button onClick={handleSignOut} variant="outline" className="bg-zinc-800 border-zinc-700 text-white hover:bg-zinc-700">Sign Out</Button>
              </>
            ) : (
              <Button onClick={handleSignIn} className="bg-white text-zinc-900 hover:bg-zinc-100">Log in</Button>
            )
          )}
        </div>
        <button
          type="button"
          className="md:hidden inline-flex items-center justify-center p-2 text-zinc-300 hover:text-white"
          aria-label="Toggle menu"
          onClick={() => setMobileOpen((v) => !v)}
        >
          {mobileOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Mobile panel */}
      {mobileOpen && (
        <div className="md:hidden border-t border-zinc-800 bg-zinc-900">
          <div className="container mx-auto px-4 py-3 space-y-3">
            <div className="flex flex-col gap-3">
              {isLanding ? (
                <Link href="/#pricing" className="text-zinc-300 hover:text-white" onClick={() => setMobileOpen(false)}>Pricing</Link>
              ) : (
                <>
                  <Link href="/pricing" className="text-zinc-300 hover:text-white" onClick={() => setMobileOpen(false)}>Pricing</Link>
                  <Link href="/dashboard" className="text-zinc-300 hover:text-white" onClick={() => setMobileOpen(false)}>Dashboard</Link>
                  <Link href="/gallery" className="text-zinc-300 hover:text-white" onClick={() => setMobileOpen(false)}>Gallery</Link>
                </>
              )}
            </div>
            <div className="flex items-center justify-between pt-2">
              {isLanding ? (
                session ? (
                  <Link href="/dashboard" onClick={() => setMobileOpen(false)} className="w-full text-center px-3 py-2 rounded bg-white text-zinc-900 hover:bg-zinc-100">Dashboard</Link>
                ) : (
                  <Button onClick={() => { setMobileOpen(false); handleSignIn() }} className="w-full bg-white text-zinc-900 hover:bg-zinc-100">Log in</Button>
                )
              ) : (
                session ? (
                  <>
                    <div className="flex items-center gap-2 text-zinc-300 text-sm">
                      <span className="truncate max-w-[180px]">{session.user.email}</span>
                    </div>
                    <Button onClick={handleSignOut} variant="outline" className="bg-zinc-800 border-zinc-700 text-white hover:bg-zinc-700">Sign Out</Button>
                  </>
                ) : (
                  <Button onClick={() => { setMobileOpen(false); handleSignIn() }} className="w-full bg-white text-zinc-900 hover:bg-zinc-100">Log in</Button>
                )
              )}
            </div>
          </div>
        </div>
      )}
      <LoginModal open={loginOpen} onOpenChange={setLoginOpen} />
    </div>
  )
}
