import Link from "next/link"

import { UserDropdown } from "./user-dropdown"

export const AppLayout = ({
  tabs,
  children,
}: {
  tabs: JSX.Element
  children: React.ReactNode
}) => {
  return (
    <div className="min-h-screen w-full">
      <div className="container z-30 border-b border-gray-300 dark:border-slate-700">
        <div className="mx-auto">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center">
              <Link
                href="/"
                className="scroll-m-20 text-3xl font-semibold tracking-tight transition-colors first:mt-0"
              >
                Atoms.
              </Link>
            </div>
            <UserDropdown />
          </div>
          {tabs}
        </div>
      </div>
      <div className="container">{children}</div>
    </div>
  )
}
