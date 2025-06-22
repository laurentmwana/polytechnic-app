<script setup lang="ts">
import { ref, onMounted } from "vue"
import { useRoute } from "vue-router"
import { createError } from "h3"
import { ago } from "@/lib/date-time"
import { getShowLevel } from "@/services/other"
import type { LevelModel } from "@/types/model"
import { CalendarDays } from "lucide-vue-next"
import { toast } from "vue-sonner"
import GoBack from "@/components/GoBack.vue"
import LoaderContainer from "@/components/LoaderContainer.vue"
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card"

useHead({
  title: "En savoir plus sur une promotion - Polytechnic Application",
})

definePageMeta({
  layout: "default",
})

const route = useRoute()
const levelId = parseInt(route.params.id as string, 10)

if (isNaN(levelId)) {
  throw createError({
    statusCode: 400,
    statusMessage:
      "L'ID d'une promotion est requis et doit être un nombre valide.",
  })
}

const isPending = ref(true)
const level = ref<LevelModel>()

const fetchLevel = async () => {
  try {
    isPending.value = true
    const response = await getShowLevel(levelId)
    const data = await response.json()

    if (response.ok) {
      level.value = (data as { data: LevelModel }).data
    } else {
      toast.error("Erreur", {
        description:
          (data as { message?: string }).message || "Une erreur est survenue.",
      })
    }
  } catch (error) {
    toast.error("Erreur", {
      description: "Impossible de récupérer les données de la promotion.",
    })
  } finally {
    isPending.value = false
  }
}

onMounted(fetchLevel)
</script>

<template>
  <div class="container my-12 space-y-8">
    <GoBack back="/level" />

    <div class="section-page-header">
      <h2 class="section-page-title">
        En savoir plus sur la promotion #{{ levelId }}
      </h2>
    </div>

    <!-- Chargement -->
    <LoaderContainer v-if="isPending" :is-card="true" />

    <!-- Contenu affiché -->
    <div v-else-if="level" class="space-y-5">
      <Card class="border bg-muted/50 dark:bg-muted/30">
        <CardHeader>
          <CardTitle class="text-2xl md:text-3xl text-blue-700 dark:text-blue-400">
            {{ level.alias }}
          </CardTitle>
          <CardDescription class="text-base text-muted-foreground">
            {{ level.name }} <span v-if="level.department">— {{ level.department.name }}</span>
          </CardDescription>
        </CardHeader>

        <CardFooter class="border-t pt-4 text-sm text-muted-foreground flex flex-wrap gap-4">
          <div class="flex items-center gap-1">
            <CalendarDays class="h-4 w-4" />
            <span>Mis à jour : {{ ago(level.updated_at) }}</span>
          </div>
        </CardFooter>
      </Card>
    </div>

    <!-- Aucun résultat trouvé -->
    <div v-else class="text-center text-muted-foreground py-8">
      Impossible d'afficher les données de cette promotion.
    </div>
  </div>
</template>
