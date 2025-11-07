import { S3Client, GetObjectCommand, HeadObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

export const r2 = new S3Client({
  region: "auto", // Cloudflare uses "auto"
  endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID!,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY!,
  },
});

export async function getSignedVideoUrl(
  id: string,
  opts?: { expiresIn?: number; requireExists?: boolean; download?: boolean }
): Promise<string | null> {
  const bucket = process.env.R2_BUCKET_NAME!
  const key = `${id}.mp4`
  const expiresIn = opts?.expiresIn ?? 3600
  const requireExists = opts?.requireExists ?? false
  const download = opts?.download ?? false

  if (requireExists) {
    try {
      await r2.send(new HeadObjectCommand({ Bucket: bucket, Key: key }))
    } catch (err: any) {
      if (err?.name === "NotFound" || err?.$metadata?.httpStatusCode === 404) {
        return null
      }
      throw err
    }
  }

  const command = new GetObjectCommand({
    Bucket: bucket,
    Key: key,
    ...(download && {
      ResponseContentDisposition: `attachment; filename="${id}.mp4"`,
      ResponseContentType: "application/octet-stream",
    }),
  })

  const signedUrl = await getSignedUrl(r2, command, { expiresIn })
  return signedUrl
}

export async function getSignedThumbUrl(
  id: string,
  opts?: { expiresIn?: number; requireExists?: boolean }
): Promise<string | null> {
  const bucket = process.env.R2_BUCKET_NAME!
  const key = `${id}.jpg`
  const expiresIn = opts?.expiresIn ?? 3600
  const requireExists = opts?.requireExists ?? false

  if (requireExists) {
    try {
      await r2.send(new HeadObjectCommand({ Bucket: bucket, Key: key }))
    } catch (err: any) {
      if (err?.name === "NotFound" || err?.$metadata?.httpStatusCode === 404) {
        return null
      }
      throw err
    }
  }

  const command = new GetObjectCommand({
    Bucket: bucket,
    Key: key,
    ResponseContentType: "image/jpeg",
  })
  const signedUrl = await getSignedUrl(r2, command, { expiresIn })
  return signedUrl
}
