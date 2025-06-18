<script setup lang="ts">
import YearCard from "@/components/features/year/YearCard.vue";
import { getCollectionYears } from "@/services/other";
import type { YearModel } from "@/types/model";
import type { PaginatedResponse } from "@/types/paginate";
import { toast } from "vue-sonner";

useHead({
  title: "Les années académiques - Polytechnic Application",
});

definePageMeta({
  layout: "default",
});

type YearPaginateProps = PaginatedResponse<YearModel[]>;

const isPending = ref(true);
const years = ref<YearPaginateProps>();
const router = useRouter();
const route = useRoute();

const numberPage = ref(
  route.query.page ? parseInt(route.query.page as string) : 1
);

const fetchYears = async () => {
  try {
    isPending.value = true;
    const response = await getCollectionYears(numberPage.value);
    const data = await response.json();

    if (response.ok) {
      years.value = data as YearPaginateProps;
    } else {
      toast.error("Erreur", {
        description:
          (data as { message: string }).message || "Une erreur est survenue",
      });
    }
  } catch (error) {
    toast.error("Erreur", {
      description: "Impossible de récupèrer les années académiques",
    });
  } finally {
    isPending.value = false;
  }
};

const onPage = async (page: number) => {
  numberPage.value = page;
  await router.push(`/year-academic?page=${page}`);
  await fetchYears();
};

watch(
  () => route.query.page,
  (newPage) => {
    const pageNumber = newPage ? parseInt(newPage as string) : 1;
    if (pageNumber !== numberPage.value) {
      numberPage.value = pageNumber;
      fetchYears();
    }
  }
);

onMounted(() => {
  fetchYears();
});
</script>

<template>
  <div class="container my-12">
    <div class="section-page-header">
      <h2 class="section-page-title">Les années académiques</h2>
    </div>

    <LoaderContainer v-if="isPending" :is-card="true" />

    <div v-else-if="!years || years.data.length === 0">
      <p>Pas d'année académique</p>
    </div>

    <div v-else>
      <div
        class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 justify-center"
      >
        <YearCard v-for="year in years.data" :key="year.id" :year="year" />
      </div>

      <!-- Pagination -->
      <Pagination :onPage="onPage" :meta="years" />
    </div>
  </div>
</template>
