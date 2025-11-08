import type { Metadata } from "next"
import { PricingPlans } from "@/components/pricing-plans"
import { getActivePricingPlans } from "@/lib/pricing"
import { CircleDollarSign } from "lucide-react"

export const metadata: Metadata = {
  title: "Buy Credits — ViralShort",
  description: "Purchase credits to generate AI faceless short videos. One-time payment, no subscriptions.",
}

export default function DashboardBuyCreditsPage() {
  const plans = getActivePricingPlans()
  
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      <div className="mb-10 text-center">
        <h1 className="text-3xl font-bold text-white mb-3 inline-flex items-center justify-center gap-2">
          <CircleDollarSign size={24} className="text-yellow-400" /> Buy Credits
        </h1>
        <p className="text-zinc-400 max-w-2xl mx-auto">
          Choose the perfect plan for your needs. No subscriptions, no recurring payments. 
        </p>
      </div>
      <div className="max-w-5xl mx-auto">
        <PricingPlans plans={plans} />
      </div>
    </div>
  )
}
