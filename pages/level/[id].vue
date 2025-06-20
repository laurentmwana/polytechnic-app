<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useRoute } from "vue-router";

import { createError } from "h3";
import { ago } from "@/lib/date-time";
import { getShowLevel } from "@/services/other";
import type { LevelModel } from "@/types/model";
import { CalendarDays } from "lucide-vue-next";
import { toast } from "vue-sonner";

useHead({
  title: "En savoir plus sur une promotion - Polytechnic Application",
});

definePageMeta({
  layout: "default",
});

const route = useRoute();
const levelId = parseInt(route.params.id as string, 10);

if (isNaN(levelId)) {
  throw createError({
    statusCode: 400,
    statusMessage:
      "L'ID d'une promotion est requis et doit être un nombre valide.",
  });
}

const isPending = ref(true);
const level = ref<LevelModel>();

const fetchLevel = async () => {
  try {
    if (!isPending.value) {
      isPending.value = true;
    }

    const response = await getShowLevel(levelId);
    const data = await response.json();

    if (response.ok) {
      level.value = (data as { data: LevelModel }).data;
    } else {
      toast.error("Erreur", {
        description:
          (data as { message?: string }).message || "Une erreur est survenue.",
      });
    }
  } catch (error) {
    toast.error("Erreur", {
      description: "Impossible de récupérer les données de la promotion.",
    });
  } finally {
    isPending.value = false;
  }
};

onMounted(fetchLevel);
</script>
<template>
  <div class="container my-12">
    <GoBack back="/level" />
  </div>

  <div class="container my-12" v-if="isPending">
    <div class="section-page-header">
      <h2 class="section-page-title">
        En savoir plus sur la promotion #{{ levelId }}
      </h2>
    </div>

    <LoaderContainer :is-card="true" />
  </div>

  <div class="container my-12" v-if="level">
    <div class="section-page-header">
      <h2 class="section-page-title">
        En savoir plus sur la promotion #{{ levelId }}
      </h2>
    </div>

    <div class="space-y-5">
      <Card class="border-t-2">
        <CardHeader>
          <CardTitle class="text-2xl md:text-3xl">
            {{ level.alias }}
          </CardTitle>
          <CardDescription class="text-base">
            {{ level.name }} {{ level.department.name ?? "" }}
          </CardDescription>
        </CardHeader>
        <CardFooter
          class="border-t pt-4 text-sm text-muted-foreground flex flex-wrap gap-4"
        >
          <div class="flex items-center gap-1">
            <CalendarDays class="h-4 w-4" />
            <span>Mis à jour : {{ ago(level.updated_at) }}</span>
          </div>
        </CardFooter>
      </Card>
    </div>
  </div>
</template>
