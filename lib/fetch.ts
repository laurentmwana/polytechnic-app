import { ErrorResponse } from '@/types/fetch'

type FetchOptions = {
  method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'
  body?: Record<string, unknown> // Modifié pour accepter les objets complexes
  headers?: Record<string, string>
}

type ApiResponse<T> = {
  data: T
  status: number
}

type ValidationError = {
  [key: string]: string[]
}

type ApiResponseData<T> = T & {
  errors?: ValidationError
  message?: string
}

export class ApiError extends Error {
  constructor(
    public response: ErrorResponse,
    public validationErrors?: ValidationError
  ) {
    super(response.message)
    this.name = 'ApiError'
  }
}

export async function fetchJson<T>(
  path: string,
  options: FetchOptions = {}
): Promise<ApiResponse<T>> {
  const { method = 'GET', body, headers = {} } = options
  const url = process.env.API_ENTRY_POINT_URL + path

  try {
    const response = await fetch(url, {
      method,
      headers: {
        'Content-Type': 'application/json',
        ...headers,
      },
      body: body ? JSON.stringify(body) : undefined,
    })

    const responseData: ApiResponseData<T> = await response.json()

    if (response.status === 422 && responseData.errors) {
      throw new ApiError(
        {
          status: response.status,
          message: responseData.message || 'Erreur de validation',
          details: responseData.errors,
        },
        responseData.errors
      )
    }
    

    if (!response.ok) {
      throw new ApiError({
        status: response.status,
        message: responseData.message || `Erreur HTTP ${response.status}`,
      })
    }

    return {
      data: responseData as T,
      status: response.status,
    }
  } catch (error) {
    // On propage les ApiError existantes
    if (error instanceof ApiError) throw error

    // Gestion des erreurs réseau
    throw new ApiError({
      status: 500,
      message: error instanceof Error ? error.message : 'Échec réseau',
      details: error,
    })
  }
}
