import { env } from "@/env.mjs"

import { storage } from "./gcs"

const BUCKET = env.PROVISIONED_BUCKET_NAME
const DAY_IN_SECONDS = 864000

export const getPresignedUrls = async ({
  key,
  bucket = BUCKET,
  expiresIn = DAY_IN_SECONDS,
}: {
  key: string
  bucket?: string
  expiresIn?: number
}) => {
  const [signedGetUrl] = await storage
    .bucket(bucket)
    .file(key)
    .getSignedUrl({
      version: "v4",
      action: "read",
      expires: Date.now() + expiresIn,
    })

  const [signedPutUrl] = await storage
    .bucket(bucket)
    .file(key)
    .getSignedUrl({
      version: "v4",
      action: "write",
      expires: Date.now() + expiresIn,
    })

  return {
    key,
    GET: signedGetUrl,
    PUT: signedPutUrl,
  }
}
