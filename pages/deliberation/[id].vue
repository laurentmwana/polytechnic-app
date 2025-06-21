<script setup lang="ts">
import { toast } from "vue-sonner";
import DeliberationDetail from "../../components/features/delibe/DeliberationDetail.vue";
import { getShowDelibe } from "../../services/other";
import type { DeliberationModel } from "../../types/model";

useHead({
  title: "En savoir plus sur un délibértion - Polytechnic Application",
});
definePageMeta({
  layout: "default",
});

const route = useRoute();

const delibeId = parseInt(route.params.id as string);

if (!delibeId || isNaN(delibeId)) {
  throw createError({
    statusCode: 400,
    statusMessage:
      "L'ID du délibértion est requis et doit être un nombre valide",
  });
}

const isPending = ref<boolean>(true);
const deliberation = ref<DeliberationModel>();

const fetchDepartment = async () => {
  try {
    if (!isPending.value) {
      isPending.value = true;
    }

    const response = await getShowDelibe(delibeId);
    const data = await response.json();

    if (response.ok) {
      deliberation.value = (data as { data: DeliberationModel }).data;
    } else {
      toast.error("Erreur", {
        description:
          (data as { message: string }).message || "Une erreur est survenue",
      });
    }
  } catch (error) {
    toast.error("Erreur", {
      description: `Impossible de récupèrer les départments`,
    });
  } finally {
    isPending.value = false;
  }
};

onMounted(() => {
  fetchDepartment();
});
</script>

<template>
  <div class="container my-12">
    <GoBack back="/deliberation" />
  </div>

  <div class="container my-12" v-if="isPending">
    <div class="section-page-header">
      <h2 class="section-page-title">
        En savoir plus sur le délibértion #{{ delibeId }}
      </h2>
    </div>

    <LoaderContainer :is-card="true" />
  </div>

  <div class="container my-12" v-if="deliberation && !isPending">
    <div class="section-page-header">
      <h2 class="section-page-title">
        En savoir plus sur le délibértion #{{ delibeId }}
      </h2>
    </div>

    <DeliberationDetail :isLoading="isPending" :deliberation="deliberation" />
  </div>
</template>
