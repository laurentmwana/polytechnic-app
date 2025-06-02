<script setup lang="ts">
import { Loader2 } from "lucide-vue-next";

const props = withDefaults(defineProps<{ isCard?: boolean }>(), {
  isCard: false,
});
</script>

<template>
  <div
    v-if="props.isCard"
    class="bg-card text-card-foreground flex flex-col gap-6 rounded-xl border py-6 shadow-sm"
  >
    <div class="flex items-center justify-center py-8">
      <div class="flex items-center space-x-2">
        <Loader2 class="h-4 w-4 animate-spin" />
        <span class="text-sm text-muted-foreground">Chargement...</span>
      </div>
    </div>
  </div>
  <div class="flex items-center justify-center py-8" v-else>
    <div class="flex items-center space-x-2">
      <Loader2 class="h-4 w-4 animate-spin" />
      <span class="text-sm text-muted-foreground">Chargement...</span>
    </div>
  </div>
</template>
