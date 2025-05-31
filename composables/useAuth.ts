import { computed, onMounted, readonly, ref } from "vue";
import { getUserLocal } from "~/services/session";
import type { AuthModel } from "../types/model";

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
  const isStudent = computed(() => user.value?.roles.includes("student"));
  const isAdmin = computed(() => user.value?.roles.includes("admin"));

  onMounted(() => {
    initializeAuth();
  });

  return {
    session: readonly(session),
    isPending: readonly(isPending),
    error: readonly(error),

    // Computed
    user,
    isAuthenticated,
    isStudent,
    isAdmin,
    initializeAuth,
  };
};
