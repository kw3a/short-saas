"use client"

import Image from "next/image"

export interface BackgroundOption {
  value: string
  label: string
}

interface BackgroundSelectorProps {
  backgrounds: BackgroundOption[]
  selectedBackground: string
  onSelect: (value: string) => void
}

export function BackgroundSelector({
  backgrounds,
  selectedBackground,
  onSelect
}: BackgroundSelectorProps) {
  return (
    <div className="space-y-2">
      <label className="text-sm text-zinc-300">Background Video</label>
      <div className="custom-scrollbar flex gap-4 py-2 overflow-x-auto snap-x snap-mandatory min-w-0">
        {backgrounds.map((bg) => (
          <button 
            key={bg.value} 
            type="button"
            onClick={() => onSelect(bg.value)}
            className={
              `flex flex-col items-center min-w-[140px] rounded-lg border p-1.5 bg-zinc-950 text-left snap-start ${selectedBackground === bg.value 
                ? 'border-blue-500' 
                : 'border-zinc-800 hover:border-zinc-700'}`
            }
          >
            <div className="relative h-48 aspect-[9/16] overflow-hidden rounded-md shadow-sm">
              <Image 
                src={`/bg-thumbnails/${bg.value}.jpg`} 
                alt={bg.label} 
                fill 
                className="object-cover" 
                sizes="160px" 
                loading="lazy" 
              />
            </div>
            <div className="mt-2 text-sm text-zinc-300 truncate">{bg.label}</div>
          </button>
        ))}
      </div>
    </div>
  )
}
