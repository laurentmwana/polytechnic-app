import {
  ProfileEditFormSchemaInfer,
  ProfilePasswordFormSchemaInfer,
} from '@/definitions/profile'
import { apiLocalRoute } from '@/lib/route'

export const updateUserProfile = async (body: ProfileEditFormSchemaInfer) => {
  return await fetch(apiLocalRoute('profile.edit'), {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify(body),
  })
}

export const changePasswordProfile = async (
  body: ProfilePasswordFormSchemaInfer
) => {
  return await fetch(apiLocalRoute('profile.password'), {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify(body),
  })
}
