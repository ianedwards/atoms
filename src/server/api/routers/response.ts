import { TRPCError } from "@trpc/server"
import { ChatOpenAI } from "langchain/chat_models"
import { HumanChatMessage, SystemChatMessage } from "langchain/schema"
import { z } from "zod"

import { createTRPCRouter, protectedProcedure } from "../trpc"

const USER_MESSAGE_PROMPT = `Generate three questions that might be interesting for someone to have answers to on their profile page. Be creative and think of fun ideas. Output a JSON object with a questions key, similar to the following

{
    "questions": [
        "...",
        "...",
        "..."
    ]
}

Continue this: \`\`\`json {`

export const responseRouter = createTRPCRouter({
  getOptions: protectedProcedure.query(async () => {
    const chat = new ChatOpenAI({ temperature: 0.4 })

    const prompt = [
      new SystemChatMessage(`You are a social media platform moderator.
You are only able to output valid JSON.`),
      new HumanChatMessage(USER_MESSAGE_PROMPT),
    ]

    const response = await chat.call(prompt)
    const asText = response.text.trim().replaceAll("\n", "")
    const parsedQuestions = z
      .object({
        questions: z.array(z.string()),
      })
      .safeParse(JSON.parse(asText.startsWith("{") ? asText : `{ ${asText}`))

    if (!parsedQuestions.success) {
      throw new TRPCError({
        code: "PRECONDITION_FAILED",
        message: "Unable to generate questions. Try again!",
      })
    }

    return parsedQuestions.data
  }),

  create: protectedProcedure
    .input(
      z
        .object({
          question: z.string(),
          answer: z.string(),
        })
        .array()
    )
    .mutation(async ({ ctx, input }) => {
      await ctx.prisma.response.createMany({
        data: input.map((i) => ({
          question: i.question,
          answer: i.answer,
          userId: ctx.session.user.id,
        })),
      })

      return {}
    }),
})
