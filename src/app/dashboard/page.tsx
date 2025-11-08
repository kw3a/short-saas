import type { Metadata } from "next"
import Link from "next/link"
import { Play, MessageSquare, Plus } from "lucide-react"
import Image from "next/image"

export const metadata: Metadata = {
  title: "Dashboard — ViralShort",
  description: "Start creating faceless short videos. Access tools, buy credits, and manage your content.",
}

export default function DashboardPage() {
  const assetsURL = process.env.NEXT_PUBLIC_ASSETS_URL
  return (
    <div className="container mx-auto px-4 py-6 space-y-10">
      {/* Steps + Promo side-by-side */}
      <section>
        <div className="grid gap-6 lg:grid-cols-3 items-stretch">
          {/* Steps (span 2) */}
          <div className="lg:col-span-2">
            <h2 className="text-xl font-semibold text-white mb-4">Get started in 3 steps</h2>
            <ol className="grid gap-6 sm:grid-cols-3">
              <li className="flex items-start gap-3">
                <span className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-white text-zinc-900 text-sm font-semibold">1</span>
                <div>
                  <div className="font-medium text-white">Create your account</div>
                  <p className="text-sm text-zinc-400">Sign up and get 1000 credits for free.</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-white text-zinc-900 text-sm font-semibold">2</span>
                <div>
                  <div className="font-medium text-white">Create your faceless video</div>
                  <p className="text-sm text-zinc-400">Pick a tool, fill the form, and generate.</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-white text-zinc-900 text-sm font-semibold">3</span>
                <div>
                  <div className="font-medium text-white">Publish your video</div>
                  <p className="text-sm text-zinc-400">Download and post to your favorite platform.</p>
                </div>
              </li>
            </ol>
          </div>
          {/* Promo (span 1) */}
          <div className="p-5 bg-zinc-950 border border-zinc-800 border-l-4 border-l-yellow-400 shadow-sm flex flex-col items-start justify-between gap-4">
            <div>
              <h2 className="text-lg font-semibold text-white">Buy any credit package and remove the watermark forever</h2>
              <p className="text-sm text-zinc-400 mt-1">Upgrade once. No subscriptions.</p>
            </div>
            <Link href="/dashboard/buy" className="inline-flex items-center justify-center rounded-md bg-blue-600 text-white px-4 py-2 text-sm font-medium hover:bg-blue-500">
              View credit packages
            </Link>
          </div>
        </div>
      </section>

      {/* Tools section */}
      <section>
        <h2 className="text-xl font-semibold text-white mb-4">Tools</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {/* Narration card */}
          <div className="rounded-lg border border-zinc-800 bg-zinc-950 overflow-hidden">
            <div className="aspect-square bg-zinc-900 relative overflow-hidden">
              <Image
                src={`${assetsURL}/example1.jpg`}
                alt="Narration"
                fill
                className="object-cover"
                sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                priority={false}
              />
            </div>
            <div className="p-4 space-y-2">
              <h3 className="text-white font-medium">Narrated Story</h3>
              <p className="text-sm text-zinc-400">Turn your script into a faceless video with subtitles and background.</p>
              <Link href="/dashboard/narration" className="inline-flex items-center gap-2 justify-center rounded-md bg-white text-zinc-900 hover:bg-zinc-200 px-3 py-2 text-sm font-medium">
                <Plus className="w-4 h-4" />
                Create a new video
              </Link>
            </div>
          </div>

          {/* AskReddit card */}
          <div className="rounded-lg border border-zinc-800 bg-zinc-950 overflow-hidden">
            <div className="aspect-square bg-zinc-900 relative overflow-hidden">
              <Image
                src={`${assetsURL}/askreddit1.jpg`}
                alt="Askreddit Example"
                fill
                className="object-cover"
                sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                priority={false}
              />
            </div>
            <div className="p-4 space-y-2">
              <h3 className="text-white font-medium">AskReddit</h3>
              <p className="text-sm text-zinc-400">Generate videos from a Reddit-style title and comments thread.</p>
              <Link href="/dashboard/askreddit" className="inline-flex items-center gap-2 justify-center rounded-md bg-white text-zinc-900 hover:bg-zinc-200 px-3 py-2 text-sm font-medium">
                <Plus className="w-4 h-4" />
                Create a new video
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
