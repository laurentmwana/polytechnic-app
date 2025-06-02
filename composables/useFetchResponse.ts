import { ref } from "vue";

export function useFetchResponse(fetchFunction: () => Promise<Response>) {
  const response = ref<Response | null>(null);
  const error = ref<Error | null>(null);
  const isLoading = ref(false);

  const execute = async () => {
    isLoading.value = true;
    error.value = null;
    try {
      const res = await fetchFunction();
      response.value = res;
    } catch (err: any) {
      error.value = err;
    } finally {
      isLoading.value = false;
    }
  };

  return {
    response,
    error,
    isLoading,
    execute,
  };
}
