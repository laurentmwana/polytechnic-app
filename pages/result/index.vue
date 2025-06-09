<script setup lang="ts">
useHead({
  title: "Mes résultats - Polytechnic Application",
});
definePageMeta({
  layout: "default",
  middleware: ['student']
});
</script>

<template>
  <div class="container my-12">
    <div class="section-page-header">
      <h2 class="section-page-title">Mes résultats</h2>
    </div>
  </div>
</template>
