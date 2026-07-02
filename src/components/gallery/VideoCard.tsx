"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Play, ImageOff, Info, Download, CircleDollarSign, Loader2 } from "lucide-react"
import { getBackgroundLabel, getMusicLabel, getVoiceLabel } from "@/config/options"

type Props = {
  id: string
  status: "completed" | "rendering" | "queued" | "failed"
  progress: number
  thumbUrl: string | null
  type: string
  creditCost: number | null
  createdAt: string
}

// Thumbnails are presigned, short-lived R2 URLs, so they must not be routed
// through next/image's optimizer (expiring signatures, unconfigured host).
function Thumb({ src, onError }: { src: string; onError: () => void }) {
  return (
    // eslint-disable-next-line @next/next/no-img-element -- see note above
    <img src={src} alt="thumbnail" loading="lazy" onError={onError} className="h-full w-full object-cover" />
  )
}

export function VideoCard({ id, status: initialStatus, progress: initialProgress, thumbUrl, type, creditCost, createdAt }: Props) {
  const [status, setStatus] = useState(initialStatus)
  const [progress, setProgress] = useState(initialProgress)
  const [videoUrl, setVideoUrl] = useState<string | null>(null)
  const [loadingVideo, setLoadingVideo] = useState(false)
  const [refreshing, setRefreshing] = useState(false)
  const [thumbFailed, setThumbFailed] = useState(false)
  const [infoOpen, setInfoOpen] = useState(false)
  const [infoLoading, setInfoLoading] = useState(false)
  const [info, setInfo] = useState<null | {
    id: string;
    type: string;
    status: string;
    createdAt?: string;
    title?: string | null;
    script?: string | null;
    comments?: string[] | null;
    voice?: string | null;
    bgVideo?: string | null;
    music?: string | null;
  }>(null)

  function formatRelativeDate(iso: string) {
    const d = new Date(iso).getTime()
    const diff = Date.now() - d
    const sec = Math.round(diff / 1000)
    const rtf = new Intl.RelativeTimeFormat(undefined, { numeric: "auto" })
    if (sec < 60) return rtf.format(-sec, "second")
    const min = Math.round(sec / 60)
    if (min < 60) return rtf.format(-min, "minute")
    const hr = Math.round(min / 60)
    if (hr < 24) return rtf.format(-hr, "hour")
    const day = Math.round(hr / 24)
    if (day < 30) return rtf.format(-day, "day")
    const mo = Math.round(day / 30)
    if (mo < 12) return rtf.format(-mo, "month")
    const yr = Math.round(mo / 12)
    return rtf.format(-yr, "year")
  }
  // Lazy init: read the current time once instead of impurely on every render.
  const [dateLabel] = useState(() => formatRelativeDate(createdAt))

  async function loadVideo() {
    if (status !== "completed" || videoUrl || loadingVideo) return
    setLoadingVideo(true)
    try {
      const res = await fetch(`/api/video/status?id=${id}`)
      const data = await res.json()
      setStatus(data.status)
      if (typeof data.progress === "number") setProgress(data.progress)
      if (data.status === "completed" && data.videoUrl) setVideoUrl(data.videoUrl)
    } finally {
      setLoadingVideo(false)
    }
  }

  async function toggleInfo() {
    const next = !infoOpen
    setInfoOpen(next)
    if (next && !info && !infoLoading) {
      setInfoLoading(true)
      try {
        const res = await fetch(`/api/video/info?id=${id}`)
        const data = await res.json()
        if (res.ok) setInfo(data)
      } finally {
        setInfoLoading(false)
      }
    }
  }

  async function refreshStatus() {
    setRefreshing(true)
    try {
      const res = await fetch(`/api/video/status?id=${id}`)
      const data = await res.json()
      setStatus(data.status)
      if (typeof data.progress === "number") setProgress(data.progress)
      if (data.status === "completed" && data.videoUrl) setVideoUrl(data.videoUrl)
    } finally {
      setRefreshing(false)
    }
  }

  if (status === "completed") {
    return (
      <div className="border border-zinc-800 rounded-lg overflow-hidden bg-zinc-950">
        <div className="aspect-[9/16] w-full flex items-center justify-center bg-black">
          {videoUrl ? (
            <video src={videoUrl} controls className="h-full w-full object-contain" />
          ) : (
            <button onClick={loadVideo} className="relative h-full w-full">
              {thumbUrl && !thumbFailed ? (
                <Thumb src={thumbUrl} onError={() => setThumbFailed(true)} />
              ) : (
                <div className="h-full w-full flex items-center justify-center bg-zinc-900 text-zinc-500">
                  <ImageOff size={24} />
                </div>
              )}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="h-12 w-12 rounded-full bg-black/60 flex items-center justify-center text-white border border-white/20">
                  <Play size={24} />
                </div>
              </div>
            </button>
          )}
        </div>
        <div className="px-2 pt-2 flex justify-between items-center gap-2">
          <button
            type="button"
            onClick={toggleInfo}
            className="inline-flex items-center justify-center h-12 w-12 rounded-md bg-zinc-800 hover:bg-zinc-700 text-white"
            aria-label="Video info"
          >
            <Info size={20} />
          </button>
          {videoUrl && (
            <a
              href={`/api/video/download?id=${id}`}
              className="bg-zinc-800 hover:bg-zinc-700 text-white inline-flex items-center justify-center h-12 w-12 rounded-md"
              aria-label="Download"
            >
              <Download size={20} />
            </a>
          )}
        </div>
        <div className="px-2 pb-2 text-[10px] sm:text-xs text-zinc-400 flex items-center justify-between">
          <span className="uppercase tracking-wide text-zinc-300">{type}</span>
          <span className="inline-flex items-center gap-1">{creditCost != null ? (<><CircleDollarSign size={14} />{creditCost}</>) : ""}</span>
          <span>{dateLabel}</span>
        </div>
        {infoOpen && (
          <div className="px-2 pb-2 text-xs text-zinc-300 space-y-1">
            {infoLoading && (
              <div className="flex items-center text-zinc-500 py-1"><Loader2 className="h-5 w-5 animate-spin" /></div>
            )}
            {info && !infoLoading && (
              <>
                {info.title && <div className="truncate"><span className="text-zinc-500">Title:</span> {info.title}</div>}
                {info.music !== undefined && <div><span className="text-zinc-500">Music:</span> {info.music ? getMusicLabel(info.music) : "(none)"}</div>}
                {info.voice && <div><span className="text-zinc-500">Voice:</span> {getVoiceLabel(info.voice)}</div>}
                {info.bgVideo && <div><span className="text-zinc-500">Background:</span> {getBackgroundLabel(info.bgVideo)}</div>}
                {info.script && <div className="line-clamp-3"><span className="text-zinc-500">Script:</span> {info.script}</div>}
                {Array.isArray(info.comments) && info.comments.length > 0 && (
                  <>
                    <div><span className="text-zinc-500">Comments:</span> {info.comments.length}</div>
                    <div className="line-clamp-3"><span className="text-zinc-500">Top:</span> {info.comments[0]}</div>
                  </>
                )}
              </>
            )}
          </div>
        )}
      </div>
    )
  }

  if (status === "rendering" || status === "queued") {
    return (
      <div className="border border-zinc-800 rounded-lg overflow-hidden bg-zinc-950">
        <div className="aspect-[9/16] w-full relative">
          {thumbUrl && !thumbFailed ? (
            <Thumb src={thumbUrl} onError={() => setThumbFailed(true)} />
          ) : (
            <div className="h-full w-full flex items-center justify-center bg-zinc-900 text-zinc-500"><ImageOff size={24} /></div>
          )}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="bg-zinc-900/70 text-white px-3 py-2 rounded flex flex-col items-center gap-1.5 min-w-[7rem]">
              <span className="capitalize">{status}</span>
              <div className="h-1 w-full rounded-full bg-white/20 overflow-hidden">
                <div
                  className="h-full rounded-full bg-white transition-[width] duration-500 ease-out"
                  style={{ width: `${Math.max(0, Math.min(100, Math.round(progress)))}%` }}
                />
              </div>
              <span className="text-[10px] text-zinc-300">{Math.max(0, Math.min(100, Math.round(progress)))}%</span>
            </div>
          </div>
        </div>
        <div className="px-2 pt-2 flex justify-between items-center">
          <button
            type="button"
            onClick={toggleInfo}
            className="inline-flex items-center justify-center h-12 w-12 rounded-md bg-zinc-800 hover:bg-zinc-700 text-white"
            aria-label="Video info"
          >
            <Info size={20} />
          </button>
          <Button onClick={refreshStatus} disabled={refreshing} className="bg-zinc-800 hover:bg-zinc-700 text-white h-12 px-5">
            {refreshing ? "Refreshing..." : "Refresh"}
          </Button>
        </div>
        <div className="px-2 pb-2 text-[10px] sm:text-xs text-zinc-400 flex items-center justify-between">
          <span className="uppercase tracking-wide text-zinc-300">{type}</span>
          <span className="inline-flex items-center gap-1">{creditCost != null ? (<><CircleDollarSign size={14} />{creditCost}</>) : ""}</span>
          <span>{dateLabel}</span>
        </div>
        {infoOpen && (
          <div className="px-2 pb-2 text-xs text-zinc-300 space-y-1">
            {infoLoading && <div className="text-zinc-500">Loading...</div>}
            {info && !infoLoading && (
              <>
                {info.title && <div className="truncate"><span className="text-zinc-500">Title:</span> {info.title}</div>}
                {info.music !== undefined && <div><span className="text-zinc-500">Music:</span> {info.music ? getMusicLabel(info.music) : "(none)"}</div>}
                {info.voice && <div><span className="text-zinc-500">Voice:</span> {getVoiceLabel(info.voice)}</div>}
                {info.bgVideo && <div><span className="text-zinc-500">Background:</span> {getBackgroundLabel(info.bgVideo)}</div>}
                {info.script && <div className="line-clamp-3"><span className="text-zinc-500">Script:</span> {info.script}</div>}
                {Array.isArray(info.comments) && info.comments.length > 0 && (
                  <>
                    <div><span className="text-zinc-500">Comments:</span> {info.comments.length}</div>
                    <div className="line-clamp-3"><span className="text-zinc-500">Top:</span> {info.comments[0]}</div>
                  </>
                )}
              </>
            )}
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="border border-zinc-800 rounded-lg overflow-hidden bg-zinc-950">
      <div className="aspect-[9/16] w-full relative">
        {thumbUrl && !thumbFailed ? (
          <Thumb src={thumbUrl} onError={() => setThumbFailed(true)} />
        ) : (
          <div className="h-full w-full flex items-center justify-center bg-zinc-900 text-zinc-500"><ImageOff size={24} /></div>
        )}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="bg-zinc-900/70 text-white px-3 py-1 rounded">failed</div>
        </div>
      </div>
      <div className="px-2 pt-2 flex justify-start">
        <button
          type="button"
          onClick={toggleInfo}
          className="inline-flex items-center justify-center h-12 w-12 rounded-md bg-zinc-800 hover:bg-zinc-700 text-white"
          aria-label="Video info"
        >
          <Info size={20} />
        </button>
      </div>
      <div className="px-2 pb-2 text-[10px] sm:text-xs text-zinc-400 flex items-center justify-between">
        <span className="uppercase tracking-wide text-zinc-300">{type}</span>
        <span className="inline-flex items-center gap-1">{creditCost != null ? (<><CircleDollarSign size={14} />{creditCost}</>) : ""}</span>
        <span>{dateLabel}</span>
      </div>
      {infoOpen && (
        <div className="px-2 pb-2 text-xs text-zinc-300 space-y-1">
          {infoLoading && (
            <div className="flex items-center text-zinc-500 py-1"><Loader2 className="h-5 w-5 animate-spin" /></div>
          )}
          {info && !infoLoading && (
            <>
              {info.title && <div className="truncate"><span className="text-zinc-500">Title:</span> {info.title}</div>}
              {info.music !== undefined && <div><span className="text-zinc-500">Music:</span> {info.music ? getMusicLabel(info.music) : "(none)"}</div>}
              {info.voice && <div><span className="text-zinc-500">Voice:</span> {getVoiceLabel(info.voice)}</div>}
              {info.bgVideo && <div><span className="text-zinc-500">Background:</span> {getBackgroundLabel(info.bgVideo)}</div>}
              {info.script && <div className="line-clamp-3"><span className="text-zinc-500">Script:</span> {info.script}</div>}
              {Array.isArray(info.comments) && info.comments.length > 0 && (
                <>
                  <div><span className="text-zinc-500">Comments:</span> {info.comments.length}</div>
                  <div className="line-clamp-3"><span className="text-zinc-500">Top:</span> {info.comments[0]}</div>
                </>
              )}
            </>
          )}
        </div>
      )}
    </div>
  )
}
