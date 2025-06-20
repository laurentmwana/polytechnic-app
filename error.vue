<script setup lang="ts">
import type { NuxtError } from "#app";
const props = defineProps({
  error: Object as () => NuxtError,
});
</script>

<template>
  <div
    class="min-h-screen flex flex-col items-center justify-center bg-background text-foreground px-4"
  >
    <div class="text-center max-w-xl space-y-4">
      <h1 class="text-5xl font-bold tracking-tight text-primary">
        {{ props.error.statusCode }}
      </h1>
      <p class="text-base text-muted-foreground">
        {{ props.error.statusMessage || "Oups ! Une erreur est survenue." }}
      </p>
      <Button variant="outline" as-child>
        <NuxtLink to="/"> ⬅️ Retour à l’accueil </NuxtLink>
      </Button>
    </div>
  </div>
</template>
