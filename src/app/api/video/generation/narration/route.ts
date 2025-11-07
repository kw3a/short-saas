import { NextRequest, NextResponse } from "next/server"
import { computeNarrationCredits } from "@/lib/creditCalculation"
import { headers } from "next/headers"
import { auth } from "@/lib/auth"
import { db } from "@/db"
import { balance, narratedVideo, video } from "@/db/schema"
import { and, eq, gte, sql } from "drizzle-orm"
import { randomUUID } from "crypto"

export async function POST(req: NextRequest) {
  try {
    const session = await auth.api.getSession({ headers: await headers() })
    const userId = session?.user?.id
    if (!userId) return NextResponse.json({ error: "unauthorized" }, { status: 401 })

    const { title, script, voice, bgVideo, music } = (await req.json().catch(() => ({}))) as { title?: string, script?: string, voice?: string, bgVideo?: string, music?: string }

    // Validation: language is ignored by API; only voice matters
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

    let trimTitle: string | undefined = undefined
    if (title) {
        trimTitle = (title ?? "").trim()
    }
    const trimScript: string = (script ?? "").trim()

    if (trimTitle && trimTitle.length > 100) {
      return NextResponse.json({ error: "invalid_title", message: "Title must be at most 100 characters" }, { status: 400 })
    }
    if (!trimScript || trimScript.length < 1 || trimScript.length > 2000) {
      return NextResponse.json({ error: "invalid_script", message: "Script must be between 1 and 2000 characters" }, { status: 400 })
    }
    if (!voice || !validVoices.has(voice)) {
      return NextResponse.json({ error: "invalid_voice", message: "Voice is required and must be one of the supported voices" }, { status: 400 })
    }
    if (!bgVideo || !validBackgrounds.has(bgVideo)) {
      return NextResponse.json({ error: "invalid_background", message: "Background video must be one of the supported options" }, { status: 400 })
    }
    if (music && !validMusics.has(music)) {
      return NextResponse.json({ error: "invalid_music", message: "Music must be one of the supported options" }, { status: 400 })
    }

    // Compute dynamic credit cost (title + script)
    const creditCost = computeNarrationCredits(trimTitle || "", trimScript)

    // 1) Check sufficient balance BEFORE calling external server
    const rows = await db
      .select({ totalCredits: balance.totalCredits, payingUser: balance.payingUser })
      .from(balance)
      .where(eq(balance.userId, userId))
      .limit(1)

    const current = rows[0]?.totalCredits ?? 0
    const payingUser = rows[0]?.payingUser ?? false
    if (current < creditCost) {
      return NextResponse.json({ error: "insufficient_credits" }, { status: 400 })
    }

    // 2) Call external video server
    const jobId = randomUUID()
    const base = process.env.VIDEO_SERVER_URL
    if (!base) {
      return NextResponse.json({ error: "video_server_unconfigured" }, { status: 500 })
    }
    const url = `${base.replace(/\/$/, "")}/generation/narration`
    const freeTrial = !payingUser
    const bodyParams: any = {
      id: jobId,
      script: trimScript,
      title: trimTitle,
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

    // 3) On success, insert video row and perform transactional subtraction with atomic check
    const result = await db.transaction(async (tx) => {
      // create video record (queued)
      await tx.insert(video).values({
        id: jobId,
        userId,
        type: "narration",
        creditCost: creditCost,
        status: "queued",
      }).onConflictDoNothing()

      await tx.insert(narratedVideo).values({
        videoId: jobId,
        title: trimTitle,
        script: trimScript,
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
    return NextResponse.json({ error: "server_error: " + e }, { status: 500 })
  }
}