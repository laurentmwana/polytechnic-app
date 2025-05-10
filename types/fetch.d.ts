export type ErrorResponse = {
  status: number
  message: string
  details?: unknown
}

export type FetchOptions = {
  method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'
  body?: Record<string, unknown>
  headers?: Record<string, string>
}

export type ApiResponse<T> = {
  data: T
  status: number
}

export type ValidationError = {
  [key: string]: string[]
}
