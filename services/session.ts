import type { AuthModel } from "@/types/model";

export const getUserLocal = () => {
  if (import.meta.client) {
    const session = localStorage.getItem("SESSION_USER");
    return session ? (JSON.parse(session) as AuthModel) : null;
  }
  return null;
};

export const createUserLocal = (user: AuthModel) => {
  if (import.meta.client) {
    localStorage.setItem("SESSION_USER", JSON.stringify(user));
  }
  return true;
};

export const deleteUserLocal = () => {
  if (import.meta.client) {
    localStorage.removeItem("SESSION_USER");
  }
  return true;
};
