<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useRoute } from "vue-router";
import { createError } from "h3";
import { toast } from "vue-sonner";

import { getShowYear } from "@/services/other";
import type { YearModel } from "@/types/model";
import YearDetails from "@/components/features/year/YearDetails.vue";
import GoBack from "@/components/GoBack.vue";

useHead({
  title: "En savoir plus sur une année académique - Polytechnic Application",
});

definePageMeta({
  layout: "default",
});

const route = useRoute();
const yearId = parseInt(route.params.id as string);

if (!yearId || isNaN(yearId)) {
  throw createError({
    statusCode: 400,
    statusMessage:
      "L'ID d'une année académique est requis et doit être un nombre valide",
  });
}

const isPending = ref(true);
const year = ref<YearModel | null>(null);

const fetchYear = async () => {
  isPending.value = true;
  try {
    const response = await getShowYear(yearId);
    const data = await response.json();

    if (response.ok) {
      year.value = (data as { data: YearModel }).data;
    } else {
      toast.error("Erreur", {
        description:
          (data as { message?: string }).message || "Une erreur est survenue",
      });
    }
  } catch (error) {
    toast.error("Erreur", {
      description: `Impossible de récupérer l'année académique #${yearId}.`,
    });
  } finally {
    isPending.value = false;
  }
};

onMounted(fetchYear);
</script>

<template>
  <div class="container my-12">
    <GoBack back="/year-academic" />

    <div class="section-page-header">
      <h2 class="section-page-title">
        En savoir plus sur l’année académique #{{ yearId }}
      </h2>
    </div>

    <LoaderContainer v-if="isPending" :is-card="true" />

    <template v-else>
      <YearDetails v-if="year" :year="year" />
      <p v-else class="text-center text-gray-500 py-8">
        Aucune donnée trouvée pour cette année académique.
      </p>
    </template>
  </div>
</template>
