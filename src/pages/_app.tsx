import { AppProps, type AppType } from "next/app"
import { api } from "@/utils/api"
import { Inter as FontSans } from "@next/font/google"
import { type Session } from "next-auth"
import { SessionProvider } from "next-auth/react"

import "@/styles/globals.css"
import { NextComponentType, NextPageContext } from "next"
import { ThemeProvider } from "next-themes"

import { AuthStateProvider } from "@/lib/auth/context"

type AppAuthProps = AppProps & {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/ban-types
  Component: NextComponentType<NextPageContext, any, {}> &
    Partial<{ auth: boolean }>
}

const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
})

const MyApp: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps },
}: AppAuthProps) => {
  return (
    <>
      <style jsx global>{`
				:root {
					--font-sans: ${fontSans.style.fontFamily};
				}
			}`}</style>
      <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
        <SessionProvider session={session}>
          {Component.auth ? (
            <AuthStateProvider>
              <Component {...pageProps} />
            </AuthStateProvider>
          ) : (
            <Component {...pageProps} />
          )}
        </SessionProvider>
      </ThemeProvider>
    </>
  )
}

export default api.withTRPC(MyApp)
