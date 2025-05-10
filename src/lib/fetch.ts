import {
  ApiResponse,
  ErrorResponse,
  FetchOptions,
  ValidationError,
} from '#/fetch'

type ApiResponseData<T> = {
  data?: T
  errors?: ValidationError
  message?: string
}

export class ApiError extends Error {
  public response: ErrorResponse
  public validationErrors?: ValidationError

  constructor(response: ErrorResponse, validationErrors?: ValidationError) {
    super(response.message)
    this.name = 'ApiError'
    this.response = response
    this.validationErrors = validationErrors
    // Maintenir la trace de la pile d'appels (utile pour le debug)
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, ApiError)
    }
  }
}

export async function fetchJson<T>(
  path: string,
  options: FetchOptions = {}
): Promise<ApiResponse<T>> {
  const { method = 'GET', body, headers = {} } = options

  try {
    const response = await fetch(path, {
      method,
      headers: {
        'Content-Type': 'application/json',
        ...headers,
      },
      body: ['GET', 'HEAD'].includes(method)
        ? undefined
        : body
        ? JSON.stringify(body)
        : undefined,
    })

    let responseData: ApiResponseData<T> = {} as ApiResponseData<T>
    try {
      responseData = await response.json()
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (jsonError) {
      // Si la réponse n’est pas JSON, on peut gérer ça ici
      if (response.ok) {
        // Réponse sans corps, on retourne un objet vide ou null selon le besoin
        return { data: null as unknown as T, status: response.status }
      } else {
        throw new ApiError({
          status: response.status,
          message: `Réponse non JSON avec statut ${response.status}`,
        })
      }
    }

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
        details: responseData.errors,
      })
    }

    return {
      data: responseData as T,
      status: response.status,
    }
  } catch (error) {
    if (error instanceof ApiError) throw error

    throw new ApiError({
      status: 500,
      message: error instanceof Error ? error.message : 'Échec réseau',
      details: error,
    })
  }
}
