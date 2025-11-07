"use client"
import GalleryList from "@/components/gallery/GalleryList"
import { RefreshCcw } from "lucide-react"

export default function DashboardGalleryPage() {
  return (
    <div>
      <div className="p-4 sm:p-6 md:p-8">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h1 className="text-xl font-semibold text-white mb-2">Your Gallery</h1>
            <p className="text-sm text-zinc-400">Click a thumbnail to load and play the video.</p>
          </div>
          <button
            type="button"
            aria-label="Refresh gallery"
            onClick={() => window.dispatchEvent(new Event('gallery:refresh'))}
            className="inline-flex items-center justify-center h-11 w-11 aspect-square rounded-md bg-zinc-800 hover:bg-zinc-700 text-white"
          >
            <RefreshCcw className="h-5 w-5" />
          </button>
        </div>
      </div>
      <GalleryList />
    </div>
  )
}
