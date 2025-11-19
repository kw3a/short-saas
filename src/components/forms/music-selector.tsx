"use client"

import { Play, Square } from "lucide-react"

export interface MusicOption {
  value: string
  label: string
}

interface MusicSelectorProps {
  musicOptions: MusicOption[]
  selectedMusic: string
  onSelect: (value: string) => void
  onPreview: (value: string) => void
  onStopPreview: () => void
  playingMusic: string | null
  label?: string
}

export function MusicSelector({
  musicOptions,
  selectedMusic,
  onSelect,
  onPreview,
  onStopPreview,
  playingMusic,
  label,
}: MusicSelectorProps) {
  const handlePreview = (e: React.MouseEvent, value: string) => {
    e.stopPropagation()
    playingMusic === value ? onStopPreview() : onPreview(value)
  }

  return (
    <div className="space-y-1.5">
      <label className="text-sm text-zinc-300">{label ?? "Background Music (Optional)"}</label>
      <div className="custom-scrollbar flex gap-2 py-1 overflow-x-auto snap-x snap-mandatory min-w-0">
        {musicOptions.map((m) => (
          <div
            key={m.value || "none"}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault()
                onSelect(m.value)
              }
            }}
            onClick={() => onSelect(m.value)}
            className={
              `flex items-center justify-between min-w-[200px] rounded-lg border p-2 bg-zinc-950 snap-start cursor-pointer ${selectedMusic === m.value 
                ? 'border-blue-500' 
                : 'border-zinc-800 hover:border-zinc-700'}`
            }
            aria-pressed={selectedMusic === m.value}
          >
            {m.value ? (
              <button
                type="button"
                onClick={(e) => handlePreview(e, m.value)}
                className="inline-flex items-center justify-center h-8 w-8 rounded-md bg-zinc-800 hover:bg-zinc-700 text-white"
                aria-label={
                  playingMusic === m.value 
                    ? `Stop ${m.label} preview` 
                    : `Play ${m.label} preview`
                }
              >
                {playingMusic === m.value ? <Square size={16} /> : <Play size={16} />}
              </button>
            ) : (
              <div className="inline-flex items-center justify-center h-8 w-8 rounded-md bg-zinc-900 text-zinc-600 border border-zinc-800">—</div>
            )}
            <div className="flex-1 text-left text-sm text-zinc-200 ml-3 truncate">
              {m.label}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
