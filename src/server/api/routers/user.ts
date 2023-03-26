import { createTRPCRouter, publicProcedure } from "../trpc"

export const userRouter = createTRPCRouter({
  list: publicProcedure.query(async ({ ctx }) => {
    return ctx.prisma.user.findMany({
      include: {
        _count: {
          select: {
            responses: true,
          },
        },
      },
    })
  }),
})
