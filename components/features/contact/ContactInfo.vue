<script setup lang="ts">
import { Phone } from "lucide-vue-next";
</script>

<template>
  <div class="space-y-4">
    <div class="container-card">
      <h2 class="mb-1 text-base font-semibold text-gray-700 dark:text-gray-100">
        Notre adresse
      </h2>
      <p class="text-description mb-2">
        Nous sommes sur l&#39;avenue Mbanza boma 38 bandalungwa Centre Likemo
      </p>
      <p class="text-description">
        [foyer social de bandalungwa ref: Ecole AngoAngo, Pima bar , Banque de
        sang].
      </p>
    </div>
    <div class="container-card">
      <h2 class="mb-1 text-base font-semibold text-gray-700 dark:text-gray-100">
        Nos coordonnées
      </h2>
      <p class="text-description mb-2 flex items-center gap-2">
        <Phone :size="15" />
        <span>+243829760292</span>
      </p>
      <p class="text-description mb-2 flex items-center gap-2">
        <Phone :size="15" />
        <span>+243810061785</span>
      </p>
    </div>
  </div>
</template>
