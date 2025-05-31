import type { AuthModel } from "@/types/model";
import { computed, onMounted, readonly, ref } from "vue";
import { getUserLocal } from "~/services/session";
import { isAdmin, isStudent } from "../lib/role";

export const useAuth = () => {
  const session = ref<AuthModel | null>(null);
  const isPending = ref(false);
  const error = ref<string | null>(null);

  const initializeAuth = () => {
    try {
      isPending.value = true;
      error.value = null;

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

  const user = computed(() => session.value || null);
  const isAuthenticated = computed(() => !!session.value && !!user.value);
  const isUserStudent = computed(() => isStudent(user.value?.roles));
  const isUserAdmin = computed(() => isAdmin(user.value?.roles));

  onMounted(() => {
    initializeAuth();
  });

  return {
    session: readonly(session),
    isPending: readonly(isPending),
    error: readonly(error),

    user,
    isAuthenticated,
    isStudent: isUserStudent,
    isAdmin: isUserAdmin,
    initializeAuth,
  };
};
