import { Play, Zap, Sparkles, BarChart2 } from "lucide-react"
import type { LandingMessages } from "@/lib/i18n"
import { landingMessages } from "@/lib/i18n"

type FeaturesMessages = LandingMessages["features"]

const defaultMessages = landingMessages.en.features

export function Features({ messages }: { messages?: FeaturesMessages }) {
  const m = messages ?? defaultMessages
  return (
    <section id="features" className="py-20 bg-zinc-900/50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">{m.sectionTitle}</h2>
          <p className="text-zinc-400 max-w-2xl mx-auto">
            {m.sectionSubtitle}
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {[{
            icon: <Play className="w-6 h-6" />, 
            title: m.items[0],
          },{
            icon: <Zap className="w-6 h-6" />, 
            title: m.items[1],
          },{
            icon: <Sparkles className="w-6 h-6" />, 
            title: m.items[2],
          },{
            icon: <BarChart2 className="w-6 h-6" />, 
            title: m.items[3],
          }].map((feature, index) => (
            <div key={index} className="bg-zinc-900/50 p-6 rounded-xl border border-zinc-800 hover:border-zinc-700 transition-colors">
              <div className="w-12 h-12 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-400 mb-4">
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-zinc-400"></p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
