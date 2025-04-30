export type ErrorResponse = {
  status: number
  message: string
  details?: unknown
}

export interface ValidationError<T> {
  message: string
  errors: {
    [key: keyof T]: Array<string>
  }
}
