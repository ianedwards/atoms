import { useCallback, useState } from "react"
import { api } from "@/utils/api"
import { zodResolver } from "@hookform/resolvers/zod"
import { PlusCircle } from "lucide-react"
import { useSession } from "next-auth/react"
import { useForm } from "react-hook-form"
import { z } from "zod"

import { Spinner } from "../ui"
import { Button, buttonVariants } from "../ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog"
import { Input } from "../ui/input"

const formData = z.object({
  answers: z.array(z.string()),
})

type FormData = z.infer<typeof formData>

const AnswerQuestions = ({
  isOpen,
  setIsOpen,
}: {
  isOpen: boolean
  setIsOpen: (isOpen: boolean) => void
}) => {
  const { data } = useSession()
  const utils = api.useContext()
  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(formData),
    reValidateMode: "onSubmit",
  })

  const {
    data: options,
    refetch,
    isFetching,
  } = api.response.getOptions.useQuery(undefined, {
    enabled: false,
    refetchOnWindowFocus: false,
  })
  const addResponses = api.response.create.useMutation({
    async onSuccess() {
      if (data) {
        await utils.user.getById.invalidate({ id: data.user.id })
      }
    },
  })

  const onSubmit = handleSubmit(async (data) => {
    const responsePairs = data.answers
      .map((a, i) => {
        const question = options?.questions[i]
        if (!a || !question) return

        return {
          question,
          answer: a,
        }
      })
      .filter(Boolean) as { question: string; answer: string }[]

    await addResponses.mutateAsync(responsePairs)
    setIsOpen(false)
  })

  const renderResponses = () => {
    if (isFetching || isSubmitting) {
      return (
        <div className="mt-10 h-full max-w-full">
          <div className="flex items-center justify-center p-10">
            <div className="h-12 w-12 text-neutral-600 dark:text-white">
              <Spinner />
            </div>
          </div>
        </div>
      )
    }

    return (
      <form className="w-full" onSubmit={onSubmit}>
        <div className="grid gap-4 py-4">
          {options?.questions.map((q, i) => (
            <div key={`${q}_${i}`} className="flex flex-col space-y-1">
              <p className="px-1">
                {`${i + 1}. `}
                {q}
              </p>
              <Input {...register(`answers.${i}`)} type="text" />
            </div>
          ))}
        </div>
        <DialogFooter>
          <Button type="submit" disabled={isSubmitting}>
            Save changes
          </Button>
        </DialogFooter>
      </form>
    )
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <div className="flex w-full items-center justify-center">
          <button
            className={buttonVariants({ variant: "default" })}
            onClick={() => refetch()}
          >
            <div className="flex items-center justify-start space-x-2">
              <PlusCircle className="h-5 w-5" />
              <p>Add</p>
            </div>
          </button>
        </div>
      </DialogTrigger>
      <DialogContent className="sm:max-w-3xl">
        <DialogHeader>
          <DialogTitle>Edit responses</DialogTitle>
          <DialogDescription>
            Make changes to your profile here. Click save when you&apos;re done.
          </DialogDescription>
        </DialogHeader>
        {renderResponses()}
      </DialogContent>
    </Dialog>
  )
}

export const useAnswerQuestionsModal = () => {
  const [isOpen, setIsOpen] = useState(false)

  const AnswerQuestionsModal = useCallback(() => {
    return <AnswerQuestions isOpen={isOpen} setIsOpen={setIsOpen} />
  }, [isOpen])

  return {
    AnswerQuestionsModal,
    isOpen,
    setIsOpen,
  }
}
