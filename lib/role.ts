const ADMIN = "admin";
const STUDENT = "student";
const DISABLE = "lock";

export const isStudent = (roles?: string[] | null) => {
  return !roles ? false : roles.includes(STUDENT);
};

export const isAdmin = (roles?: string[] | null) => {
  return !roles ? false : roles.includes(ADMIN);
};

export const isStudentAccountDisable = (roles?: string[] | null) => {
  return !roles ? false : roles.includes(DISABLE);
};
