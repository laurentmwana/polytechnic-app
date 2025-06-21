<script setup lang="ts">
import { ArrowLeft } from "lucide-vue-next";
const props = defineProps<{ back: string }>();
</script>

<template>
  <div class="flex items-center gap-4 mb-8">
    <Button class="h-full cursor-pointer" variant="outline" size="sm">
      <NuxtLink :to="props.back" class="flex items-center gap-2">
        <ArrowLeft class="h-4 w-4 mr-2" />
        Retour en arrière
      </NuxtLink>
    </Button>
  </div>
</template>
