import type { Metadata } from "next"
import { AskRedditVideoForm } from "@/components/askreddit-video-form"

export const metadata: Metadata = {
  title: "AskReddit Video Generator — ViralShort",
  description: "Create engaging AskReddit-style short videos from a title and comments, with AI voiceover and captions.",
}

export default function DashboardAskRedditPage() {
  return (
    <div>
      <h1 className="text-xl font-semibold mb-2 text-center">AskReddit Generator</h1>
      <p className="text-sm text-zinc-400 mb-4 text-center">Create engaging AskReddit videos with multiple comments.</p>
      <AskRedditVideoForm />
    </div>
  )
}
