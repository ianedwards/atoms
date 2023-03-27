import { createTRPCRouter } from "@/server/api/trpc"

import { responseRouter } from "./routers/response"
import { uploadRouter } from "./routers/upload"
import { userRouter } from "./routers/user"

export const appRouter = createTRPCRouter({
  user: userRouter,
  response: responseRouter,
  upload: uploadRouter,
})

// export type definition of API
export type AppRouter = typeof appRouter
