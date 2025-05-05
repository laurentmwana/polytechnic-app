export interface LoginPayload {
  access_token: string
  token_type: 'bearer'
  expires_in: number
}

export interface JwtPayload {
  iss?: string
  sub?: string
  aud?: string | string[]
  jti?: string
  nbf?: number
  exp?: number
  iat?: number
  [propName: string]: unknown
}
