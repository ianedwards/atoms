import { getFulfilled } from "@/utils/promise"
import { TRPCError } from "@trpc/server"
import { z } from "zod"

import { getPresignedUrls } from "@/lib/gcloud/signer"
import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc"

export const userRouter = createTRPCRouter({
  list: publicProcedure.query(async ({ ctx }) => {
    const users = await ctx.prisma.user.findMany({
      include: {
        _count: {
          select: {
            responses: true,
          },
        },
      },
    })

    const withAvatars = await getFulfilled(
      users.map(async (u) => {
        if (u.avatarKey) {
          const urls = await getPresignedUrls({ key: u.avatarKey })
          return {
            ...u,
            avatar: urls,
          }
        }

        return {
          ...u,
          avatar: null,
        }
      })
    )

    return withAvatars
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
          avatarKey: true,
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

      if (user.avatarKey) {
        const urls = await getPresignedUrls({ key: user.avatarKey })
        return {
          user,
          avatar: urls,
          isCurrentUser: ctx.session?.user.id === user.id,
        }
      }

      return {
        user,
        avatar: null,
        isCurrentUser: ctx.session?.user.id === user.id,
      }
    }),

  changeAvatar: protectedProcedure
    .input(z.object({ key: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const user = await ctx.prisma.user.update({
        where: {
          id: ctx.session.user.id,
        },
        data: {
          avatarKey: input.key,
        },
      })

      return { user }
    }),
})
