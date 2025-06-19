import { getUserLocal } from "~/services/session";

export default defineNuxtRouteMiddleware((to) => {
  const user = getUserLocal();
  if (user && !user.isEmailVerified) {
    return navigateTo("/send-verification-email");
  }
});
