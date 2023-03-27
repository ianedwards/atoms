import Link from "next/link"
import { api } from "@/utils/api"
import { format } from "date-fns"
import { AlertCircle, HelpCircle, User } from "lucide-react"

import { cn } from "@/lib/utils"
import { Spinner } from "../ui"
import { Avatar, AvatarImage } from "../ui/avatar"

export const Users = () => {
  const { data, status } = api.user.list.useQuery()

  if (status === "loading") {
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

  if (status === "error") {
    return (
      <div className="mt-10 h-full max-w-full">
        <div className="mt-2 flex items-center justify-center">
          <div className="flex flex-col space-y-2">
            <AlertCircle className="h-12 w-12 self-center text-red-500" />
            <p className="text-red-500">Something went wrong!</p>
          </div>
        </div>
      </div>
    )
  }

  if (!data.length) {
    return (
      <div className="mt-10 h-full max-w-full">
        <div className="mt-2 flex items-center justify-center">
          <div className="flex flex-col space-y-2">
            <AlertCircle className="h-12 w-12 self-center text-white" />
            <p className="text-white">No one has joined yet!</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="w-full py-10">
      <ul className="grid grid-cols-1 gap-3">
        {data.map((user) => (
          <Link
            href={`/users/${user.id}`}
            className="relative cursor-pointer rounded-lg bg-white p-3 pr-1 shadow transition-all hover:shadow-md dark:bg-slate-800 sm:p-4"
          >
            <div className="absolute top-0 left-0 flex h-full w-1.5 flex-col overflow-hidden rounded-l-lg">
              <div className="h-full w-full bg-green-500" />
            </div>
            <li className="relative flex items-center justify-between">
              <div className="relative flex shrink items-center space-x-2 sm:space-x-4">
                {user.image ? (
                  <Avatar>
                    <AvatarImage
                      src={user.image}
                      referrerPolicy="no-referrer"
                    />
                  </Avatar>
                ) : (
                  <User className="h-10 w-10" />
                )}
                <div>
                  <div className="flex max-w-fit items-center space-x-2">
                    <div className="w-24 truncate text-sm font-semibold text-blue-400 sm:w-full sm:text-base">
                      {user.name}
                    </div>

                    <div
                      className={cn(
                        "flex items-center space-x-1 rounded-md  px-2 py-0.5 transition-all duration-75 hover:scale-105 active:scale-100",
                        user._count.responses <= 1
                          ? "bg-red-100"
                          : user._count.responses === 2
                          ? "bg-amber-100"
                          : "bg-green-100"
                      )}
                    >
                      <p className="whitespace-nowrap text-sm text-gray-500">
                        {user._count.responses}
                        <span className="hidden sm:inline-block">/3</span>
                      </p>
                      <HelpCircle className="h-4 w-4 text-gray-500" />
                    </div>
                  </div>
                  <h3 className="max-w-[200px] truncate text-sm font-medium text-neutral-600 dark:text-white md:max-w-md lg:max-w-2xl xl:max-w-3xl">
                    {`Joined on ${format(user.createdAt, "MM/dd/yyyy")}`}
                  </h3>
                </div>
              </div>

              <div className="flex items-center"></div>
            </li>
          </Link>
        ))}
      </ul>
    </div>
  )
}
