<script setup lang="ts">
import { ref, onMounted, watch } from "vue";
import { useRoute, useRouter } from "vue-router";

import OptionCard from "@/components/features/option/OptionCard.vue";
import { getCollectionOptions } from "@/services/other";
import type { OptionModel } from "@/types/model";
import type { PaginatedResponse } from "@/types/paginate";
import { toast } from "vue-sonner";

useHead({
  title: "Nos options - Polytechnic Application",
});

definePageMeta({
  layout: "default",
});

type OptionPaginateProps = PaginatedResponse<OptionModel[]>;

const isPending = ref(true);
const options = ref<OptionPaginateProps>();

const router = useRouter();
const route = useRoute();

const numberPage = ref(
  route.query.page ? parseInt(route.query.page as string, 10) : 1
);

const fetchOptions = async () => {
  try {
    isPending.value = true;

    const response = await getCollectionOptions(numberPage.value);
    const data = await response.json();

    if (response.ok) {
      options.value = data as OptionPaginateProps;
    } else {
      toast.error("Erreur", {
        description:
          (data as { message?: string }).message || "Une erreur est survenue.",
      });
    }
  } catch (error) {
    toast.error("Erreur", {
      description: "Impossible de récupérer les options.",
    });
  } finally {
    isPending.value = false;
  }
};

const onPage = async (page: number) => {
  if (page === numberPage.value) return;
  numberPage.value = page;
  await router.push({ path: "/option", query: { page } });
  await fetchOptions();
};

watch(
  () => route.query.page,
  (newPage) => {
    const pageNumber = newPage ? parseInt(newPage as string, 10) : 1;
    if (pageNumber !== numberPage.value) {
      numberPage.value = pageNumber;
      fetchOptions();
    }
  }
);

onMounted(fetchOptions);
</script>
<template>
  <div class="container my-12" v-if="isPending">
    <div class="section-page-header">
      <h2 class="section-page-title">Nos options</h2>
    </div>
    <LoaderContainer :is-card="true" />
  </div>

  <div
    class="container my-12"
    v-if="(!options || (options && options.data.length === 0)) && !isPending"
  >
    <div class="section-page-header">
      <h2 class="section-page-title">Nos options</h2>
    </div>
    <p>Pas d'options disponibles pour le moment.</p>
  </div>

  <div class="container my-12" v-if="options && options.data.length > 0">
    <div class="section-page-header">
      <h2 class="section-page-title">Nos options</h2>
    </div>

    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      <OptionCard
        v-for="option in options.data"
        :key="option.id"
        :option="option"
      />
    </div>

    <Pagination :onPage="onPage" :meta="options" />
  </div>
</template>
