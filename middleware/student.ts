import { getUserLocal } from "~/services/session";
import { isStudent } from "../lib/role";

const routes = ["/course-follow", "/result"];

function isStudentRoute(path: string): boolean {
  return path.startsWith("/student") || routes.includes(path);
}

export default defineNuxtRouteMiddleware((to) => {
  const user = getUserLocal();

  if (!user && isStudentRoute(to.path)) {
    return navigateTo("/auth/login");
  }

  if (user && !isStudent(user.roles)) {
    return navigateTo("/unauthorized");
  }
});
