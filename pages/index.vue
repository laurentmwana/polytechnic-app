<script setup lang="ts">
import Faq from "@/components/features/welcome/Faq.vue";
import HeroWelcome from "@/components/features/welcome/HeroWelcome.vue";

useHead({
  title: "Accueil - Polytechnic Application",
});
</script>

<template>
  <HeroWelcome />
  <Faq />
</template>
