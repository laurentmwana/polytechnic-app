<script setup lang="ts">
import { getOptionLimit } from "@/services/other";
import type { OptionModel } from "@/types/model";
import { toast } from "vue-sonner";
import OptionCard from "../option/OptionCard.vue";
import OptionLoader from "../option/OptionLoader.vue";

const isPending = ref<boolean>(true);
const options = ref<OptionModel[]>([]);

const fetchOptions = async () => {
  try {
    isPending.value = true;

    const response = await getOptionLimit(6);
    const data = await response.json();

    if (response.ok) {
      options.value = (data as { data: OptionModel[] }).data;
    } else {
      options.value = [];
    }
  } catch (error) {
    toast.error("Erreur", {
      description: `Impossible de récupèrer les options`,
    });
  } finally {
    isPending.value = false;
  }
};

onMounted(async () => {
  await fetchOptions();
});
</script>

<template>
  <div class="container my-12" v-if="isPending.value">
    <OptionLoader />
  </div>
  <div class="container my-12" v-else>
    <div class="section-header">
      <h2 class="section-title">Nos Filières</h2>
      <p class="section-subtitle">
        De la formation technique aux filières scientifiques et sociales, nous
        offrons un large éventail de parcours adaptés aux besoins du marché et
        aux aspirations des étudiants.
      </p>
    </div>

    <div
      class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 justify-center"
    >
      <OptionCard v-for="option in options" :option="option" :key="option.id" />
    </div>
  </div>
</template>
