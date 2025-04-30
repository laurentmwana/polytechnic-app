import { useQuery } from '@tanstack/react-query'

export const useFetchQuery = <T>(path: string) => {
  return useQuery({
    queryKey: [path],
    queryFn: async () => {
      return fetch(path).then((r) => r.json() as T)
    },
  })
}
