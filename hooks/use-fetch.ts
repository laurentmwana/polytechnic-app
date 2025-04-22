import { useQuery } from '@tanstack/react-query'

export const useFetchQuery = (path: string) => {
  return useQuery({
    queryKey: [path],
    queryFn: async () => {
      return fetch(path).then((r) => r.json())
    },
  })
}
