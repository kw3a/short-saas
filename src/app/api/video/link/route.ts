import { headers } from "next/headers"
import { NextRequest, NextResponse } from "next/server";
import { getSignedVideoUrl } from "@/lib/r2";
import { auth } from "@/lib/auth"

export async function GET(req: NextRequest) {
  try {
    const session = await auth.api.getSession({ headers: await headers() })
    const userId = session?.user?.id
    if (!userId) return NextResponse.json({ error: "unauthorized" }, { status: 401 })
    const { searchParams } = new URL(req.url)
    const id = searchParams.get("id") || ""
    const download = searchParams.get("download") === "1" || searchParams.get("download") === "true"
    if (!id) {
      return NextResponse.json({ error: "missing_id" }, { status: 400 });
    }

    // Check existence and generate signed URL
    const signedUrl = await getSignedVideoUrl(id, { expiresIn: 3600, requireExists: true, download });
    if (!signedUrl) return NextResponse.json({ error: "not_found" }, { status: 404 });

    return NextResponse.json({ id, videoUrl: signedUrl }, { status: 200 });
  } catch (err) {
    console.error("Unexpected error:", err);
    return NextResponse.json({ error: "internal_error" }, { status: 500 });
  }
}
