export interface FormErrorValidator<T extends readonly string[]> {
  message: string
  errors: {
    [key in T[number]]: string[]
  }
}
