import { LogOut, User } from "lucide-react"
import { signIn, signOut, useSession } from "next-auth/react"

import { buttonVariants } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export const UserDropdown = () => {
  const { status } = useSession()

  if (status === "loading") {
    return null
  }

  if (status === "authenticated") {
    return (
      <div className="relative inline-block text-left">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex h-9 w-9 items-center justify-center overflow-hidden rounded-full border border-gray-300 transition-all duration-75 focus:outline-none active:scale-95 sm:h-10 sm:w-10">
              <User className="h-5 w-5" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-full rounded-md p-1 sm:w-56"
            align="end"
          >
            <DropdownMenuItem
              className={buttonVariants({
                variant: "ghost",
                className: "w-full",
                justify: "start",
              })}
              onClick={() => signOut()}
            >
              <div className="flex items-center justify-start space-x-2">
                <LogOut className="h-4 w-4" />
                <p className="text-sm">Logout</p>
              </div>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    )
  }

  return (
    <button
      onClick={() => signIn()}
      className={buttonVariants({ variant: "default" })}
    >
      Sign In
    </button>
  )
}
