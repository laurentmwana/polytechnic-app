interface ValidationErrorField {
  [key: string]: Array<string>
}

export interface ValidationError {
  message: string
  errors: ValidationErrorField[]
}
