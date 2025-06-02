<script setup lang="ts">
import { Book } from "lucide-vue-next";
</script>

<template>
  <div
    class="relative flex min-h-screen w-full items-center justify-center overflow-hidden"
  >
    <div class="relative z-10 container mx-auto max-w-4xl px-4 md:px-6">
      <div
        class="mb-6 inline-flex items-center rounded-full bg-accent px-4 py-2 text-sm font-medium text-accent-foreground"
      >
        <Book class="mr-2 h-5 w-5" />
        <span>Université de Kinshasa</span>
      </div>

      <div class="max-w-4xl">
        <h1
          class="mb-6 text-4xl leading-tight font-bold tracking-tight sm:text-5xl md:text-6xl"
        >
          Faculté de polytechnique
        </h1>

        <p class="mb-8 max-w-2xl text-lg text-muted-foreground">
          La Faculté Polytechnique de l&#39;Université de Kinshasa (UNIKIN) est
          un pôle d&#39;excellence en ingénierie et en technologie, formant
          depuis des décennies les leaders de demain dans les domaines
          scientifiques et industriels...
        </p>

        <div class="flex flex-col gap-4 sm:flex-row">
          <Button
            class="rounded-md bg-primary px-8 py-6 text-lg font-medium text-white hover:bg-primary/80"
            asChild
          >
            <NuxtLink
              class="rounded-md bg-primary px-8 py-6 text-lg font-medium text-primary dark:text-gray-600 hover:bg-primary/80"
              href="/about"
              >En savoir plus</NuxtLink
            >
          </Button>

          <Button
            variant="outline"
            class="rounded-md px-8 py-6 text-lg font-medium"
            asChild
          >
            <NuxtLink href="/result">Mes résultats</NuxtLink>
          </Button>
        </div>
      </div>
    </div>
  </div>
</template>
