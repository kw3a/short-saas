import Link from "next/link"
import type { LandingMessages } from "@/lib/i18n"
import { landingMessages } from "@/lib/i18n"

type FooterMessages = LandingMessages["footer"]

const defaultMessages = landingMessages.en.footer

export function Footer({ messages }: { messages?: FooterMessages }) {
  const currentYear = new Date().getFullYear()
  const m = messages ?? defaultMessages
  
  return (
    <footer className="bg-zinc-950 text-white py-12">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-start gap-8 mb-8">
          {/* Logo Section */}
          <div className="w-full md:w-1/3">
            <h2 className="text-2xl font-bold mb-4">ViralShort</h2>
            <p className="text-zinc-400 text-sm">
              © {currentYear} ViralShort
            </p>
          </div>
          
          {/* Navigation Links */}
          <div className="w-full md:w-1/3">
            <h3 className="font-semibold mb-4">{m.productsTitle}</h3>
            <nav className="flex flex-col space-y-2">
              <Link href="/dashboard/narration" className="text-zinc-400 hover:text-white transition-colors">
                {m.narratedStories}
              </Link>
              <Link href="/dashboard/askreddit" className="text-zinc-400 hover:text-white transition-colors">
                {m.askredditShorts}
              </Link>
            </nav>
          </div>
          
          <div className="w-full md:w-1/3">
            <h3 className="font-semibold mb-4">{m.aboutTitle}</h3>
            <nav className="flex flex-col space-y-2">
              <Link href="/terms" className="text-zinc-400 hover:text-white transition-colors">
                {m.terms}
              </Link>
              <Link href="/privacy" className="text-zinc-400 hover:text-white transition-colors">
                {m.privacy}
              </Link>
            </nav>
          </div>
        </div>
      </div>
    </footer>
  )
}
