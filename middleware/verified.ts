import { getUserLocal } from "~/services/session";


export default defineNuxtRouteMiddleware((to) => {
  const user = getUserLocal();

  if (!user && isStudentRoute(to.path)) {
    return navigateTo("/auth/login");
  }

  if (user && !isStudent(user.roles)) {
    return navigateTo("/verified-email");
  }
});
