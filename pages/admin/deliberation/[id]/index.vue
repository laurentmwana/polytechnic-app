<script setup lang="ts">
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/composables/useAuth";
import { ago } from "@/lib/date-time";
import { getItemDeliberation } from "@/services/deliberation";
import type { DeliberationModel } from "@/types/model";
import { Calendar, MapPin, User, UserCheck } from "lucide-vue-next";
import { toast } from "vue-sonner";

useHead({
  title: "Détails délibération - Polytechnic Application",
});

definePageMeta({
  layout: "admin",
  middleware: ["admin", "verified"],
});

interface ModelDataResponse {
  data: DeliberationModel;
}

const auth = useAuth();
const route = useRoute();

const deliberation = ref<DeliberationModel | null>(null);
const isLoading = ref(true);

const delibeId = parseInt(route.params.id as string);

if (!delibeId || isNaN(delibeId)) {
  throw createError({
    statusCode: 400,
    statusMessage:
      "L'ID de la délibération est requis et doit être un nombre valide",
  });
}

const fetchDeliberation = async () => {
  try {
    isLoading.value = true;

    if (!auth.session.value?.accessToken) {
      throw new Error("Utilisateur non authentifié");
    }

    const response = await getItemDeliberation(
      auth.session.value.accessToken,
      delibeId
    );
    const data = await response.json();

    if (response.ok) {
      deliberation.value = (data as ModelDataResponse).data;
    } else if (response.status === 401) {
      toast.warning("Session expirée", {
        description: "Votre session a expiré, merci de vous reconnecter",
      });
      auth.logout();
    } else {
      toast.error("Erreur", {
        description:
          (data as { message: string }).message || "Une erreur est survenue",
      });
    }
  } catch {
    toast.error("Erreur", {
      description: "Impossible de charger la délibération",
    });
  } finally {
    isLoading.value = false;
  }
};

onMounted(() => {
  fetchDeliberation();
});
</script>

<template>
  <div class="space-y-6">
    <!-- Bouton retour -->
    <GoBack back="/admin/deliberation" />

    <!-- Loader -->
    <LoaderContainer v-if="isLoading" :isCard="true" />

    <!-- Délibération non trouvée -->
    <Card v-else-if="!deliberation">
      <CardContent class="text-center py-12">
        <User class="h-12 w-12 mx-auto text-muted-foreground mb-4" />
        <p class="text-lg font-medium mb-2">Délibération non trouvée</p>
        <p class="text-muted-foreground">
          La délibération avec l'ID {{ delibeId }} n'existe pas.
        </p>
      </CardContent>
    </Card>

    <!-- Détails de la délibération -->
    <div v-else class="grid gap-6 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle class="flex items-center gap-2">
            <User class="h-5 w-5" />
            Informations sur la délibération #{{ delibeId }}
          </CardTitle>
        </CardHeader>
        <CardContent class="space-y-4">
          <div class="grid gap-4">
            <div class="flex items-center gap-3">
              <MapPin class="h-4 w-4 text-muted-foreground" />
              <div>
                <p class="text-sm font-medium">Promotion</p>
                <p class="text-sm text-muted-foreground">
                  {{ deliberation.level.name }} {{ deliberation.level.department?.name ?? "" }}
                </p>
              </div>
            </div>

            <div class="flex items-center gap-3">
              <Calendar class="h-4 w-4 text-muted-foreground" />
              <div>
                <p class="text-sm font-medium">Semestre</p>
                <p class="text-sm text-muted-foreground">
                  {{ deliberation.semester }}
                </p>
              </div>
            </div>

            <div class="flex items-center gap-3">
              <Calendar class="h-4 w-4 text-muted-foreground" />
              <div>
                <p class="text-sm font-medium">Début</p>
                <p class="text-sm text-muted-foreground">
                  {{ deliberation.start_at }}
                </p>
              </div>
            </div>

            <div class="flex items-center gap-3">
              <UserCheck class="h-4 w-4 text-muted-foreground" />
              <div>
                <p class="text-sm font-medium">Année académique</p>
                <p class="text-sm text-muted-foreground">
                  {{ deliberation.year.name }}
                </p>
              </div>
            </div>

            <div class="flex items-center gap-3">
              <Calendar class="h-4 w-4 text-muted-foreground" />
              <div>
                <p class="text-sm font-medium">Créé le</p>
                <p class="text-sm text-muted-foreground">
                  {{ ago(deliberation.created_at) }}
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  </div>
</template>
