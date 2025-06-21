<script setup lang="ts">
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/composables/useAuth";
import { ago } from "@/lib/date-time";
import { getItemLevel } from "@/services/level";
import type { LevelModel } from "@/types/model";
import { Calendar, Layers3, Tag, Type } from "lucide-vue-next";
import { toast } from "vue-sonner";

useHead({
  title: "Détails promotion - Polytechnic Application",
});

definePageMeta({
  layout: "admin",
  middleware: ["admin", "verified"],
});

interface ModelDataResponse {
  data: LevelModel;
}

const auth = useAuth();
const route = useRoute();

const level = ref<LevelModel | null>(null);
const isLoading = ref(true);

const levelId = parseInt(route.params.id as string);

if (!levelId || isNaN(levelId)) {
  throw createError({
    statusCode: 400,
    statusMessage: "L'ID de la promotion est requis et doit être un nombre valide",
  });
}

const fetchLevel = async () => {
  try {
    isLoading.value = true;

    if (!auth.session.value?.accessToken) {
      throw new Error("Utilisateur non authentifié");
    }

    const response = await getItemLevel(auth.session.value.accessToken, levelId);
    const data = await response.json();

    if (response.ok) {
      level.value = (data as ModelDataResponse).data;
    } else if (response.status === 401) {
      toast.warning("Session expirée", {
        description: "Merci de vous reconnecter.",
      });
      auth.logout();
    } else {
      toast.error("Erreur", {
        description: (data as { message: string }).message || "Une erreur est survenue.",
      });
    }
  } catch {
    toast.error("Erreur", {
      description: "Impossible de charger les informations de la promotion.",
    });
  } finally {
    isLoading.value = false;
  }
};

onMounted(fetchLevel);
</script>

<template>
  <div class="space-y-6">
    <GoBack back="/admin/level" />

    <LoaderContainer v-if="isLoading" :isCard="true" />

    <Card v-else-if="!level">
      <CardContent class="text-center py-12">
        <Type class="h-12 w-12 mx-auto text-muted-foreground mb-4" />
        <p class="text-lg font-medium mb-2">Promotion non trouvée</p>
        <p class="text-muted-foreground">
          La promotion avec l'ID {{ levelId }} n'existe pas.
        </p>
      </CardContent>
    </Card>

    <div v-else class="grid gap-6 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle class="flex items-center gap-2">
            <Layers3 class="h-5 w-5" />
            Informations de la promotion
          </CardTitle>
        </CardHeader>
        <CardContent class="space-y-4">
          <div class="grid gap-4">
            <div class="flex items-center gap-3">
              <Type class="h-4 w-4 text-muted-foreground" />
              <div>
                <p class="text-sm font-medium">Nom</p>
                <p class="text-sm text-muted-foreground">{{ level.name }}</p>
              </div>
            </div>

            <div class="flex items-center gap-3">
              <Tag class="h-4 w-4 text-muted-foreground" />
              <div>
                <p class="text-sm font-medium">Alias</p>
                <p class="text-sm text-muted-foreground">{{ level.alias }}</p>
              </div>
            </div>

            <div class="flex items-center gap-3" v-if="level.department">
              <Layers3 class="h-4 w-4 text-muted-foreground" />
              <div>
                <p class="text-sm font-medium">Département</p>
                <p class="text-sm text-muted-foreground">{{ level.department.name }}</p>
              </div>
            </div>

            <div class="flex items-center gap-3">
              <Calendar class="h-4 w-4 text-muted-foreground" />
              <div>
                <p class="text-sm font-medium">Créé le</p>
                <p class="text-sm text-muted-foreground">
                  {{ ago(level.created_at) }}
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  </div>
</template>
