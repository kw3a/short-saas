import { NextResponse } from "next/server"
import { headers } from "next/headers"
import { auth } from "@/lib/auth"
import { db } from "@/db"
import { video, creditAdjustment } from "@/db/schema"
import { and, desc, eq, isNotNull, lt } from "drizzle-orm"

export async function GET(req: Request) {
  try {
    const session = await auth.api.getSession({ headers: await headers() })
    const userId = session?.user?.id
    if (!userId) return NextResponse.json({ items: [], nextCursor: null }, { status: 200 })

    const { searchParams } = new URL(req.url)
    const type = (searchParams.get("type") || "spends").toLowerCase()
    const cursorCreatedAt = searchParams.get("cursorCreatedAt")
    const limitParam = Number(searchParams.get("limit") || 20)
    const limit = Math.min(Math.max(limitParam, 1), 50)

    if (type === "spends") {
      const whereBase = and(eq(video.userId, userId), isNotNull(video.creditCost))
      const where = cursorCreatedAt
        ? and(whereBase, lt(video.createdAt, new Date(cursorCreatedAt)))
        : whereBase
      const rows = await db
        .select({ id: video.id, status: video.status, creditCost: video.creditCost, createdAt: video.createdAt })
        .from(video)
        .where(where as any)
        .orderBy(desc(video.createdAt))
        .limit(limit + 1)
      const hasMore = rows.length > limit
      const items = rows.slice(0, limit)
      const nextCursor = hasMore ? { cursorCreatedAt: items[items.length - 1].createdAt?.toISOString?.() } : null
      return NextResponse.json({ items, nextCursor }, { status: 200 })
    } else {
      const whereBase = eq(creditAdjustment.userId, userId)
      const where = cursorCreatedAt
        ? and(whereBase, lt(creditAdjustment.createdAt, new Date(cursorCreatedAt)))
        : whereBase
      const rows = await db
        .select({ id: creditAdjustment.id, amount: creditAdjustment.amount, type: creditAdjustment.type, reason: creditAdjustment.reason, createdAt: creditAdjustment.createdAt })
        .from(creditAdjustment)
        .where(where as any)
        .orderBy(desc(creditAdjustment.createdAt))
        .limit(limit + 1)
      const hasMore = rows.length > limit
      const items = rows.slice(0, limit)
      const nextCursor = hasMore ? { cursorCreatedAt: items[items.length - 1].createdAt?.toISOString?.() } : null
      return NextResponse.json({ items, nextCursor }, { status: 200 })
    }
  } catch (e) {
    return NextResponse.json({ items: [], nextCursor: null }, { status: 200 })
  }
}
