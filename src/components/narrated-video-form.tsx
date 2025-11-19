"use client"

import { useEffect, useRef, useState, useMemo } from "react"
import { authClient } from "@/lib/auth-client"
import { Button } from "@/components/ui/button"
import { LoginModal } from "./login-modal"
import { languages, backgrounds, musicOptions } from "@/config/options"
import { CircleDollarSign } from "lucide-react"
import { VoiceSelector } from "./forms/voice-selector"
import { BackgroundSelector } from "./forms/background-selector"
import { MusicSelector } from "./forms/music-selector"
import { PreviewPanel } from "./forms/preview-panel"
import { useCredits } from "@/contexts/CreditBalanceContext"
import { playAudioPreview, stopAudioPreview } from "@/lib/audioPreview"
import { computeNarrationCredits } from "@/lib/creditCalculation"
import type { DashboardMessages } from "@/lib/i18n"

type NarrationFormMessages = DashboardMessages["forms"]["narration"]

function ScriptField({
  value,
  onChange,
  maxLength,
  label,
  placeholder,
  counterSuffix,
}: {
  value: string
  onChange: (v: string) => void
  maxLength: number
  label: string
  placeholder: string
  counterSuffix: string
}) {
  const taRef = useRef<HTMLTextAreaElement | null>(null)

  useEffect(() => {
    const el = taRef.current
    if (!el) return
    el.style.height = "0px"
    el.style.height = Math.min(el.scrollHeight, 600) + "px"
  }, [value])

  return (
    <div className="space-y-2 min-w-0">
      <div className="text-sm font-medium text-white">{label}</div>
      <textarea
        ref={taRef}
        value={value}
        onChange={(e) => onChange(e.target.value.slice(0, maxLength))}
        placeholder={placeholder}
        className="w-full max-w-full bg-zinc-950 border border-zinc-800 rounded-lg p-4 text-sm text-white placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-blue-600/30 overflow-hidden resize-none"
      />
      <div className="text-right text-xs text-zinc-500">{value.trim().length}/{maxLength} {counterSuffix}</div>
    </div>
  )
}

export function NarratedVideoForm({ messages }: { messages?: NarrationFormMessages }) {
  const { data: session } = authClient.useSession()
  const { credits, refresh: refreshCredits, isLoading } = useCredits()
  const [spending, setSpending] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [previewError, setPreviewError] = useState<string | null>(null)
  const [loginModalOpen, setLoginModalOpen] = useState(false)
  const [jobId, setJobId] = useState<string | null>(null)
  const [status, setStatus] = useState<string | null>(null)
  const [videoUrl, setVideoUrl] = useState<string | null>(null)
  // Initialize with default values
  const defaultLanguage = languages[0]?.value || ""
  const defaultVoice = languages[0]?.voices?.[0]?.value || ""
  const defaultBgVideo = backgrounds[0]?.value || ""
  
  // State declarations with default values
  const [title, setTitle] = useState("")
  const [script, setScript] = useState("")
  const [language, setLanguage] = useState(defaultLanguage)
  const [voice, setVoice] = useState(defaultVoice)
  const [bgVideo, setBgVideo] = useState(defaultBgVideo)
  const [music, setMusic] = useState("")
  const [playingVoice, setPlayingVoice] = useState<string | null>(null)
  const [playingMusic, setPlayingMusic] = useState<string | null>(null)
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const musicAudioRef = useRef<HTMLAudioElement | null>(null)

  // Dynamic credit calculation (title + script)
  const requiredCredits = useMemo(() => computeNarrationCredits(title.trim(), script.trim()), [title, script])

  // Memoize language and voice options for better performance
  const selectedLang = useMemo(() => 
    languages.find((l) => l.value === language) || languages[0],
    [language]
  )
  
  const voiceOptions = useMemo(() => 
    selectedLang?.voices || [], 
    [selectedLang]
  )

  // Update voice when language changes to ensure a valid voice is always selected
  useEffect(() => {
    if (selectedLang?.voices?.length && !selectedLang.voices.some(v => v.value === voice)) {
      setVoice(selectedLang.voices[0].value)
    }
  }, [selectedLang, voice])

  function playPreview(v: string) { playAudioPreview(audioRef, playingVoice, setPlayingVoice, "/voices", v) }
  function stopPreview() { stopAudioPreview(audioRef, setPlayingVoice) }

  function playMusicPreview(v: string) { playAudioPreview(musicAudioRef, playingMusic, setPlayingMusic, "/bg-music", v) }
  function stopMusicPreview() { stopAudioPreview(musicAudioRef, setPlayingMusic) }

  useEffect(() => {
    const belongs = voiceOptions.some((v) => v.value === voice)
    if (!belongs && voiceOptions.length > 0) {
      setVoice(voiceOptions[0].value)
    }
    // stop any preview when language changes
    stopPreview()
  }, [language])

  // Stop music preview when selection changes
  useEffect(() => {
    stopMusicPreview()
  }, [music])

  // Check credits on mount and when session changes
  useEffect(() => {
    if (session && credits === null && !isLoading) {
      refreshCredits()
    }
  }, [session, credits, isLoading, refreshCredits])

  // Poll for job status
  useEffect(() => {
    if (!jobId) return
    let cancel = false
    let timer: any
    const timeout = 5000
    async function poll() {
      try {
        const res = await fetch(`/api/video/status?id=${jobId}`)
        const data = await res.json()
        if (cancel) return
        const fetchedStatus = data.status ?? "pending"
        setStatus(fetchedStatus)
        if (fetchedStatus === "completed" && data.videoUrl) {
          setVideoUrl(data.videoUrl as string)
          return
        }
        if (fetchedStatus === "completed" || fetchedStatus === "failed") {
          return
        }
        timer = setTimeout(poll, timeout)
      } catch {
        timer = setTimeout(poll, timeout)
      }
    }
    poll()
    return () => { cancel = true; if (timer) clearTimeout(timer) }
  }, [jobId])

  const handleGenerate = async () => {
    setError(null)
    setPreviewError(null)
    setVideoUrl(null)
    setStatus(null)
    if (!session) { setLoginModalOpen(true); return }
    if ((credits ?? 0) < requiredCredits) { setPreviewError("Not enough credits"); setStatus('failed'); setSpending(false); return }
    if (!script.trim()) { setPreviewError("Script is required"); setStatus('failed'); return }
    if (!language || !voice || !bgVideo) { setPreviewError("Please select language, voice and background video"); setStatus('failed'); return }
    setSpending(true)
    try {
      const res = await fetch("/api/video/generation/narration", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ title, script, language, voice, bgVideo, music }),
      })
      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        const errMsg = data?.error === "insufficient_credits" ? "Not enough credits" : "Failed to start generation"
        setPreviewError(errMsg)
        // Ensure user can retry immediately by clearing any previous job
        setJobId(null)
        setStatus('failed')
        return
      }
      const data = await res.json()
      await refreshCredits()
      if (typeof window !== "undefined") {
        window.dispatchEvent(new Event("refresh-credits"))
      }
      if (data.jobId) { setJobId(data.jobId); setStatus(data.status) }
    } finally { setSpending(false) }
  }

  async function handleDownload() {
    if (!jobId) return
    const a = document.createElement('a')
    a.href = `/api/video/download?id=${jobId}`
    a.download = `${jobId}.mp4`
    a.target = '_self'
    document.body.appendChild(a)
    a.click()
    a.remove()
  }

  return (
    <div className="max-w-6xl w-full mx-auto p-0 bg-zinc-900 border border-zinc-800 rounded-xl">
      <div className="grid md:grid-cols-12 gap-6 lg:gap-8 w-full px-4 md:px-6 py-5">
        <div className="md:col-span-8 space-y-5 min-w-0">
          <ScriptField
            value={script}
            onChange={setScript}
            maxLength={2000}
            label={messages?.fields.scriptLabel ?? "Your script"}
            placeholder={messages?.fields.scriptPlaceholder ?? "Paste text or write your script..."}
            counterSuffix={messages?.fields.scriptCounterSuffix ?? "chars"}
          />

          <div className="space-y-4 min-w-0">
            <div className="space-y-1.5 min-w-0">
              <label className="text-sm text-zinc-300">{messages?.fields.titleLabel ?? "Title (optional)"}</label>
              <input
                value={title}
                onChange={(e) => setTitle(e.target.value.slice(0, 100))}
                placeholder={messages?.fields.titlePlaceholder ?? "My awesome video"}
                className="w-full max-w-full bg-zinc-950 border border-zinc-800 rounded-lg p-3 text-sm text-white placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-blue-600/30"
              />
              <div className="text-right text-xs text-zinc-500">{title.trim().length}/100 {messages?.fields.titleCounterSuffix ?? "chars"}</div>
            </div>
            
            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-sm text-zinc-300">{messages?.fields.languageLabel ?? "Language"}</label>
                <select 
                  value={language} 
                  onChange={(e) => setLanguage(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-600/30"
                >
                  {languages.map((lang) => (
                    <option key={lang.value} value={lang.value}>
                      {lang.label}
                    </option>
                  ))}
                </select>
              </div>
              
              <VoiceSelector
                voices={voiceOptions}
                selectedVoice={voice}
                onVoiceSelect={setVoice}
                onPreview={playPreview}
                onStopPreview={stopPreview}
                playingVoice={playingVoice}
                label={messages?.fields.voiceLabel ?? "Voice"}
              />
            </div>
            
            <MusicSelector
              musicOptions={musicOptions}
              selectedMusic={music}
              onSelect={setMusic}
              onPreview={playMusicPreview}
              onStopPreview={stopMusicPreview}
              playingMusic={playingMusic}
              label={messages?.fields.musicLabel ?? "Background Music (Optional)"}
            />
            
            <BackgroundSelector
              backgrounds={backgrounds}
              selectedBackground={bgVideo}
              onSelect={setBgVideo}
              label={messages?.fields.backgroundLabel ?? "Background Video"}
            />
          </div>
        </div>
        
        <PreviewPanel
          status={status}
          videoUrl={videoUrl}
          previewError={previewError}
          jobId={jobId}
          onDownload={handleDownload}
        />
      </div>
      <div className="fixed md:sticky bottom-0 left-0 right-0 z-50 bg-zinc-900/80 backdrop-blur border-t border-zinc-800">
        <div className="max-w-6xl mx-auto px-4 md:px-6 py-3">
          <Button onClick={handleGenerate} disabled={
            spending || (!!jobId && status !== "completed" && status !== "failed") || (session ? credits == null : false) || !script.trim() || !language || !voice || !bgVideo
          } className="bg-white text-zinc-900 hover:bg-zinc-200 w-full px-6 py-3 h-14 text-lg md:text-xl font-semibold rounded-lg shadow-sm hover:shadow-md transition-colors transition-shadow duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-400/60">
            {spending ? (
              messages?.generatingLabel ?? "Generating..."
            ) : (
              <span className="inline-flex items-center justify-center gap-3">
                <span className="tracking-wide">{messages?.generateCta ?? "Generate"}</span>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-black text-yellow-400 px-3 py-1.5 text-base">
                  {requiredCredits} <CircleDollarSign size={18} className="text-yellow-400" />
                </span>
              </span>
            )}
          </Button>
        </div>
      </div>
      {loginModalOpen && <LoginModal open={loginModalOpen} onOpenChange={setLoginModalOpen} />}
      <style jsx>{``}</style>
    </div>
  )
}

export default NarratedVideoForm
