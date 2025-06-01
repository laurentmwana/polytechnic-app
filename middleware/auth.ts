import { deleteUserLocal, getUserLocal } from "~/services/session";

function isStudentRoute(path: string): boolean {
  return path.startsWith("/student");
}

export default defineNuxtRouteMiddleware((to) => {
  const user = getUserLocal();

  if (!user && isStudentRoute(to.path)) {
    return navigateTo("/auth/login");
  }

  if (user && !user.accessToken) {
    deleteUserLocal();

    return navigateTo("/auth/login");
  }
});
