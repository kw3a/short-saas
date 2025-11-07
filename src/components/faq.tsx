"use client"

import { ChevronDown } from "lucide-react"
import { useState } from "react"

const faqs = [
  {
    question: "How does the credit system work?",
    answer: "ViralShort uses a credit-based system where each video generation cost is based on the amount of characters in the prompt. 1 credit = 1 character"
  },
  {
    question: "What can I create with ViralShort?",
    answer: "You can create engaging short-form videos for platforms like TikTok, Instagram Reels, and YouTube Shorts. Our AI helps you generate professional-quality content in minutes, complete with visuals and voiceovers."
  },
  {
    question: "How long does it take to generate a video?",
    answer: "Most videos are generated in under 2 minutes, depending on the length, complexity and load of the server."
  },
  {
    question: "Can I download my generated videos?",
    answer: "Yes, you can download your generated videos anytime."
  },
  {
    question: "How to create watermark-free videos?",
    answer: "Buy any credit package and your videos will be always watermark-free."
  },
  {
    question: "In how much time the credits expire?",
    answer: "The credits never expire."
  }
]

export function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index)
  }

  return (
    <section className="py-20 bg-gradient-to-b from-zinc-900/50 to-zinc-950">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Frequently Asked Questions</h2>
          <p className="text-zinc-400 max-w-2xl mx-auto">
            Everything you need to know about ViralShort. Can't find the answer you're looking for? Contact our support team.
          </p>
        </div>
        
        <div className="max-w-3xl mx-auto space-y-4">
          {faqs.map((faq, index) => (
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
