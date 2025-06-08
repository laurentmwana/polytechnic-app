<script setup lang="ts">
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
        <div class="flex items-center space-x-2">
          <div
            class="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"
          ></div>
          <span class="text-muted-foreground">Chargement...</span>
        </div>
      </div>
    </div>
  </div>
  <div class="flex items-center justify-center py-8" v-else>
    <div class="flex items-center space-x-2">
      <div class="flex items-center space-x-2">
        <div
          class="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"
        ></div>
        <span class="text-muted-foreground">Chargement...</span>
      </div>
    </div>
  </div>
</template>
