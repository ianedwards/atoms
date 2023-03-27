import { RouterOutputs } from "@/utils/api"
import { Edit3 } from "lucide-react"

import { useAnswerQuestionsModal } from "../modals/answer-questions"

export const Responses = ({
  responses,
  isCurrentUser,
}: {
  responses: RouterOutputs["user"]["getById"]["user"]["responses"]
  isCurrentUser: boolean
}) => {
  const { AnswerQuestionsModal } = useAnswerQuestionsModal()
  return (
    <div className="p-4">
      {responses.length === 0 && (
        <div className="h-36 py-6">
          <Edit3 className="mx-auto h-12 w-auto" />
          <p className="text-center">No Responses!</p>
        </div>
      )}
      {responses.length > 0 && (
        <ul className="divide-y divide-gray-200">
          {responses.map((response) => (
            <li key={response.id} className="flex flex-col space-y-2 py-4">
              <h4 className="scroll-m-20 text-xl font-semibold italic tracking-tight">
                {response.question}
              </h4>
              <p>{response.answer}</p>
            </li>
          ))}
        </ul>
      )}
      {responses.length === 0 && isCurrentUser && (
        <div className="flex w-full items-center justify-center">
          <AnswerQuestionsModal />
        </div>
      )}
    </div>
  )
}
