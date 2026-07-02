import { NextRequest, NextResponse } from "next/server"
import { db } from "@/db"
import { video } from "@/db/schema"
import { eq } from "drizzle-orm"
import { getSignedVideoUrl } from "@/lib/r2";
import { auth } from "@/lib/auth"
import { headers } from "next/headers"

export async function GET(req: NextRequest) {
  const session = await auth.api.getSession({ headers: await headers() })
  const userId = session?.user?.id
  if (!userId) return NextResponse.json({ error: "unauthorized" }, { status: 401 })
  const { searchParams } = new URL(req.url)
  const id = searchParams.get("id") || ""
  if (!id) return NextResponse.json({ error: "missing_id" }, { status: 400 })

  try {
    const h = await db.select({ status: video.status, progress: video.progress }).from(video).where(eq(video.id, id)).limit(1)
    const status = h[0]?.status || "missing"
    const progress = status === "completed" ? 100 : (h[0]?.progress ?? 0)
    if (status === "completed") {
      try {
        const signedUrl = await getSignedVideoUrl(id, { expiresIn: 3600 })
        if (!signedUrl) return NextResponse.json({ id, status, progress, videoUrl: null }, { status: 200 })
        return NextResponse.json({ id, status, progress, videoUrl: signedUrl }, { status: 200 })
      } catch (e) {
        return NextResponse.json({ id, status, progress }, { status: 200 })
      }
    }
    return NextResponse.json({ id, status, progress }, { status: 200 })
  } catch (e) {
    return NextResponse.json({ id, status: "missing", progress: 0 }, { status: 200 })
  }
}
