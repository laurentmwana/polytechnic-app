import { getUserLocal } from "~/services/session";
import { isAdmin } from "../lib/role";

function isAdminRoute(path: string): boolean {
  if (path.startsWith("/admin")) return true;

  return path === "/dashboard";
}

export default defineNuxtRouteMiddleware((to) => {
  const user = getUserLocal();

  if (!user && isAdminRoute(to.path)) {
    return navigateTo("/auth/login");
  }

  if (user && !isAdmin(user.roles) && isAdminRoute(to.path)) {
    return navigateTo("/unauthorized");
  }
});
