import { getUserLocal } from "~/services/session";

const authRoutes = ["/auth/login", "/auth/forgot-password"];

export default defineNuxtRouteMiddleware((to, from) => {
  const user = getUserLocal();

  if (user && authRoutes.includes(to.path)) {
    return navigateTo("/");
  }

  if (!user && !authRoutes.includes(to.path)) {
    return navigateTo("/auth/login");
  }
});
