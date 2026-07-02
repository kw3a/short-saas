"use client"

import { Download } from "lucide-react"
interface PreviewPanelProps {
  status: string | null
  progress?: number
  videoUrl: string | null
  previewError: string | null
  jobId: string | null
  onDownload: () => void
}

export function PreviewPanel({
  status,
  progress = 0,
  videoUrl,
  previewError,
  jobId,
  onDownload
}: PreviewPanelProps) {
  const inProgress = (status === 'queued' || status === 'pending' || status === 'rendering' || (!status && !!jobId)) && !previewError
  const pct = Math.max(0, Math.min(100, Math.round(progress)))

  return (
    <div className="md:col-span-4 space-y-3">
      <div className="border border-zinc-800 p-4 md:sticky md:top-4">
        <div className="text-sm font-medium text-white mb-2">Output Preview</div>
        <div className="relative aspect-[9/16] w-full rounded-md bg-zinc-950 border border-zinc-800 overflow-hidden">
          {status === 'completed' && videoUrl ? (
            <video
              key={videoUrl}
              src={videoUrl}
              controls
              className="h-full w-full object-contain bg-black"
            />
          ) : (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 px-6">
              {previewError && (
                <div className="px-3 py-2 text-center text-xs text-red-400">
                  {previewError}
                </div>
              )}

              {inProgress && (
                <div className="w-full max-w-[160px] space-y-2">
                  <div className="h-1.5 w-full rounded-full bg-zinc-800 overflow-hidden">
                    <div
                      className="h-full rounded-full bg-white transition-[width] duration-500 ease-out"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                  <div className="text-center text-xs text-zinc-400 capitalize">
                    {status || 'Preparing...'} · {pct}%
                  </div>
                </div>
              )}

              {status === 'failed' && !previewError && (
                <div className="px-3 py-2 text-center text-xs text-red-400">
                  Generation failed. Please try again.
                </div>
              )}
              
              {status === 'completed' && !videoUrl && (
                <div className="px-3 py-2 text-center text-xs text-zinc-400">
                  Video completed but not available yet. Check your library.
                </div>
              )}
              
              {!status && !jobId && (
                <div className="text-xs text-zinc-500">No video yet</div>
              )}
            </div>
          )}
        </div>
        
        {status === 'completed' && videoUrl && (
          <div className="mt-3 flex justify-center">
            <button 
              onClick={onDownload} 
              className="inline-flex items-center justify-center px-2 py-2 rounded-md bg-zinc-800 hover:bg-zinc-700 text-white"
              aria-label="Download video"
            >
              <Download className="w-5 h-5" />
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
