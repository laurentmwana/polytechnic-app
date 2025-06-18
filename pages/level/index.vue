<script setup lang="ts">
import { ref, watch, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";

import { createError } from "h3";

import { getCollectionLevels } from "@/services/other";
import type { LevelModel } from "@/types/model";
import type { PaginatedResponse } from "@/types/paginate";
import LevelCard from "@/components/features/level/LevelCard.vue";
import { toast } from "vue-sonner";

useHead({
  title: "Nos promotions - Polytechnic Application",
});

definePageMeta({
  layout: "default",
});

type LevelPaginateProps = PaginatedResponse<LevelModel[]>;

const isPending = ref(true);
const levels = ref<LevelPaginateProps>();
const router = useRouter();
const route = useRoute();

const numberPage = ref(
  route.query.page ? parseInt(route.query.page as string, 10) : 1
);

const fetchLevels = async () => {
  try {
    isPending.value = true;

    const response = await getCollectionLevels(numberPage.value);
    const data = await response.json();

    if (response.ok) {
      levels.value = data as LevelPaginateProps;
    } else {
      toast.error("Erreur", {
        description:
          (data as { message?: string }).message || "Une erreur est survenue.",
      });
    }
  } catch (error) {
    toast.error("Erreur", {
      description: "Impossible de récupérer les promotions.",
    });
  } finally {
    isPending.value = false;
  }
};

const onPage = async (page: number) => {
  numberPage.value = page;
  await router.push(`/level?page=${page}`);
  await fetchLevels();
};

watch(
  () => route.query.page,
  (newPage) => {
    const pageNumber = newPage ? parseInt(newPage as string, 10) : 1;
    if (pageNumber !== numberPage.value) {
      numberPage.value = pageNumber;
      fetchLevels();
    }
  }
);

onMounted(fetchLevels);
</script>
<template>
  <div class="container my-12" v-if="isPending">
    <div class="section-page-header">
      <h2 class="section-page-title">Les promotions</h2>
    </div>

    <LoaderContainer :is-card="true" />
  </div>

  <div
    class="container my-12"
    v-if="(!levels || (levels && levels.data.length === 0)) && !isPending"
  >
    <div class="section-page-header">
      <h2 class="section-page-title">Les promotions</h2>
    </div>

    <p>Pas de promotion</p>
  </div>

  <div class="container my-12" v-if="levels">
    <div class="section-page-header">
      <h2 class="section-page-title">Nos promotions</h2>
    </div>

    <div
      class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 justify-center"
    >
      <LevelCard v-for="level in levels.data" :key="level.id" :level="level" />
    </div>

    <Pagination :onPage="onPage" :meta="levels" />
  </div>
</template>
