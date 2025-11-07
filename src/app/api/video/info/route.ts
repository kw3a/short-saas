import { NextRequest, NextResponse } from "next/server"
import { headers } from "next/headers"
import { auth } from "@/lib/auth"
import { db } from "@/db"
import { video, narratedVideo, askredditVideo } from "@/db/schema"
import { eq } from "drizzle-orm"

export async function GET(req: NextRequest) {
  try {
    const session = await auth.api.getSession({ headers: await headers() })
    const userId = session?.user?.id
    if (!userId) return NextResponse.json({ error: "unauthorized" }, { status: 401 })

    const { searchParams } = new URL(req.url)
    const id = searchParams.get("id") || ""
    if (!id) return NextResponse.json({ error: "missing_id" }, { status: 400 })

    // Fetch base video row (ensures ownership)
    const vids = await db
      .select({ id: video.id, type: video.type, status: video.status, createdAt: video.createdAt, userId: video.userId })
      .from(video)
      .where(eq(video.id, id))
      .limit(1)

    const v = vids[0]
    if (!v || v.userId !== userId) return NextResponse.json({ error: "not_found" }, { status: 404 })

    // Try to fetch narrated video extras
    if (v.type === "narration") {
      let extras: { title: string | null; script: string | null; voice: string | null; bgVideo: string | null; music: string | null } | null = null
      const ex = await db
        .select({ title: narratedVideo.title, script: narratedVideo.script, voice: narratedVideo.voice, bgVideo: narratedVideo.bgVideo, music: narratedVideo.music })
        .from(narratedVideo)
        .where(eq(narratedVideo.videoId, id))
        .limit(1)

      extras = ex[0] || null
      return NextResponse.json({
        id: v.id,
        type: v.type,
        status: v.status,
        createdAt: v.createdAt,
        title: extras?.title ?? null,
        script: extras?.script ?? null,
        voice: extras?.voice ?? null,
        bgVideo: extras?.bgVideo ?? null,
        music: extras?.music ?? null,
      })
    } else if (v.type === "askreddit") {
      let extras: { title: string | null; comments: string[] | null; voice: string | null; bgVideo: string | null; music: string | null } | null = null
      const ex = await db
        .select({ title: askredditVideo.title, comments: askredditVideo.comments, voice: askredditVideo.voice, bgVideo: askredditVideo.bgVideo, music: askredditVideo.music })
        .from(askredditVideo)
        .where(eq(askredditVideo.videoId, id))
        .limit(1)
      
      extras = ex[0] || null
      return NextResponse.json({
        id: v.id,
        type: v.type,
        status: v.status,
        createdAt: v.createdAt,
        title: extras?.title ?? null,
        comments: extras?.comments ?? null,
        voice: extras?.voice ?? null,
        bgVideo: extras?.bgVideo ?? null,
        music: extras?.music ?? null,
      })
    }

    // Default: return base info if type is not matched above
    return NextResponse.json({
      id: v.id,
      type: v.type,
      status: v.status,
      createdAt: v.createdAt,
    })
  } catch (err) {
    return NextResponse.json({ error: "internal_error" }, { status: 500 })
  }
}
