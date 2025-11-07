import { NextResponse } from "next/server"
import { headers } from "next/headers"
import { auth } from "@/lib/auth"
import { db } from "@/db"
import { creditPurchase, creditPackage } from "@/db/schema"
import { and, desc, eq, lt } from "drizzle-orm"

export async function GET(req: Request) {
  try {
    const session = await auth.api.getSession({ headers: await headers() })
    const userId = session?.user?.id
    if (!userId) return NextResponse.json({ items: [], nextCursor: null }, { status: 200 })

    const { searchParams } = new URL(req.url)
    const cursorCreatedAt = searchParams.get("cursorCreatedAt")
    const limitParam = Number(searchParams.get("limit") || 20)
    const limit = Math.min(Math.max(limitParam, 1), 50)

    const whereBase = eq(creditPurchase.userId, userId)
    const where = cursorCreatedAt
      ? and(whereBase, lt(creditPurchase.createdAt, new Date(cursorCreatedAt)))
      : whereBase

    const rows = await db
      .select({
        id: creditPurchase.id,
        amountCents: creditPurchase.amountCents,
        status: creditPurchase.status,
        createdAt: creditPurchase.createdAt,
        pkgName: creditPackage.name,
        pkgCredits: creditPackage.credits,
      })
      .from(creditPurchase)
      .leftJoin(creditPackage, eq(creditPurchase.packageId, creditPackage.id))
      .where(where as any)
      .orderBy(desc(creditPurchase.createdAt))
      .limit(limit + 1)

    const hasMore = rows.length > limit
    const items = rows.slice(0, limit)
    const nextCursor = hasMore ? { cursorCreatedAt: items[items.length - 1].createdAt?.toISOString?.() } : null

    return NextResponse.json({ items, nextCursor }, { status: 200 })
  } catch (e) {
    return NextResponse.json({ items: [], nextCursor: null }, { status: 200 })
  }
}
