import { NextResponse } from "next/server"
import { headers } from "next/headers"
import { auth } from "@/lib/auth"
import { db } from "@/db"
import { balance } from "@/db/schema"
import { eq } from "drizzle-orm"

export async function GET() {
  try {
    const session = await auth.api.getSession({
      headers: await headers() // you need to pass the headers object.
    })
    if (!session) return NextResponse.json({ totalCredits: 0 }, { status: 200 })
    const userId: string | undefined = session.user.id

    if (!userId) return NextResponse.json({ totalCredits: 0 }, { status: 200 })

    const rows = await db.select({ totalCredits: balance.totalCredits }).from(balance).where(eq(balance.userId, userId)).limit(1)
    const totalCredits = rows[0]?.totalCredits ?? 0

    return NextResponse.json({ totalCredits }, { status: 200 })
  } catch (e) {
    return NextResponse.json({ totalCredits: 0 }, { status: 200 })
  }
}
