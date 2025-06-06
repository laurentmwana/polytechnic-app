<script setup lang="ts">
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useAuth } from "@/composables/useAuth";
import { ago } from "@/lib/date-time";
import { getItemYear } from "@/services/year";
import type { YearModel } from "@/types/model";
import { Calendar, Clock10, Clock11, Lock, Mail, User } from "lucide-vue-next";
import { toast } from "vue-sonner";

useHead({
  title: "Détails année académique - Polytechnic Application",
});

definePageMeta({
  layout: "admin",
  middleware: ["admin"],
});

interface ModelDataResponse {
  data: YearModel;
}

const auth = useAuth();
const route = useRoute();

const year = ref<YearModel | null>(null);
const isLoading = ref<boolean>(true);

const yearId = parseInt(route.params.id as string);

if (!yearId || isNaN(yearId)) {
  throw createError({
    statusCode: 400,
    statusMessage:
      "L'ID de l'année académique est requis et doit être un nombre valide",
  });
}

const fetchYear = async () => {
  try {
    isLoading.value = true;

    if (!auth.session.value?.accessToken) {
      throw new Error("année académique non authentifié");
    }

    const response = await getItemYear(auth.session.value.accessToken, yearId);
    const data = await response.json();

    if (response.ok) {
      year.value = (data as ModelDataResponse).data;
    } else if (response.status == 401) {
      toast.warning("Session", {
        description: "Votre session a expiré, merci de vous reconnecter",
      });
      auth.logout();
    } else {
      toast.error("Erreur", {
        description:
          (data as { message: string }).message || "Une erreur est survenue",
      });
    }
  } catch (error) {
    toast.error("Erreur", {
      description: "Impossible de charger l'année académique",
    });
  } finally {
    isLoading.value = false;
  }
};

onMounted(async () => {
  await fetchYear();
});
</script>

<template>
  <div class="space-y-6">
    <!-- Header avec bouton retour -->
    <GoBack back="/admin/year-academic" />

    <!-- Loader -->
    <LoaderContainer v-if="isLoading" :isCard="true" />

    <!-- année académique non trouvé -->
    <Card v-else-if="!year">
      <CardContent class="text-center py-12">
        <User class="h-12 w-12 mx-auto text-muted-foreground mb-4" />
        <p class="text-lg font-medium mb-2">année académique non trouvé</p>
        <p class="text-muted-foreground">
          L'année académique avec l'ID {{ yearId }} n'existe pas.
        </p>
      </CardContent>
    </Card>

    <!-- Détails de l'année académique -->
    <div v-else class="grid gap-6 md:grid-cols-2">
      <!-- Informations principales -->
      <Card>
        <CardHeader>
          <CardTitle class="flex items-center gap-2">
            <User class="h-5 w-5" />
            Informations sur l'année académique #{{ year.id }}
          </CardTitle>
          <CardDescription>
            Détails de l'année académique {{ year.name }}
          </CardDescription>
        </CardHeader>
        <CardContent class="space-y-4">
          <div class="grid gap-4">
            <div class="flex items-center gap-3">
              <Mail class="h-4 w-4 text-muted-foreground" />
              <div>
                <p class="text-sm font-medium">Année</p>
                <p class="text-sm text-muted-foreground">{{ year.name }}</p>
              </div>
            </div>

            <div class="flex items-center gap-3">
              <Clock10 class="h-4 w-4 text-muted-foreground" />
              <div>
                <p class="text-sm font-medium">Début</p>
                <p class="text-sm text-muted-foreground">
                  {{ year.start }}
                </p>
              </div>
            </div>

            <div class="flex items-center gap-3">
              <Clock11 class="h-4 w-4 text-muted-foreground" />
              <div>
                <p class="text-sm font-medium">Fin</p>
                <p class="text-sm text-muted-foreground">
                  {{ year.end }}
                </p>
              </div>
            </div>

            <div class="flex items-center gap-3">
              <Lock class="h-4 w-4 text-muted-foreground" />
              <div>
                <p class="text-sm font-medium">Status</p>
                <p class="text-sm text-muted-foreground">
                  {{ year.is_closed ? "Fermée" : "En cours" }}
                </p>
              </div>
            </div>

            <div class="flex items-center gap-3">
              <Calendar class="h-4 w-4 text-muted-foreground" />
              <div>
                <p class="text-sm font-medium">Créé le</p>
                <p class="text-sm text-muted-foreground">
                  {{ ago(year.created_at) }}
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  </div>
</template>
