import Link from "next/link"
import { Button } from "./ui/button"
import { Play } from "lucide-react"

export function Hero() {
  const assetsURL = process.env.NEXT_PUBLIC_ASSETS_URL
  return (
    <div className="min-h-screen flex flex-col justify-center">
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Column - Text & Buttons */}
          <div className="text-center lg:text-left">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 text-white">
              Create Viral Shorts in Minutes
            </h1>
            <p className="text-xl text-zinc-300 mb-8 max-w-2xl lg:max-w-none">
              Transform your ideas into engaging short videos with AI. No editing skills required.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
              <Link href="/dashboard" className="w-full sm:w-auto">
                <Button className="w-full sm:w-auto px-6 py-3 sm:px-8 sm:py-4 text-base sm:text-lg bg-white text-gray-900 hover:bg-gray-100 transition-all shadow-lg hover:shadow-xl border border-gray-200 font-medium flex items-center justify-center gap-2 group rounded-none">
                  <Play className="w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-0.5 transition-transform flex-shrink-0" />
                  <span>Create a Video Now</span>
                </Button>
              </Link>
              <Link href="#products" className="w-full sm:w-auto">
                <Button className="w-full sm:w-auto px-6 py-3 sm:px-8 sm:py-4 text-base sm:text-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors shadow-lg">
                  Our Products
                </Button>
              </Link>
            </div>
            
            {/* Feature List */}
            <div className="mt-6 space-y-3 text-left">
              <div className="flex items-start">
                <span className="text-green-500 mr-2">✓</span>
                <span className="text-sm text-zinc-300">Avoid zero views</span>
              </div>
              <div className="flex items-start">
                <span className="text-green-500 mr-2">✓</span>
                <span className="text-sm text-zinc-300">Perfect format to post on YouTube, TikTok and Facebook</span>
              </div>
              <div className="flex items-start">
                <span className="text-green-500 mr-2">✓</span>
                <span className="text-sm text-zinc-300">Monetize your account with faceless videos</span>
              </div>
            </div>
            
            <div className="mt-4 text-zinc-400 text-sm">
              No credit card required. Get 1000 free credits on sign up
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
    </div>
  )
}
