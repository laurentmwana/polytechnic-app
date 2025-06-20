import type { AuthModel } from "@/types/model";

export const getUserLocal = (): AuthModel | null => {
  const userCookie = useCookie<AuthModel | null>("SESSION_USER");
  return userCookie.value ?? null;
};

export const createUserLocal = (user: AuthModel) => {
  const userCookie = useCookie<AuthModel>("SESSION_USER");
  userCookie.value = user;
  return true;
};

export const updateUserLocal = (updateUser: AuthModel) => {
  const user  = getUserLocal()
  const newUserToSave = {
    ...user,
    ...updateUser
  }
  createUserLocal(newUserToSave)
};


export const deleteUserLocal = () => {
  const userCookie = useCookie<AuthModel | null>("SESSION_USER");
  userCookie.value = null;
  return true;
};
