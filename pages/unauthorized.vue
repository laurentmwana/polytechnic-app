<script setup lang="ts">
definePageMeta({
  layout: "error",
});
</script>

<template>
  <section class="max-w-xl mx-auto p-6 text-center">
    <h1 class="text-4xl font-bold text-red-600 mb-4">Accès refusé</h1>
    <p class="text-muted-foreground mb-6">
      Vous n'avez pas les droits nécessaires pour accéder à cette page. Si vous
      pensez que c'est une erreur, veuillez contacter l'administrateur.
    </p>
    <div class="space-y-4">
      <Button asChild>
        <NuxtLink to="/">Retour à l'accueil</NuxtLink>
      </Button>
      <div class="text-sm text-muted-foregrounds">
        Ou essayez de naviguer vers une autre page.
      </div>
    </div>
  </section>
</template>
