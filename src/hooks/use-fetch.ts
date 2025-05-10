import { useEffect, useState } from 'react'

interface UseFetchResponse<T> {
  result: T | null
  isLoading: boolean
  error: string | null
}

export const useFetch = <T>(
  path: string,
  headers?: Record<string, string>
): UseFetchResponse<T> => {
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [result, setResult] = useState<T | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!path) return

    let isCancelled = false

    const fetchDataAsync = async () => {
      setIsLoading(true)
      setError(null)

      try {
        const response = await fetch(path, {
          method: 'GET',
          headers: {
            Accept: 'application/json',
            ...headers,
          },
        })

        const responseData = await response.json()

        if (!response.ok) {
          const message =
            typeof responseData === 'object' &&
            responseData !== null &&
            'message' in responseData
              ? (responseData as { message: string }).message
              : `Erreur HTTP ${response.status}`
          throw new Error(message)
        }

        if (!isCancelled) setResult(responseData as T)
      } catch (err) {
        if (!isCancelled) {
          if (err instanceof Error) {
            setError(err.message)
          } else {
            setError('Une erreur inconnue est survenue')
          }
          setResult(null)
        }
      } finally {
        if (!isCancelled) setIsLoading(false)
      }
    }

    fetchDataAsync()

    return () => {
      isCancelled = true
    }
  }, [headers, path])

  return {
    result,
    isLoading,
    error,
  }
}
