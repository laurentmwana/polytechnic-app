import { UtilModel } from '@/types/model'

enum SPATIE_ROLES {
  ROLE_ADMIN = 'ROLE_ADMIN',
  ROLE_STUDENT = 'ROLE_STUDENT',
  ROLE_PROFESSOR = 'ROLE_PROFESSOR',
  ROLE_PERSONAL_ACADEMIC = 'ROLE_PERSONAL_ACADEMIC',
  ROLE_ANONYMOUS = 'ROLE_ANONYMOUS',
}

export const isAdmin = (roles?: UtilModel[]): boolean => {
  return roles ? roles.some((role) => role.name == SPATIE_ROLES.ROLE_ADMIN) : false
}

export const isStudent = (): boolean => {
  return false
}
