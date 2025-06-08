<script setup lang="ts">
import Faq from "@/components/features/welcome/Faq.vue";
import HeroWelcome from "@/components/features/welcome/HeroWelcome.vue";
import AdnWelcome from "../components/features/welcome/AdnWelcome.vue";
import DeliberationWelcome from "../components/features/welcome/DeliberationWelcome.vue";
import DepartmentWelcome from "../components/features/welcome/DepartmentWelcome.vue";
import OptionWelcome from "../components/features/welcome/OptionWelcome.vue";
import PresentationWelcome from "../components/features/welcome/PresentationWelcome.vue";
import YearAcademicWelcome from "../components/features/welcome/YearAcademicWelcome.vue";

useHead({
  title: "Accueil - Polytechnic Application",
});
</script>

<template>
  <HeroWelcome />
  <AdnWelcome />
  <PresentationWelcome />
  <DeliberationWelcome />
  <YearAcademicWelcome />
  <DepartmentWelcome />
  <OptionWelcome />
  <Faq />
</template>
