import {
  ProfileEditFormSchemaInfer,
  ProfilePasswordFormSchemaInfer,
} from '@/definitions/profile'
import { apiRoute } from '@/lib/route'

export const editUserInfo = async (
  body: ProfileEditFormSchemaInfer,
  token: string
) => {
  return await fetch(apiRoute('profile.edit'), {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(body),
  })
}

export const changePassword = async (
  body: ProfilePasswordFormSchemaInfer,
  token: string
) => {
  return await fetch(apiRoute('profile.password'), {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(body),
  })
}
