<script setup lang="ts">
import { ref, onMounted, onUnmounted } from "vue";
import { Book } from "lucide-vue-next";

useHead({
  title: "Accueil - Polytechnic Application",
});

definePageMeta({
  layout: "base",
});

// État des éclairs
const lightnings = ref([]);
const animationFrame = ref(null);
const lastLightning = ref(0);

// Génération d'éclairs réalistes
const generateLightning = (
  startX: number,
  startY: number,
  endX: number,
  endY: number,
  branches = 3
) => {
  const segments = 15 + Math.floor(Math.random() * 10);
  let mainPath = `M${startX},${startY}`;
  const branchPaths = [];

  // Chemin principal
  for (let i = 1; i <= segments; i++) {
    const progress = i / segments;
    const baseX = startX + (endX - startX) * progress;
    const baseY = startY + (endY - startY) * progress;

    // Zigzag électrique
    const offsetX = (Math.random() - 0.5) * 80 * (1 - progress * 0.3);
    const offsetY = (Math.random() - 0.5) * 30;

    const x = baseX + offsetX;
    const y = baseY + offsetY;

    mainPath += `L${x},${y}`;

    // Créer des branches occasionnelles
    if (Math.random() < 0.3 && i > 3 && i < segments - 3) {
      const branchLength = 3 + Math.floor(Math.random() * 4);
      let branchPath = `M${x},${y}`;

      for (let j = 1; j <= branchLength; j++) {
        const branchProgress = j / branchLength;
        const branchX = x + (Math.random() - 0.5) * 60 * branchProgress;
        const branchY = y + (Math.random() - 0.5) * 40 * branchProgress;
        branchPath += `L${branchX},${branchY}`;
      }

      branchPaths.push(branchPath);
    }
  }

  return { mainPath, branchPaths };
};

// Animation des éclairs
const animateLightning = () => {
  const now = Date.now();

  // Nouvel éclair toutes les 2-5 secondes
  if (now - lastLightning.value > 2000 + Math.random() * 3000) {
    const lightning = generateLightning(
      100 + Math.random() * 200, // Start X
      50, // Start Y (haut)
      200 + Math.random() * 400, // End X
      500 + Math.random() * 100 // End Y (bas)
    );

    lightnings.value.push({
      id: now,
      ...lightning,
      opacity: 1,
      createdAt: now,
    });

    lastLightning.value = now;
  }

  // Supprimer les anciens éclairs
  lightnings.value = lightnings.value.filter((lightning) => {
    const age = now - lightning.createdAt;
    if (age > 500) return false;

    // Fade out
    lightning.opacity = Math.max(0, 1 - age / 500);
    return true;
  });

  animationFrame.value = requestAnimationFrame(animateLightning);
};

onMounted(() => {
  animateLightning();
});

onUnmounted(() => {
  if (animationFrame.value) {
    cancelAnimationFrame(animationFrame.value);
  }
});
</script>

<template>
  <div
    class="relative flex min-h-screen w-full items-center justify-center overflow-hidden"
  >
    <!-- Pylônes électriques en silhouette -->
    <div class="absolute inset-0 pointer-events-none">
      <!-- Pylône principal à droite -->
      <svg
        class="absolute right-20 top-10 w-24 h-80 opacity-10 dark:opacity-20"
        viewBox="0 0 100 300"
        fill="none"
      >
        <g fill="currentColor" class="text-slate-600 dark:text-slate-400">
          <!-- Structure principale -->
          <rect x="48" y="50" width="4" height="220" />

          <!-- Traverses -->
          <rect x="20" y="80" width="60" height="3" />
          <rect x="25" y="120" width="50" height="3" />
          <rect x="30" y="160" width="40" height="3" />

          <!-- Supports -->
          <polygon points="35,80 50,100 65,80 62,80 50,95 38,80" />
          <polygon points="40,120 50,135 60,120 58,120 50,130 42,120" />

          <!-- Isolateurs -->
          <circle cx="20" cy="82" r="2" />
          <circle cx="80" cy="82" r="2" />
          <circle cx="25" cy="122" r="2" />
          <circle cx="75" cy="122" r="2" />
        </g>
      </svg>

      <!-- Pylône secondaire à gauche -->
      <svg
        class="absolute left-32 bottom-20 w-16 h-60 opacity-8 dark:opacity-15"
        viewBox="0 0 100 300"
        fill="none"
      >
        <g fill="currentColor" class="text-slate-500 dark:text-slate-500">
          <rect x="48" y="100" width="6" height="180" />
          <rect x="30" y="130" width="40" height="2" />
          <rect x="35" y="170" width="30" height="2" />
          <circle cx="30" cy="131" r="1.5" />
          <circle cx="70" cy="131" r="1.5" />
        </g>
      </svg>

      <!-- Pylône distant au centre -->
      <svg
        class="absolute left-1/2 top-32 w-12 h-40 opacity-6 dark:opacity-10 transform -translate-x-1/2"
        viewBox="0 0 100 300"
        fill="none"
      >
        <g fill="currentColor" class="text-slate-400 dark:text-slate-600">
          <rect x="48" y="150" width="4" height="120" />
          <rect x="35" y="170" width="30" height="2" />
          <circle cx="35" cy="171" r="1" />
          <circle cx="65" cy="171" r="1" />
        </g>
      </svg>
    </div>

    <!-- Lignes électriques subtiles -->
    <div class="absolute inset-0 pointer-events-none">
      <svg
        class="w-full h-full opacity-5 dark:opacity-10"
        viewBox="0 0 800 600"
        preserveAspectRatio="none"
      >
        <!-- Lignes haute tension -->
        <path
          d="M0,150 Q200,160 400,150 Q600,140 800,150"
          stroke="currentColor"
          stroke-width="1"
          fill="none"
          class="text-slate-600"
        />
        <path
          d="M0,180 Q200,190 400,180 Q600,170 800,180"
          stroke="currentColor"
          stroke-width="1"
          fill="none"
          class="text-slate-600"
        />
        <path
          d="M0,210 Q200,220 400,210 Q600,200 800,210"
          stroke="currentColor"
          stroke-width="1"
          fill="none"
          class="text-slate-600"
        />

        <!-- Lignes de connexion verticales -->
        <line
          x1="150"
          y1="150"
          x2="150"
          y2="100"
          stroke="currentColor"
          stroke-width="0.5"
          class="text-slate-500"
        />
        <line
          x1="650"
          y1="150"
          x2="650"
          y2="80"
          stroke="currentColor"
          stroke-width="0.5"
          class="text-slate-500"
        />
      </svg>
    </div>

    <!-- Effet de particules énergétiques subtiles -->
    <div class="absolute inset-0 pointer-events-none">
      <div
        v-for="i in 8"
        :key="i"
        class="absolute w-1 h-1 bg-primary/30 rounded-full animate-pulse"
        :style="{
          left: `${20 + Math.random() * 60}%`,
          top: `${20 + Math.random() * 60}%`,
          animationDelay: `${Math.random() * 4}s`,
          animationDuration: `${3 + Math.random() * 2}s`,
        }"
      />
    </div>

    <!-- Contenu principal -->
    <div class="relative z-10 container mx-auto max-w-4xl px-4 md:px-6">
      <div
        class="mb-6 inline-flex items-center rounded-full bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border border-primary/50 dark:border-slate-600/50 px-4 py-2 text-sm font-medium text-slate-700 dark:text-slate-300 shadow-sm"
      >
        <Book class="mr-2 h-5 w-5 text-primary dark:text-primary" />
        <span>Université de Kinshasa</span>
      </div>

      <div class="max-w-4xl">
        <h1
          class="mb-6 text-4xl leading-tight font-bold tracking-tight sm:text-5xl md:text-6xl text-slate-900 dark:text-white"
        >
          <span
            class="bg-gradient-to-r from-primary via-indigo-600 to-purple-600 dark:from-primary dark:via-indigo-400 dark:to-purple-400 bg-clip-text text-transparent"
          >
            Génie électrique
          </span>
        </h1>

        <p
          class="mb-8 max-w-2xl text-lg text-slate-600 dark:text-slate-300 leading-relaxed"
        >
          Le génie électrique est une discipline qui conçoit, développe et
          optimise des systèmes liés à l’électricité. Il est au cœur des
          technologies modernes, de l’énergie à l’électronique.
        </p>

        <div class="flex flex-col gap-4 sm:flex-row">
          <NuxtLink
            href="/about"
            class="group relative overflow-hidden rounded-lg bg-gradient-to-r from-primary to-indigo-600 hover:from-primary hover:to-indigo-700 px-8 py-4 text-lg font-medium text-white transition-all duration-300 hover:shadow-lg hover:shadow-primary/25 hover:-translate-y-0.5"
          >
            <span class="relative z-10 flex items-center">
              En savoir plus
              <svg
                class="ml-2 w-4 h-4 transition-transform group-hover:translate-x-1"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M13 7l5 5m0 0l-5 5m5-5H6"
                />
              </svg>
            </span>
          </NuxtLink>

          <NuxtLink
            href="/result"
            class="group relative overflow-hidden rounded-lg border border-slate-300 dark:border-slate-600 bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm px-8 py-4 text-lg font-medium text-slate-700 dark:text-slate-300 transition-all duration-300 hover:border-primary dark:hover:border-primary hover:bg-white/80 dark:hover:bg-slate-700/80 hover:-translate-y-0.5"
          >
            <span class="relative z-10 flex items-center">
              Mes résultats
              <svg
                class="ml-2 w-4 h-4 transition-transform group-hover:translate-x-1"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                />
              </svg>
            </span>
          </NuxtLink>
        </div>
      </div>
    </div>

    <!-- Overlay subtil pour la profondeur -->
    <div
      class="absolute inset-0 bg-gradient-to-t from-white/20 via-transparent to-transparent dark:from-slate-900/20 pointer-events-none"
    ></div>
  </div>
</template>

<style scoped>
/* Animation douce pour les particules */
@keyframes float {
  0%,
  100% {
    transform: translateY(0px) translateX(0px);
  }
  25% {
    transform: translateY(-10px) translateX(5px);
  }
  50% {
    transform: translateY(-5px) translateX(-5px);
  }
  75% {
    transform: translateY(-15px) translateX(3px);
  }
}

.animate-float {
  animation: float 6s ease-in-out infinite;
}

.bg-gradient-radial {
  background: radial-gradient(circle at center, var(--tw-gradient-stops));
}

/* Animation personnalisée pour les éclairs */
@keyframes lightning-flash {
  0% {
    opacity: 0;
  }
  10% {
    opacity: 1;
  }
  20% {
    opacity: 0.3;
  }
  30% {
    opacity: 1;
  }
  100% {
    opacity: 0;
  }
}

.lightning-flash {
  animation: lightning-flash 0.5s ease-out;
}

/* Effet de scintillement électrique */
@keyframes electric-flicker {
  0%,
  100% {
    opacity: 0.2;
  }
  50% {
    opacity: 1;
  }
}

.electric-flicker {
  animation: electric-flicker 0.1s ease-in-out infinite;
}
</style>
