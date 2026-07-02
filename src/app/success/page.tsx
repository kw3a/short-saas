import type { Metadata } from "next"
import Link from "next/link"

export const metadata: Metadata = {
  title: "Purchase Successful — ViralShort",
  description: "Your payment was successful. Credits will be available shortly. Start generating your next video.",
  robots: { index: false, follow: false },
}

export default async function SuccessPage() {

  return (
    <div className="min-h-screen bg-zinc-950 text-white flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        <h1 className="text-2xl font-semibold mb-3">🎉 Purchase successful!</h1>
        <p className="text-zinc-300 mb-6">Your purchase was successful. Credits will be available shortly.</p>
        <Link href="/dashboard" className="inline-block px-4 py-2 rounded bg-white text-zinc-900 hover:bg-zinc-100">Start generating!</Link>
      </div>
    </div>
  )
}
