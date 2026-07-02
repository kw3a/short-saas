import { NextRequest, NextResponse } from "next/server"
import { db } from "@/db"
import { video } from "@/db/schema"
import { and, desc, lt, eq, or } from "drizzle-orm"
import { auth } from "@/lib/auth"
import { headers } from "next/headers"
import { getSignedThumbUrl } from "@/lib/r2"

const PAGE_SIZE = 20

export async function GET(req: NextRequest) {
  const session = await auth.api.getSession({ headers: await headers() })
  const userId = session?.user?.id
  if (!userId) return NextResponse.json({ error: "unauthorized" }, { status: 401 })
  const { searchParams } = new URL(req.url)
  const cursorCreatedAt = searchParams.get("cursorCreatedAt")
  const cursorId = searchParams.get("cursorId")
  const limitParam = Number(searchParams.get("limit") || PAGE_SIZE)
  const limit = Math.min(Math.max(limitParam, 1), 50)

  const base = eq(video.userId, userId)
  const where = cursorCreatedAt
    ? and(
        base,
        or(
          lt(video.createdAt, new Date(cursorCreatedAt)),
          and(eq(video.createdAt, new Date(cursorCreatedAt)), cursorId ? lt(video.id, cursorId) : (eq(video.id, video.id) as any))
        )
      )
    : base

  const rows = await db.select({ id: video.id, status: video.status, progress: video.progress, createdAt: video.createdAt, type: video.type, creditCost: video.creditCost })
    .from(video)
    .where(where as any)
    .orderBy(desc(video.createdAt))
    .limit(limit + 1)

  const hasMore = rows.length > limit
  const items = rows.slice(0, limit)
  const last = items[items.length - 1]
  const nextCursor = hasMore && last ? { cursorCreatedAt: last.createdAt?.toISOString(), cursorId: last.id } : null

  const result = await Promise.all(items.map(async (r) => {
    const thumbUrl = await getSignedThumbUrl(r.id, { expiresIn: 3600, requireExists: false })
    return { id: r.id, status: r.status, progress: r.progress, createdAt: r.createdAt, type: r.type, creditCost: r.creditCost, thumbUrl }
  }))

  return NextResponse.json({ items: result, nextCursor })
}
