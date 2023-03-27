export const getFulfilled = async <T>(
  ps: Array<Promise<T>>
): Promise<Array<Awaited<T>>> => {
  const all = await Promise.allSettled(ps)
  return all.flatMap((psr) => {
    if (psr.status === "fulfilled") {
      return psr.value
    } else {
      return []
    }
  })
}
