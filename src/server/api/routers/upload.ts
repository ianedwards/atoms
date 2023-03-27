import { randomUUID } from "crypto"

import { getPresignedUrls } from "@/lib/gcloud/signer"
import { createTRPCRouter, protectedProcedure } from "../trpc"

export const uploadRouter = createTRPCRouter({
  urls: protectedProcedure.mutation(async () => {
    const key = randomUUID()
    const urls = await getPresignedUrls({ key })

    return urls
  }),
})
