<script setup lang="ts">
import { getCurrentYear } from "@/services/other";
import type { YearModel } from "@/types/model";
import { toast } from "vue-sonner";
import YearDetails from "../year/YearDetails.vue";
import YearLoader from "../year/YearLoader.vue";

const isPending = ref<boolean>(true);
const year = ref<YearModel | null>(null);

const fetchYear = async () => {
  try {
    isPending.value = true;

    const response = await getCurrentYear();
    const data = await response.json();

    if (response.ok) {
      year.value = (data as { data: YearModel | null }).data;
    } else {
      toast.error("Erreur", {
        description:
          (data as { message: string }).message || "Une erreur est survenue",
      });
    }
  } catch (error) {
    toast.error("Erreur", {
      description: `Impossible de récupèrer l'année académique en cours`,
    });
  } finally {
    isPending.value = false;
  }
};

onMounted(() => {
  fetchYear();
});
</script>

<template>
  <div class="container my-12" v-if="isPending">
    <YearLoader />
  </div>
  <div class="container my-12" v-if="year !== null">
    <div class="section-header">
      <h2 class="section-title">Année académique</h2>
      <p class="section-subtitle">
        Une nouvelle année académique, une nouvelle aventure d’apprentissage et
        de découvertes. Ensemble, construisons votre avenir, un semestre à la
        fois.
      </p>
    </div>
    <YearDetails :year="year" />
  </div>
</template>
