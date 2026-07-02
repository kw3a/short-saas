"use client"

import { useSyncExternalStore } from "react"
import { supportedLocales, type Locale } from "@/lib/i18n"

function readLocaleCookie(): Locale {
  const match = document.cookie.match(/(?:^|; )lang=(en|es)(?:;|$)/)
  const lang = match?.[1] as Locale | undefined
  return lang && supportedLocales.includes(lang) ? lang : "en"
}

// The navbar toggle reloads the page, but poll as a fallback so the locale also
// updates if the cookie changes another way (e.g. another tab).
function subscribe(callback: () => void): () => void {
  const id = setInterval(callback, 3000)
  return () => clearInterval(id)
}

// getSnapshot returns a string primitive, so repeated equal values compare equal
// (Object.is) and don't cause re-render loops.
const getSnapshot = (): Locale => readLocaleCookie()
const getServerSnapshot = (): Locale => "en"

/**
 * Reads the active locale from the `lang` cookie without a hydration mismatch:
 * the server snapshot is always "en" (matching SSR), and the client switches to
 * the cookie value after hydration. useSyncExternalStore is purpose-built for
 * this and does not emit a hydration warning when the snapshots differ.
 */
export function useLocale(): Locale {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)
}
