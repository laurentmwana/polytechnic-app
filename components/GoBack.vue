<script setup lang="ts">
import { ArrowLeft } from "lucide-vue-next";

const props = defineProps<{ 
  back: string;
  label?: string;
}>();
</script>

<template>
  <div class="mb-8">
    <NuxtLink 
      :to="props.back" 
      class="inline-flex items-center gap-2 px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors rounded-md hover:bg-muted"
    >
      <ArrowLeft class="h-4 w-4" />
      {{ props.label || 'Retour en arrière' }}
    </NuxtLink>
  </div>
</template>