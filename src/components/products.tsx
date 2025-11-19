"use client"

import Link from "next/link"
import { Button } from "./ui/button"
import { Play, MessageSquare, Zap } from "lucide-react"
import type { LandingMessages } from "@/lib/i18n"
import { landingMessages } from "@/lib/i18n"

type ProductsMessages = LandingMessages["products"]

const defaultMessages = landingMessages.en.products

export function Products({ messages }: { messages?: ProductsMessages }) {
  const m = messages ?? defaultMessages
  const products = [
    {
      id: "narration",
      name: m.items.narrationName,
      description: m.items.narrationDescription,
      icon: <Play className="w-6 h-6 text-blue-500" />,
      href: "/dashboard/narration",
    },
    {
      id: "askreddit",
      name: m.items.askredditName,
      description: m.items.askredditDescription,
      icon: <MessageSquare className="w-6 h-6 text-blue-400" />,
      href: "/dashboard/askreddit",
    },
    {
      id: "coming-soon",
      name: m.items.comingSoonName,
      description: m.items.comingSoonDescription,
      icon: <Zap className="w-6 h-6 text-blue-300" />,
      href: "#",
      disabled: true,
    },
  ]
  return (
    <section id="products" className="py-20 bg-zinc-900/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">{m.sectionTitle}</h2>
          <p className="text-zinc-400 max-w-2xl mx-auto">
            {m.sectionSubtitle}
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {products.map((product) => (
            <div 
              key={product.id}
              className={`p-6 rounded-xl border ${product.disabled ? 'border-zinc-800 bg-zinc-900/50' : 'border-zinc-700 bg-zinc-900/30 hover:border-zinc-600'} transition-colors`}
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 rounded-lg bg-zinc-800/50">
                  {product.icon}
                </div>
                <h3 className="text-xl font-semibold">{product.name}</h3>
              </div>
              <p className="text-zinc-400 mb-6">{product.description}</p>
              {product.disabled ? (
                <Button 
                  variant="outline" 
                  className="w-full border-zinc-700 text-zinc-400 cursor-not-allowed"
                  disabled
                >
                  {m.items.comingSoonCta}
                </Button>
              ) : (
                <Link href={product.href} className="block">
                  <Button className="w-full bg-blue-600 hover:bg-blue-700">
                    {m.items.tryPrefix}{product.name}
                  </Button>
                </Link>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
