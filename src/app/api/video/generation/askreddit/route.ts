import { NextRequest, NextResponse } from "next/server"
import { computeAskRedditCredits } from "@/lib/creditCalculation"
import { headers } from "next/headers"
import { auth } from "@/lib/auth"
import { db } from "@/db"
import { askredditVideo, balance, video } from "@/db/schema"
import { and, eq, gte, sql } from "drizzle-orm"
import { randomUUID } from "crypto"

export async function POST(req: NextRequest) {
  try {
    const session = await auth.api.getSession({ headers: await headers() })
    const userId = session?.user?.id
    if (!userId) return NextResponse.json({ error: "unauthorized" }, { status: 401 })

    const { title, comments, voice, bgVideo, music } = (await req.json().catch(() => ({}))) as {
      title?: string,
      comments?: string[],
      voice?: string,
      bgVideo?: string,
      music?: string,
    }

    // Validation sets (mirror narration)
    const validVoices = new Set([
      "en-US-BrianNeural",
      "en-US-AvaNeural",
      "en-US-AndrewNeural",
      "en-US-EmmaNeural",
      "en-US-JennyNeural",
      "es-BO-SofiaNeural",
      "es-BO-MarceloNeural",
      "es-MX-JorgeNeural",
      "es-MX-DaliaNeural",
      "es-DO-EmilioNeural",
    ])
    const validMusics = new Set([
      "elevator",
      "else",
      "hiddenagenda",
      "nocturne",
      "sneakysnitch",
      "tiptoes",
      "wiener",
      "waltz",
    ])
    const validBackgrounds = new Set(["subways", "gtav", "minecraft", "roblox", "satisfying"]) 

    // Trim inputs
    const trimTitle = (title ?? "").trim()
    const list = Array.isArray(comments) ? comments : []
    const trimmed = list.map((c) => (c ?? "").trim()).filter((c) => c.length > 0)

    // AskReddit-specific validation
    if (!trimTitle || trimTitle.length < 1 || trimTitle.length > 100) {
      return NextResponse.json({ error: "invalid_title", message: "Title must be 1-100 characters" }, { status: 400 })
    }
    if (trimmed.length < 1 || trimmed.length > 20) {
      return NextResponse.json({ error: "invalid_comments", message: "Comments must be between 1 and 20" }, { status: 400 })
    }
    const totalLen = trimmed.reduce((acc, s) => acc + s.length, 0)
    if (totalLen >= 2000) {
      return NextResponse.json({ error: "invalid_comments", message: "Total comments length must be under 2000 characters" }, { status: 400 })
    }
    if (trimmed.some((s) => s.length < 1 || s.length > 1000)) {
      return NextResponse.json({ error: "invalid_comments", message: "Each comment must be 1-1000 characters" }, { status: 400 })
    }

    // Common validation (voice/bg/music)
    if (!voice || !validVoices.has(voice)) {
      return NextResponse.json({ error: "invalid_voice", message: "Voice is required and must be supported" }, { status: 400 })
    }
    if (!bgVideo || !validBackgrounds.has(bgVideo)) {
      return NextResponse.json({ error: "invalid_background", message: "Background video must be one of the supported options" }, { status: 400 })
    }
    if (music && !validMusics.has(music)) {
      return NextResponse.json({ error: "invalid_music", message: "Music must be one of the supported options" }, { status: 400 })
    }

    // 1) Check sufficient balance BEFORE calling external server
    const rows = await db
      .select({ totalCredits: balance.totalCredits, payingUser: balance.payingUser })
      .from(balance)
      .where(eq(balance.userId, userId))
      .limit(1)

    const current = rows[0]?.totalCredits ?? 0
    const payingUser = rows[0]?.payingUser ?? false
    // compute dynamic credit cost (title + comments after validation trimming below)
    // temporarily compute here with optimistic trim; final validated values used again before DB insert
    const creditCost = computeAskRedditCredits(trimTitle, trimmed)
    if (current < creditCost) {
      return NextResponse.json({ error: "insufficient_credits" }, { status: 400 })
    }

    // 2) Call external video server
    const jobId = randomUUID()
    const base = process.env.VIDEO_SERVER_URL
    if (!base) {
      return NextResponse.json({ error: "video_server_unconfigured" }, { status: 500 })
    }
    const url = `${base.replace(/\/$/, "")}/generation/askreddit`
    const freeTrial = !payingUser
    const bodyParams: any = {
      id: jobId,
      title: trimTitle,
      comments: trimmed,
      bg_video: bgVideo,
      voice: voice,
      credit_cost: creditCost,
      free_trial: freeTrial,
    }
    if (music) bodyParams.music = music
    const vsRes = await fetch(url, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "Authorization": 'Bearer ' + process.env.VIDEO_SERVER_SECRET,
      },
      body: JSON.stringify(bodyParams),
    }).catch(() => null)

    if (!vsRes || !vsRes.ok) {
      return NextResponse.json({ error: "video_generation_failed" }, { status: 502 })
    }

    // 3) Insert video row and atomically deduct credits
    const result = await db.transaction(async (tx) => {
      await tx.insert(video).values({
        id: jobId,
        userId,
        type: "askreddit",
        creditCost: creditCost,
        status: "queued",
      }).onConflictDoNothing()

      // If there is a per-type table in the future, insert here (askredditVideo)
      // For now, we only track via the generic video table.
      await tx.insert(askredditVideo).values({
        videoId: jobId,
        title: trimTitle,
        comments: trimmed,
        voice: voice,
        bgVideo: bgVideo,
        music: music ?? "",
      }).onConflictDoNothing()

      const updated = await tx
        .update(balance)
        .set({ totalCredits: sql`${balance.totalCredits} - ${creditCost}` })
        .where(and(eq(balance.userId, userId), gte(balance.totalCredits, creditCost)))
        .returning({ totalCredits: balance.totalCredits })

      if (updated.length === 0) {
        return { ok: false as const }
      }

      return { ok: true as const, totalCredits: updated[0].totalCredits }
    })

    if (!result.ok) {
      return NextResponse.json({ error: "insufficient_credits" }, { status: 400 })
    }

    return NextResponse.json({ totalCredits: result.totalCredits, jobId, status: "queued" }, { status: 200 })
  } catch (e) {
    return NextResponse.json({ error: "server_error" }, { status: 500 })
  }
}
