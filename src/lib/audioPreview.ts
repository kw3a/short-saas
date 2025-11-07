import type { RefObject } from "react"

export function ensureAudio(ref: RefObject<HTMLAudioElement | null>, onEnded: () => void) {
  if (!ref.current) {
    const a = new Audio()
    a.addEventListener("ended", () => {
      try {
        onEnded()
        a.currentTime = 0
      } catch {
        // no-op
      }
    })
    ref.current = a
  }
}

export async function playAudioPreview(
  ref: RefObject<HTMLAudioElement | null>,
  playingKey: string | null,
  setPlayingKey: (v: string | null) => void,
  basePath: string,
  key: string
) {
  try {
    ensureAudio(ref, () => setPlayingKey(null))
    const el = ref.current
    if (!el) return

    if (playingKey === key && !el.paused) {
      stopAudioPreview(ref, setPlayingKey)
      return
    }

    el.pause()
    el.src = `${basePath}/${key}.mp3`
    el.currentTime = 0
    await el.play()
    setPlayingKey(key)
  } catch {
    setPlayingKey(null)
  }
}

export function stopAudioPreview(
  ref: RefObject<HTMLAudioElement | null>,
  setPlayingKey: (v: string | null) => void
) {
  const el = ref.current
  if (!el) return
  el.pause()
  el.currentTime = 0
  setPlayingKey(null)
}
