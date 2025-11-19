"use client"

import { ChevronDown } from "lucide-react"
import { useState } from "react"
import type { LandingMessages } from "@/lib/i18n"
import { landingMessages } from "@/lib/i18n"

type FAQMessages = LandingMessages["faq"]

const defaultMessages = landingMessages.en.faq

export function FAQ({ messages }: { messages?: FAQMessages }) {
  const [openIndex, setOpenIndex] = useState<number | null>(null)
  const m = messages ?? defaultMessages

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index)
  }

  return (
    <section className="py-20 bg-gradient-to-b from-zinc-900/50 to-zinc-950">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">{m.sectionTitle}</h2>
          <p className="text-zinc-400 max-w-2xl mx-auto">
            {m.sectionSubtitle}
          </p>
        </div>
        
        <div className="max-w-3xl mx-auto space-y-4">
          {m.items.map((faq, index) => (
            <div key={index} className="border border-zinc-800 rounded-lg overflow-hidden">
              <button
                className="w-full px-6 py-4 text-left flex items-center justify-between bg-zinc-900/50 hover:bg-zinc-800/50 transition-colors"
                onClick={() => toggleFAQ(index)}
              >
                <span className="font-medium text-white">{faq.question}</span>
                <ChevronDown 
                  className={`w-5 h-5 text-zinc-400 transition-transform duration-200 ${openIndex === index ? 'transform rotate-180' : ''}`} 
                />
              </button>
              {openIndex === index && (
                <div className="px-6 py-4 bg-zinc-900/30 text-zinc-300">
                  {faq.answer}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
