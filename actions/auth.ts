import { apiRoute } from '@/lib/route'
import { LoginPayload } from '@/types/auth'
import { FormErrorValidator } from '@/types/error'

type ServerValidatorError = FormErrorValidator<['email', 'password']>

export const signup = async (email: string, password: string) => {
  const response = await fetch(apiRoute('login'), {
    method: 'POST',
    headers: {
      'Content-Type': 'application.json',
      Accept: 'application.json',
    },
    body: JSON.stringify({ email, password }),
  })

  const data = await response.json()

  if (response.ok) {
    return data as LoginPayload
  }

  if (response.status === 422) {
    return data as ServerValidatorError
  }

  return data as { message: string }
}
