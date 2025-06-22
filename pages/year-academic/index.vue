<script setup lang="ts">
import { ref, watch, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { toast } from "vue-sonner";

import YearCard from "@/components/features/year/YearCard.vue";
import { getCollectionYears } from "@/services/other";
import type { YearModel } from "@/types/model";
import type { PaginatedResponse } from "@/types/paginate";

useHead({
  title: "Années académiques - Polytechnic Application",
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
          (data as { message?: string }).message || "Une erreur est survenue lors du chargement.",
      });
    }
  } catch (error) {
    toast.error("Erreur", {
      description: "Impossible de récupérer les années académiques.",
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

onMounted(fetchYears);
</script>
<template>
  <div class="container my-12 space-y-8">
    <div class="section-page-header">
      <h2 class="section-page-title text-2xl md:text-3xl font-semibold text-primary">
        Années académiques
      </h2>
      <p class="text-muted-foreground mt-1">
        Liste des années académiques disponibles à la Faculté Polytechnique.
      </p>
    </div>

    <!-- Chargement -->
    <LoaderContainer v-if="isPending" :is-card="true" />

    <!-- Aucun résultat -->
    <div v-else-if="!years || years.data.length === 0" class="text-center text-muted-foreground py-10">
      Aucune année académique disponible pour le moment.
    </div>

    <!-- Résultat -->
    <div v-else>
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <YearCard v-for="year in years.data" :key="year.id" :year="year" />
      </div>

      <!-- Pagination -->
      <Pagination :onPage="onPage" :meta="years" class="mt-8" />
    </div>
  </div>
</template>
