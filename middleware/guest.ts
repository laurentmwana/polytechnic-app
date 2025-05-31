import { getUserLocal } from "~/services/session";

const routes = ["/auth/login", "/auth/forgot-password"];

export default defineNuxtRouteMiddleware((to, from) => {
  const user = getUserLocal();

  if (routes.includes(from.path) && user !== null) {
    return navigateTo(to.path);
  }
});
