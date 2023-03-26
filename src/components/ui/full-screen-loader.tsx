import { Spinner } from "./loader"

export const FullScreenLoader = () => (
  <div className="flex h-screen items-center justify-center bg-neutral-50">
    <div className="h-12 w-12 text-neutral-600">
      <Spinner />
    </div>
  </div>
)
