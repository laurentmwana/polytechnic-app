<template>
  <div
    :class="isCard ? 'p-6' : ''"
    class="flex items-center justify-center py-8"
  >
    <div class="flex items-center space-x-3">
      <div
        class="animate-spin rounded-full h-4 w-4 border-2 border-gray-300 border-t-primary"
      ></div>
      <span class="text-gray-600 text-sm">{{ text }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  isCard?: boolean;
  text?: string;
}

withDefaults(defineProps<Props>(), {
  isCard: false,
  text: "Chargement...",
});
</script>
