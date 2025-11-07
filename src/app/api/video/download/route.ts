import { NextRequest, NextResponse } from "next/server"
import { headers } from "next/headers"
import { auth } from "@/lib/auth"
import { r2 } from "@/lib/r2"
import { GetObjectCommand } from "@aws-sdk/client-s3"
import { Readable } from "stream"

export async function GET(req: NextRequest) {
  try {
    const session = await auth.api.getSession({ headers: await headers() })
    const userId = session?.user?.id
    if (!userId) return NextResponse.json({ error: "unauthorized" }, { status: 401 })

    const { searchParams } = new URL(req.url)
    const id = searchParams.get("id") || ""
    if (!id) return NextResponse.json({ error: "missing_id" }, { status: 400 })

    const bucket = process.env.R2_BUCKET_NAME!
    const key = `${id}.mp4`

    // Get object stream directly from R2
    const res = await r2.send(new GetObjectCommand({ Bucket: bucket, Key: key }))
    const body = res.Body as unknown as NodeJS.ReadableStream | undefined
    if (!body) return NextResponse.json({ error: "not_found" }, { status: 404 })

    const webStream = Readable.toWeb(body as any) as unknown as ReadableStream

    return new NextResponse(webStream, {
      status: 200,
      headers: {
        "Content-Type": "application/octet-stream",
        "Content-Disposition": `attachment; filename="${id}.mp4"`,
        "Cache-Control": "private, max-age=0, no-cache",
      },
    })
  } catch (err: any) {
    const code = err?.$metadata?.httpStatusCode
    if (code === 404) return NextResponse.json({ error: "not_found" }, { status: 404 })
    return NextResponse.json({ error: "internal_error" }, { status: 500 })
  }
}
