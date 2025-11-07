"use client"

import { useEffect, useRef, useState, useMemo } from "react"
import { Plus, X } from "lucide-react"
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
import { computeAskRedditCredits } from "@/lib/creditCalculation"

function CommentField({
  value,
  onChange,
  onRemove,
  index,
  maxLength,
  maxTotalLength,
  totalLength,
}: {
  value: string
  onChange: (value: string) => void
  onRemove: () => void
  index: number
  maxLength: number
  maxTotalLength: number
  totalLength: number
}) {
  const taRef = useRef<HTMLTextAreaElement>(null)
  const remainingChars = maxLength - value.length
  const remainingTotal = maxTotalLength - totalLength + value.length
  
  useEffect(() => {
    const el = taRef.current
    if (!el) return
    el.style.height = "0px"
    el.style.height = Math.min(el.scrollHeight, 200) + "px"
  }, [value])

  return (
    <div className="space-y-1.5 min-w-0">
      <div className="flex justify-between items-center">
        <label className="text-sm text-zinc-300">Comment {index + 1}</label>
        <button
          type="button"
          onClick={onRemove}
          className="text-zinc-500 hover:text-zinc-300 transition-colors"
          aria-label="Remove comment"
        >
          <X size={16} />
        </button>
      </div>
      <div className="relative">
        <textarea
          ref={taRef}
          value={value}
          onChange={(e) => {
            if (e.target.value.length <= maxLength && 
                (totalLength - value.length + e.target.value.length) <= maxTotalLength) {
              onChange(e.target.value)
            }
          }}
          placeholder={`Comment ${index + 1}...`}
          className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-3 text-sm text-white placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-blue-600/30 overflow-hidden resize-none"
          rows={1}
          style={{ minHeight: '44px' }}
        />
        <div className="text-right text-xs mt-1 text-zinc-500">
          <span className={remainingChars < 20 ? 'text-amber-500' : ''}>
            {remainingChars}
          </span>
          {' '}/ {maxLength} chars • {Math.min(remainingTotal, maxLength)} remaining
        </div>
      </div>
    </div>
  )
}

export function AskRedditVideoForm() {
  const { data: session } = authClient.useSession()
  const { credits, refresh, isLoading } = useCredits()
  const [spending, setSpending] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [previewError, setPreviewError] = useState<string | null>(null)
  const [loginModalOpen, setLoginModalOpen] = useState(false)
  const [jobId, setJobId] = useState<string | null>(null)
  const [status, setStatus] = useState<string | null>(null)
  const [videoUrl, setVideoUrl] = useState<string | null>(null)
  
  // Initialize with default values immediately
  const defaultLanguage = languages[0]?.value || ""
  const defaultVoice = languages[0]?.voices?.[0]?.value || ""
  const defaultBgVideo = backgrounds[0]?.value || ""
  
  // Form fields with default values
  const [title, setTitle] = useState("")
  const [comments, setComments] = useState<string[]>([""])
  const [language, setLanguage] = useState(defaultLanguage)
  const [voice, setVoice] = useState(defaultVoice)
  const [bgVideo, setBgVideo] = useState(defaultBgVideo)
  const [music, setMusic] = useState("")
  
  // Audio preview
  const [playingVoice, setPlayingVoice] = useState<string | null>(null)
  const [playingMusic, setPlayingMusic] = useState<string | null>(null)
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const musicAudioRef = useRef<HTMLAudioElement | null>(null)
  
  // Memoize language and voice options for better performance
  const selectedLang = useMemo(() => 
    languages.find((l) => l.value === language) || languages[0],
    [language]
  )
  
  const voiceOptions = useMemo(() => 
    selectedLang?.voices || [], 
    [selectedLang]
  )
  
  // Character limits
  const MAX_TITLE_LENGTH = 100
  const MAX_COMMENT_LENGTH = 1000
  const MAX_TOTAL_COMMENTS_LENGTH = 2000
  const MIN_COMMENTS = 1
  const MAX_COMMENTS = 20
  
  const totalCommentsLength = comments.reduce((sum, comment) => sum + comment.length, 0)
  const canAddMoreComments = comments.length < MAX_COMMENTS && 
                           totalCommentsLength < MAX_TOTAL_COMMENTS_LENGTH

  // Dynamic credit calculation (title + comments)
  const requiredCredits = useMemo(() => {
    const trimmed = comments.map((c) => c.trim()).filter((c) => c.length > 0)
    return computeAskRedditCredits(title.trim(), trimmed)
  }, [title, comments])
  
  // Update voice when language changes to ensure a valid voice is always selected
  useEffect(() => {
    if (selectedLang?.voices?.length && !selectedLang.voices.some(v => v.value === voice)) {
      setVoice(selectedLang.voices[0].value)
    }
  }, [selectedLang, voice])
  
  // Handle voice preview (shared helper)
  function playPreview(v: string) {
    playAudioPreview(audioRef, playingVoice, setPlayingVoice, "/voices", v)
  }
  function stopPreview() {
    stopAudioPreview(audioRef, setPlayingVoice)
  }
  
  // Handle music preview (shared helper)
  function playMusicPreview(v: string) {
    playAudioPreview(musicAudioRef, playingMusic, setPlayingMusic, "/bg-music", v)
  }
  function stopMusicPreview() {
    stopAudioPreview(musicAudioRef, setPlayingMusic)
  }
  
  // Update voice when language changes
  useEffect(() => {
    if (voiceOptions.length > 0 && !voiceOptions.some((v) => v.value === voice)) {
      setVoice(voiceOptions[0].value)
    }
    stopPreview()
  }, [language, voiceOptions, voice])
  
  // Stop music preview when selection changes
  useEffect(() => {
    stopMusicPreview()
  }, [music])
  
  // Check credits on mount and when session changes
  useEffect(() => {
    if (session && credits === null && !isLoading) {
      refresh()
    }
  }, [session, credits, isLoading, refresh])
  
  // Poll for job status
  useEffect(() => {
    if (!jobId) return
    let cancel = false
    let timer: NodeJS.Timeout
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
    return () => {
      cancel = true
      if (timer) clearTimeout(timer)
    }
  }, [jobId])
  
  // Handle form submission
  const handleGenerate = async () => {
    setError(null)
    setPreviewError(null)
    setVideoUrl(null)
    
    // Validate form
    if (!session) {
      setLoginModalOpen(true)
      return
    }
    
    // Check user credits
    if (credits === null) {
      await refresh()
    }
    
    if (credits !== null && credits < requiredCredits) {
      setPreviewError("Not enough credits")
      setStatus('failed')
      setSpending(false)
      return
    }
    
    const validComments = comments.filter(comment => comment.trim().length > 0)
    
    if (validComments.length < MIN_COMMENTS) {
      setPreviewError(`At least ${MIN_COMMENTS} comment is required`)
      setStatus('failed')
      return
    }
    
    if (!title.trim()) {
      setPreviewError("Title is required")
      setStatus('failed')
      return
    }
    
    if (title.length > MAX_TITLE_LENGTH) {
      setPreviewError(`Title must be ${MAX_TITLE_LENGTH} characters or less`)
      setStatus('failed')
      return
    }
    
    if (!language || !voice || !bgVideo) {
      setPreviewError("Please select language, voice, and background video")
      setStatus('failed')
      return
    }
    
    setSpending(true)
    
    try {
      const res = await fetch("/api/video/generation/askreddit", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          title: title.trim(),
          comments: validComments,
          language,
          voice,
          bgVideo,
          music: music || undefined,
        }),
      })
      
      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        const errMsg = data?.error === "insufficient_credits" 
          ? "Not enough credits" 
          : "Failed to start generation"
        setPreviewError(errMsg)
        setJobId(null)
        setStatus('failed')
        return
      }
      
      const responseData = await res.json()
      
      // Refresh the credits through the context
      await refresh()
      
      if (typeof window !== "undefined") {
        window.dispatchEvent(new Event("refresh-credits"))
      }
      
      if (responseData.jobId) {
        setJobId(responseData.jobId)
        setStatus(responseData.status)
      }
    } catch (err) {
      console.error("Generation error:", err)
      setPreviewError("An unexpected error occurred")
      setStatus('failed')
    } finally {
      setSpending(false)
    }
  }
  
  // Handle download
  async function handleDownload() {
    if (!jobId || !videoUrl) return
    
    const a = document.createElement('a')
    a.href = `/api/video/download?id=${jobId}`
    a.download = `${jobId}.mp4`
    a.target = '_self'
    document.body.appendChild(a)
    a.click()
    a.remove()
  }
  
  // Handle adding a new comment
  const addComment = () => {
    if (canAddMoreComments) {
      setComments([...comments, ""])
    }
  }
  
  // Handle updating a comment
  const updateComment = (index: number, value: string) => {
    const newComments = [...comments]
    newComments[index] = value
    setComments(newComments)
  }
  
  // Handle removing a comment
  const removeComment = (index: number) => {
    if (comments.length <= MIN_COMMENTS) return
    const newComments = comments.filter((_, i) => i !== index)
    setComments(newComments)
  }

  return (
    <div className="max-w-6xl w-full mx-auto p-0 bg-zinc-900 border border-zinc-800 rounded-xl">
      <div className="grid md:grid-cols-12 gap-6 lg:gap-8 w-full px-4 md:px-6 py-5">
        <div className="md:col-span-8 space-y-5 min-w-0">
          {/* Title Field */}
          <div className="space-y-1.5 min-w-0">
            <label className="text-sm text-zinc-300">Title</label>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value.slice(0, MAX_TITLE_LENGTH))}
              placeholder="Enter post title..."
              className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-3 text-sm text-white placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-blue-600/30"
            />
            <div className="text-right text-xs text-zinc-500">
              {title.length}/{MAX_TITLE_LENGTH} characters
            </div>
          </div>
          
          {/* Comments */}
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <label className="text-sm text-zinc-300">Comments</label>
              <span className="text-xs text-zinc-500">
                {comments.length} of {MAX_COMMENTS} • {totalCommentsLength}/{MAX_TOTAL_COMMENTS_LENGTH} chars
              </span>
            </div>
            
            <div className="space-y-4">
              {comments.map((comment, index) => (
                <CommentField
                  key={index}
                  value={comment}
                  onChange={(value) => updateComment(index, value)}
                  onRemove={() => removeComment(index)}
                  index={index}
                  maxLength={MAX_COMMENT_LENGTH}
                  maxTotalLength={MAX_TOTAL_COMMENTS_LENGTH}
                  totalLength={totalCommentsLength}
                />
              ))}
              
              <Button
                type="button"
                onClick={addComment}
                disabled={!canAddMoreComments}
                variant="outline"
                className="w-full border-dashed border-zinc-700 text-zinc-400 hover:bg-zinc-800/50 hover:text-white"
              >
                <Plus size={16} className="mr-2" />
                Add Comment
              </Button>
            </div>
          </div>
          
          {/* Language and Voice Selection */}
          <div className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-sm text-zinc-300">Language</label>
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
            />
          </div>
          
          {/* Music Selection */}
          <MusicSelector
            musicOptions={musicOptions}
            selectedMusic={music}
            onSelect={setMusic}
            onPreview={playMusicPreview}
            onStopPreview={stopMusicPreview}
            playingMusic={playingMusic}
          />
          
          {/* Background Video Selection */}
          <BackgroundSelector
            backgrounds={backgrounds}
            selectedBackground={bgVideo}
            onSelect={setBgVideo}
          />
        </div>
        
        {/* Preview Panel */}
        <PreviewPanel
          status={status}
          videoUrl={videoUrl}
          previewError={previewError}
          jobId={jobId}
          onDownload={handleDownload}
        />
      </div>
      
      {/* Fixed Action Bar */}
      <div className="sticky bottom-0 left-0 right-0 z-50 bg-zinc-900/80 backdrop-blur border-t border-zinc-800">
        <div className="max-w-6xl mx-auto px-4 md:px-6 py-3">
          <Button 
            onClick={handleGenerate}
            disabled={
              spending || 
              (!!jobId && status !== "completed" && status !== "failed") || 
              (session ? credits == null : false) || 
              !title.trim() || 
              !comments.some(c => c.trim().length > 0) || 
              !language || 
              !voice || 
              !bgVideo
            }
            className="bg-white text-zinc-900 hover:bg-zinc-200 w-full px-6 py-3 h-14 text-lg md:text-xl font-semibold rounded-lg shadow-sm hover:shadow-md transition-colors transition-shadow duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-400/60"
          >
            {spending ? (
              "Generating..."
            ) : (
              <span className="inline-flex items-center justify-center gap-3">
                <span className="tracking-wide">Generate</span>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-black text-yellow-400 px-3 py-1.5 text-base">
                  {requiredCredits} <CircleDollarSign size={18} className="text-yellow-400" />
                </span>
              </span>
            )}
          </Button>
        </div>
      </div>
      
      {/* Login Modal */}
      {loginModalOpen && (
        <LoginModal 
          open={loginModalOpen} 
          onOpenChange={setLoginModalOpen} 
        />
      )}
      
      <style jsx>{``}</style>
    </div>
  )
}
