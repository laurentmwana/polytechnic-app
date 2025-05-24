enum ROLES {
  ADMIN = 'administrateur',
  STUDENT = 'étudiant',
  DEFAULT = 'inconnu(e)',
}

export const isAdmin = (role?: string): boolean => {
  return role ? role == ROLES.ADMIN : false
}

export const isStudent = (role?: string): boolean => {
  console.log(role)
  return role ? role == ROLES.STUDENT : false
}

export const isAnonymous = (role?: string): boolean => {
  return role ? role == ROLES.DEFAULT : false
}
