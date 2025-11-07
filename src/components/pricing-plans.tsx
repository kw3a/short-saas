"use client"

import { useState } from "react"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import authClient from "@/lib/auth-client"
import { CircleDollarSign, Check } from "lucide-react"
import { PricingPlan } from "@/lib/pricing"

export function PricingPlans({ plans }: { plans: PricingPlan[] }) {
  const { data: session } = authClient.useSession()
  const [loading, setLoading] = useState<string | null>(null)

  const handleSubscribe = async (slug: string) => {
    try {
      setLoading(slug)
      if (!session) {
        if (typeof window !== "undefined") {
          window.dispatchEvent(new Event("open-login"))
        }
        return
      }
      await authClient.checkout({ slug })
    } finally {
      setLoading(null)
    }
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto px-4 items-stretch">
      {plans.map((plan) => (
        <div key={plan.name} className="relative h-full">
          {plan.highlight && (
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-blue-600 text-white text-xs font-semibold px-3 py-1 rounded-full whitespace-nowrap z-10">
              Most Popular
            </div>
          )}
          <Card
            className={
              (plan.highlight
                ? "border-blue-500/60 shadow-[0_0_0_1px_rgba(59,130,246,0.5)]"
                : "border-zinc-800") +
              " bg-zinc-900 h-full flex flex-col"
            }
          >
            <CardHeader className="p-4 pb-2">
              <div className="flex items-center justify-between gap-2">
                <CardTitle className="text-white text-lg sm:text-xl">
                  {plan.name}
                </CardTitle>
                {plan.savings > 0 && (
                  <span className="text-sm font-medium text-green-400">
                    Save {plan.savings}%
                  </span>
                )}
              </div>
            <div className="mt-1 text-2xl sm:text-3xl font-semibold text-white">
              ${ (plan.priceCents / 100).toLocaleString() }
            </div>
            <CardDescription className="text-yellow-400 text-base sm:text-lg">
              <span className="inline-flex items-center gap-1.5 whitespace-nowrap font-medium">
                {plan.credits.toLocaleString()} <CircleDollarSign size={18} className="text-yellow-400" />
              </span>
            </CardDescription>
            <div className="text-zinc-500 text-xs sm:text-sm mt-0.5">
              ~ {(plan.credits / 1000).toLocaleString()} minutes of videos
            </div>
            <div className="mt-3 h-px bg-zinc-800" />
          </CardHeader>
          <CardContent className="p-4 pt-2 flex-1 flex flex-col">
            <ul className="space-y-2 text-sm text-zinc-300 mb-4">
              <li className="flex items-center gap-2">
                <Check size={16} className="text-green-500" />
                No watermark
              </li>
            </ul>
            <div className="mb-4 h-px bg-zinc-800" />
            <Button
              onClick={() => handleSubscribe(plan.slug)}
              disabled={loading === plan.slug}
              className={
                plan.highlight
                  ? "mt-auto w-full h-10 text-base bg-blue-600 hover:bg-blue-700 text-white"
                  : "mt-auto w-full h-10 text-base bg-white text-zinc-900 hover:bg-zinc-100"
              }
            >
              {loading === plan.slug ? "Redirecting..." : `Choose`}
            </Button>
          </CardContent>
          </Card>
        </div>
      ))}
    </div>
  )
}

export default PricingPlans
