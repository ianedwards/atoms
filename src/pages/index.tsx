import { type NextPage } from "next"

import { Users } from "@/components/app/users"
import { AppLayout } from "@/components/layout"

const Home: NextPage = () => {
  return (
    <AppLayout
      tabs={
        <div className="-mb-0.5 flex h-12 items-center justify-start space-x-2">
          <div className="border-b-2 border-black p-1 dark:border-white">
            <div className="rounded-md px-3 py-2 transition-all duration-75 hover:bg-slate-700 active:bg-gray-200">
              <p className="text-sm">Community</p>
            </div>
          </div>
        </div>
      }
    >
      <div className="z-30 flex h-36 w-full items-center border-b border-gray-200">
        <div className="flex w-full items-center justify-between">
          <h2 className="scroll-m-20 pb-2 text-3xl font-semibold tracking-tight transition-colors first:mt-0 dark:border-b-slate-700">
            Community
          </h2>
        </div>
      </div>
      <Users />
    </AppLayout>
  )
}

export default Home
