export function computeCredits(parts: Array<string | null | undefined>): number {
  try {
    return parts.reduce((sum, part) => sum + (part ? part.length : 0), 0)
  } catch {
    return 0
  }
}

export function computeNarrationCredits(title: string, script: string): number {
  return computeCredits([title || "", script || ""]) 
}

export function computeAskRedditCredits(title: string, comments: string[]): number {
  return computeCredits([title || "", ...(Array.isArray(comments) ? comments : [])])
}
