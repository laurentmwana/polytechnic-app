import type { AuthModel } from "@/types/model";
import { computed, onMounted, readonly, ref } from "vue";
import { getUserLocal } from "~/services/session";
import { isAdmin, isStudent } from "../lib/role";

export const useAuth = () => {
  const session = ref<AuthModel | null>(null);
  const isPending = ref<boolean>(true);
  const error = ref<string | null>(null);

  const initializeAuth = () => {
    isPending.value = true;
    error.value = null;

    try {
      const user = getUserLocal();
      session.value = user;
    } catch (err) {
      error.value =
        err instanceof Error ? err.message : "Erreur d'authentification";
      session.value = null;
    } finally {
      isPending.value = false;
    }
  };

  const user = computed(() => session.value);
  const isAuthenticated = computed(() => !!session.value);
  const isStudentUser = computed(() => isStudent(session.value?.roles));
  const isAdminUser = computed(() => isAdmin(session.value?.roles));

  onMounted(() => {
    initializeAuth();
  });

  return {
    session: readonly(session),
    isPending: readonly(isPending),
    error: readonly(error),

    user,
    isAuthenticated,
    isStudent: isStudentUser,
    isAdmin: isAdminUser,
    initializeAuth,
  };
};
