import { Play, Zap, Sparkles, BarChart2 } from "lucide-react"

const features = [
  {
    icon: <Play className="w-6 h-6" />,
    title: "One-Click Generation",
    description: "Create professional-quality shorts with just a few clicks. No video editing experience needed."
  },
  {
    icon: <Zap className="w-6 h-6" />,
    title: "Lightning Fast",
    description: "Generate videos in minutes, not hours. Our AI handles the heavy lifting so you can focus on creating."
  },
  {
    icon: <Sparkles className="w-6 h-6" />,
    title: "AI-Powered",
    description: "Leverage cutting-edge AI to create engaging content that captures attention and drives views."
  },
  {
    icon: <BarChart2 className="w-6 h-6" />,
    title: "Flexible Credits",
    description: "Pay as you go with our credit system. Use credits whenever you need them, with no subscription required."
  }
]

export function Features() {
  return (
    <section id="features" className="py-20 bg-zinc-900/50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Everything You Need to Go Viral</h2>
          <p className="text-zinc-400 max-w-2xl mx-auto">
            Our platform provides all the tools you need to create, optimize, and publish engaging short-form content.
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="bg-zinc-900/50 p-6 rounded-xl border border-zinc-800 hover:border-zinc-700 transition-colors">
              <div className="w-12 h-12 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-400 mb-4">
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-zinc-400">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
