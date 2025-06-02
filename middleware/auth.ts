import { deleteUserLocal, getUserLocal } from "~/services/session";

export default defineNuxtRouteMiddleware((to) => {
  const user = getUserLocal();

  if (!user) {
    return navigateTo("/auth/login");
  }

  if (user && !user.accessToken) {
    deleteUserLocal();

    return navigateTo("/auth/login");
  }
});
