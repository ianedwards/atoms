import { TRPCError } from "@trpc/server"
import { z } from "zod"

import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc"

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

  getById: publicProcedure
    .input(
      z.object({
        id: z.string(),
      })
    )
    .query(async ({ ctx, input }) => {
      const user = await ctx.prisma.user.findUnique({
        where: {
          id: input.id,
        },
        select: {
          id: true,
          name: true,
          image: true,
          responses: {
            select: {
              id: true,
              question: true,
              answer: true,
            },
          },
        },
      })

      if (!user) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "User not found!",
        })
      }

      return { user, isCurrentUser: ctx.session?.user.id === user.id }
    }),

  changeAvatar: protectedProcedure
    .input(z.object({ key: z.string() }))
    .mutation(async ({}) => {
      return
    }),
})
