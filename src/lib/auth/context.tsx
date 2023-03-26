import { createContext, useContext, useMemo } from "react"
import type { Session } from "next-auth"
import { useSession } from "next-auth/react"

import { FullScreenLoader } from "@/components/ui"

export const AuthStateContext = createContext<
  | {
      user: Session["user"]
      loading: boolean
    }
  | undefined
>(undefined)

export const useAuthState = () => {
  const context = useContext(AuthStateContext)
  if (context === undefined) {
    throw new Error("useAuthState must be used within a AuthStateProvider")
  }

  return context
}

const useProvideUser = () => {
  const { data, status } = useSession({ required: true })

  const loading = useMemo(() => status === "loading", [status])

  return {
    user: data?.user,
    loading,
  }
}

export const AuthStateProvider = ({ children }: { children: JSX.Element }) => {
  const { loading, user } = useProvideUser()

  if (loading || !user) {
    return <FullScreenLoader />
  }

  return (
    <AuthStateContext.Provider value={{ loading, user }}>
      {children}
    </AuthStateContext.Provider>
  )
}
