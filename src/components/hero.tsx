"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "./ui/button"
import { Play } from "lucide-react"
import type { LandingMessages } from "@/lib/i18n"

type HeroMessages = LandingMessages["hero"]

export function Hero({ messages }: { messages: HeroMessages }) {
  const assetsURL = process.env.NEXT_PUBLIC_ASSETS_URL
  const [monetizationOpen, setMonetizationOpen] = useState(false)
  return (
    <div className="min-h-screen flex flex-col justify-center">
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Column - Text & Buttons */}
          <div className="text-center lg:text-left">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 text-white">
              {messages.title}
            </h1>
            <p className="text-xl text-zinc-300 mb-8 max-w-2xl lg:max-w-none">
              {messages.subtitle}
            </p>
            <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
              <Link href="/dashboard" className="w-full sm:w-auto">
                <Button className="w-full sm:w-auto px-6 py-3 sm:px-8 sm:py-4 text-base sm:text-lg bg-white text-gray-900 hover:bg-gray-100 transition-all shadow-lg hover:shadow-xl border border-gray-200 font-medium flex items-center justify-center gap-2 group rounded-none">
                  <Play className="w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-0.5 transition-transform flex-shrink-0" />
                  <span>{messages.primaryCta}</span>
                </Button>
              </Link>
              <Link href="#products" className="w-full sm:w-auto">
                <Button className="w-full sm:w-auto px-6 py-3 sm:px-8 sm:py-4 text-base sm:text-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors shadow-lg">
                  {messages.secondaryCta}
                </Button>
              </Link>
            </div>
            
            {/* Feature List */}
            <div className="mt-6 space-y-3 text-left">
              {messages.bullets.map((text, idx) => (
                <div key={idx} className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  <span className="text-sm text-zinc-300">{text}</span>
                </div>
              ))}
            </div>
            
            <div className="mt-4 text-zinc-400 text-sm">
              {messages.note}
            </div>
            <div className="mt-4">
              <Button
                className="w-full sm:w-auto px-6 sm:px-7 py-3 text-sm sm:text-base bg-gradient-to-r from-yellow-300 via-amber-300 to-yellow-400 text-zinc-900 font-semibold shadow-lg hover:shadow-yellow-500/30 hover:brightness-105 border border-yellow-300"
                onClick={() => setMonetizationOpen(true)}
              >
                {messages.monetizationCta}
              </Button>
            </div>
          </div>

          {/* Right Column - Video Preview */}
          <div className="relative overflow-hidden shadow-2xl">
            <video 
              autoPlay 
              loop 
              muted 
              playsInline
              className="w-full h-auto"
              poster={`${assetsURL}/preview1.png`}
            >
              <source src={`${assetsURL}/example1.mp4`} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          </div>
        </div>
      </div>
      {monetizationOpen && (
        <div className="fixed inset-0 z-40 flex items-center justify-center px-4">
          <div
            className="absolute inset-0 bg-black/70"
            onClick={() => setMonetizationOpen(false)}
          />
          <div className="relative w-full max-w-lg bg-zinc-900 border border-zinc-800 rounded-xl shadow-2xl p-6 z-50 max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl sm:text-2xl font-semibold text-white mb-3 text-center">
              {messages.monetizationModalTitle}
            </h2>
            <ol className="space-y-3 text-sm sm:text-base text-zinc-300 list-decimal list-inside">
              {messages.monetizationModalBody.map((line, idx) => (
                <li key={idx} className="leading-relaxed">
                  {line}
                </li>
              ))}
            </ol>
            <div className="mt-6 flex justify-center">
              <Button
                className="px-6 py-2 rounded-full bg-zinc-800 text-zinc-100 hover:bg-zinc-700 border border-zinc-700 text-sm"
                onClick={() => setMonetizationOpen(false)}
              >
                {messages.monetizationModalClose}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
