<script setup lang="ts">
useHead({
  title: "À propos - Polytechnic Application",
});

definePageMeta({
  layouts: ["default"],
});
</script>

<template>
  <div class="container py-12" id="container-about">
    <div class="relative mt-12">
      <!-- Effets visuels de fond -->
      <div
        class="absolute -z-10 top-0 right-0 w-48 md:w-72 h-48 md:h-72 bg-primary/5 dark:bg-accent/30 rounded-full blur-3xl"
      ></div>
      <div
        class="absolute -z-10 bottom-0 left-0 w-64 md:w-96 h-64 md:h-96 bg-primary/5 dark:bg-accent/30 rounded-full blur-3xl"
      ></div>

      <div class="grid lg:grid-cols-2 gap-12 items-center">
        <!-- Texte de présentation -->
        <div class="order-2 lg:order-1">
          <div class="space-y-6 text-muted-foreground">
            <p class="leading-relaxed">
              Depuis sa création en 1955, la
              <span class="text-primary font-medium">
                Faculté Polytechnique de l’Université de Kinshasa
              </span>
              s’impose comme un pilier de l’enseignement supérieur en République
              Démocratique du Congo. Initialement rattachée à la Faculté des
              Sciences, elle est devenue une entité autonome en 1960, avec pour
              vocation première de former des ingénieurs civils capables de
              répondre aux enjeux techniques, économiques et sociétaux du pays.
            </p>
            <p class="leading-relaxed">
              Forte d’une longue tradition d’excellence, la Faculté demeure
              aujourd’hui la référence nationale en matière de formation
              d’ingénieurs de haut niveau, engagés dans le développement durable
              et l’innovation technologique.
            </p>
            <blockquote
              class="pl-4 border-l-4 border-primary/70 italic my-6 text-slate-600 dark:text-slate-400"
            >
              « Former les ingénieurs qui construiront l’avenir de la République
              Démocratique du Congo. »
            </blockquote>
            <p class="leading-relaxed">
              Notre mission est de fournir une formation rigoureuse, alliant
              théorie et pratique, afin de préparer les étudiants à relever les
              défis complexes de l’ingénierie moderne. Nous encourageons
              également la recherche appliquée et la collaboration avec les
              industries locales et internationales.
            </p>
            <p class="leading-relaxed">
              En rejoignant la Faculté Polytechnique, vous intégrez une
              communauté dynamique, tournée vers l’avenir et soucieuse de
              contribuer activement au progrès de la RDC.
            </p>
          </div>
        </div>

        <!-- Image et éléments graphiques -->
        <div class="order-1 lg:order-2">
          <div class="relative">
            <div
              class="rounded-lg overflow-hidden shadow-xl dark:shadow-gray-900/30 border border-gray-200 dark:border-gray-800"
            >
              <NuxtImg
                src="/images/home.jpg"
                width="800"
                height="530"
                alt="Faculté Polytechnique de l’Université de Kinshasa"
                class="object-cover w-full h-auto"
              />
            </div>

            <div class="relative overflow-hidden">
              <div
                class="absolute bottom-0 right-0 translate-x-6 translate-y-6 w-64 h-64 -z-10"
              >
                <svg
                  width="100%"
                  height="100%"
                  viewBox="0 0 100 100"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  class="text-primary/20 dark:text-primary/10 pointer-events-none"
                >
                  <pattern
                    id="smallGrid"
                    width="8"
                    height="8"
                    patternUnits="userSpaceOnUse"
                  >
                    <path
                      d="M 8 0 L 0 0 0 8"
                      fill="none"
                      stroke="currentColor"
                      stroke-width="0.5"
                    />
                  </pattern>
                  <rect width="100" height="100" fill="url(#smallGrid)" />
                </svg>
              </div>
            </div>

            <div
              class="absolute -top-4 -left-4 bg-primary text-white rounded-full h-16 w-16 flex items-center justify-center shadow-lg"
            >
              <div class="text-center">
                <div class="text-xs font-medium">Depuis</div>
                <div class="text-xl font-bold">1955</div>
              </div>
            </div>
          </div>
        </div>
        <!-- Fin image -->
      </div>
    </div>
  </div>
</template>
