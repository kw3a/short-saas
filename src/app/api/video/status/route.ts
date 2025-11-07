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
    const h = await db.select({ status: video.status }).from(video).where(eq(video.id, id)).limit(1)
    const status = h[0]?.status || "missing"
    if (status === "completed") {
      try {
        const signedUrl = await getSignedVideoUrl(id, { expiresIn: 3600 })
        if (!signedUrl) return NextResponse.json({ id, status, videoUrl: null }, { status: 200 })
        return NextResponse.json({ id, status, videoUrl: signedUrl }, { status: 200 })
      } catch (e) {
        return NextResponse.json({ id, status }, { status: 200 })
      }
    }
    return NextResponse.json({ id, status }, { status: 200 })
  } catch (e) {
    return NextResponse.json({ id, status: "missing" }, { status: 200 })
  }
}
