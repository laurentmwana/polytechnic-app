<script setup lang="ts">
useHead({
  title: "Mon dossier - Polytechnic Application",
});
definePageMeta({
  layout: "default",
  middleware: ['student']
});
</script>

<template>
  <div class="container my-12">
    <div class="section-page-header">
      <h2 class="section-page-title">
        Mon dossier
      </h2>
    </div>
  </div>
</template>
