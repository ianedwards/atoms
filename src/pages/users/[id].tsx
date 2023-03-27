import { type NextPage } from "next"
import { useRouter } from "next/router"
import { api } from "@/utils/api"
import { AlertCircle, User } from "lucide-react"
import { z } from "zod"

import { Responses } from "@/components/app/responses"
import { AppLayout } from "@/components/layout"
import { FullScreenLoader } from "@/components/ui"
import { AspectRatio } from "@/components/ui/aspect-ratio"

const Profile: NextPage = () => {
  const router = useRouter()
  const { data, status } = api.user.getById.useQuery(
    {
      id: z.string().catch("").parse(router.query.id),
    },
    {
      enabled: router.isReady,
    }
  )

  if (status === "loading") {
    return <FullScreenLoader />
  }

  return (
    <AppLayout
      tabs={
        <div className="-mb-0.5 flex h-12 items-center justify-start space-x-2">
          <div className="border-b-2 border-black p-1 dark:border-white">
            <div className="rounded-md px-3 py-2 transition-all duration-75 hover:bg-slate-700 active:bg-gray-200">
              <p className="text-sm">Profile</p>
            </div>
          </div>
        </div>
      }
    >
      {status === "error" && (
        <div className="mt-10 h-full max-w-full">
          <div className="mt-2 flex items-center justify-center">
            <div className="flex flex-col space-y-2">
              <AlertCircle className="h-12 w-12 self-center text-red-500" />
              <p className="text-red-500">Something went wrong!</p>
            </div>
          </div>
        </div>
      )}
      {status === "success" && (
        <>
          <div className="z-30 flex h-36 w-full items-center border-b border-gray-300">
            <div className="flex w-full items-center">
              <div className="group mt-20 h-44 w-36">
                {data.user.image ? (
                  <AspectRatio ratio={16 / 9}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={data.user.image}
                      className="rounded-full object-cover group-hover:opacity-75"
                      alt=""
                      referrerPolicy="no-referrer"
                    />
                  </AspectRatio>
                ) : (
                  <User className="h-24 w-auto" />
                )}
              </div>
              <h2 className="scroll-m-20 pb-2 text-3xl font-semibold tracking-tight transition-colors first:mt-0 dark:border-b-slate-700">
                {data.user.name}
              </h2>
            </div>
          </div>

          <div className="py-10">
            <Responses
              isCurrentUser={data.isCurrentUser}
              responses={data.user.responses}
            />
          </div>
        </>
      )}
    </AppLayout>
  )
}

export default Profile
