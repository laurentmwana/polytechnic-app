import { getUserLocal } from "~/services/session";
import { isStudent } from "../lib/role";

function isStudentRoute(path: string): boolean {
  return path.startsWith("/student");
}

export default defineNuxtRouteMiddleware((to) => {
  const user = getUserLocal();

  if (!user && isStudentRoute(to.path)) {
    return navigateTo("/auth/login");
  }

  if (user && !isStudent(user.roles) && isStudentRoute(to.path)) {
    return navigateTo("/unauthorized");
  }
});
