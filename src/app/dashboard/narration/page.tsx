import type { Metadata } from "next"
import NarratedVideoForm from "@/components/narrated-video-form"

export const metadata: Metadata = {
  title: "Narrated Story Generator — ViralShort",
  description: "Turn your script into a faceless short video with AI voiceover, subtitles, and cinematic backgrounds.",
}

export default function DashboardGeneratePage() {
  return (
    <div>
      <h1 className="text-xl font-semibold mb-2 text-center">Narrated Story Generator</h1>
      <p className="text-sm text-zinc-400 mb-4 text-center">Create a narrated short using popular background videos and music.</p>
      <NarratedVideoForm />
    </div>
  )
}
