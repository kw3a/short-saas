"use client"

import { Play, Square } from "lucide-react"

export interface VoiceOption {
  value: string
  label: string
}

interface VoiceSelectorProps {
  voices: VoiceOption[]
  selectedVoice: string
  onVoiceSelect: (voice: string) => void
  onPreview: (voice: string) => void
  onStopPreview: () => void
  playingVoice: string | null
}

export function VoiceSelector({
  voices,
  selectedVoice,
  onVoiceSelect,
  onPreview,
  onStopPreview,
  playingVoice
}: VoiceSelectorProps) {
  const handlePreview = (e: React.MouseEvent, voice: string) => {
    e.stopPropagation()
    playingVoice === voice ? onStopPreview() : onPreview(voice)
  }

  return (
    <div className="space-y-1.5">
      <label className="text-sm text-zinc-300">Voice</label>
      <div className="custom-scrollbar flex gap-2 py-1 overflow-x-auto snap-x snap-mandatory min-w-0">
        {voices.map((v) => (
          <div
            key={v.value}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault()
                onVoiceSelect(v.value)
              }
            }}
            onClick={() => onVoiceSelect(v.value)}
            className={
              `flex items-center min-w-[180px] rounded-lg border p-2 bg-zinc-950 snap-start cursor-pointer ${selectedVoice === v.value 
                ? 'border-blue-500' 
                : 'border-zinc-800 hover:border-zinc-700'}`
            }
            aria-pressed={selectedVoice === v.value}
          >
            <button
              type="button"
              onClick={(e) => handlePreview(e, v.value)}
              className="inline-flex items-center justify-center h-8 w-8 rounded-md bg-zinc-800 hover:bg-zinc-700 text-white flex-shrink-0"
              aria-label={playingVoice === v.value ? `Stop ${v.label} preview` : `Play ${v.label} preview`}
            >
              {playingVoice === v.value ? <Square size={16} /> : <Play size={16} />}
            </button>
            <div className="flex-1 text-left text-sm text-zinc-200 ml-3 truncate">
              {v.label}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
