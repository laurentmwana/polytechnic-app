<script setup lang="ts">
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/composables/useAuth";
import { ago } from "@/lib/date-time";
import { Calendar, Mail, User } from "lucide-vue-next";
import { toast } from "vue-sonner";
import { getItemJury } from "../../../../services/jury";
import type { JuryModel } from "../../../../types/model";

useHead({
  title: "Détails d'un jurie - Polytechnic Application",
});

definePageMeta({
  layout: "admin",
  middleware: ["admin"],
});

interface ModelDataResponse {
  data: JuryModel;
}

const auth = useAuth();
const route = useRoute();

const jury = ref<JuryModel | null>(null);
const isLoading = ref<boolean>(true);

const juryId = parseInt(route.params.id as string);

if (!juryId || isNaN(juryId)) {
  throw createError({
    statusCode: 400,
    statusMessage: "L'ID de le jurie est requis et doit être un nombre valide",
  });
}

const fetchJury = async () => {
  try {
    isLoading.value = true;

    if (!auth.session.value?.accessToken) {
      throw new Error("utilisateur non authentifié");
    }

    const response = await getItemJury(auth.session.value.accessToken, juryId);
    const data = await response.json();

    if (response.ok) {
      jury.value = (data as ModelDataResponse).data;
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
      description: "Impossible de charger le jurie",
    });
  } finally {
    isLoading.value = false;
  }
};

onMounted(async () => {
  await fetchJury();
});
</script>

<template>
  <div class="space-y-6">
    <!-- Header avec bouton retour -->
    <GoBack back="/admin/jury" />

    <!-- Loader -->
    <LoaderContainer v-if="isLoading" :isCard="true" />

    <!-- jurie non trouvé -->
    <Card v-else-if="!jury">
      <CardContent class="text-center py-12">
        <User class="h-12 w-12 mx-auto text-muted-foreground mb-4" />
        <p class="text-lg font-medium mb-2">jurie non trouvé</p>
        <p class="text-muted-foreground">
          Le jurie avec l'ID {{ juryId }} n'existe pas.
        </p>
      </CardContent>
    </Card>

    <!-- Détails de le jurie -->
    <div v-else class="grid gap-6 md:grid-cols-2">
      <!-- Informations principales -->
      <Card>
        <CardHeader>
          <CardTitle class="flex items-center gap-2">
            <User class="h-5 w-5" />
            Informations du jurie
          </CardTitle>
        </CardHeader>
        <CardContent class="space-y-4">
          <div class="grid gap-4">
            <div class="flex items-center gap-3">
              <User class="h-4 w-4 text-muted-foreground" />
              <div>
                <p class="text-sm font-medium">Professeur</p>
                <p class="text-sm text-muted-foreground">
                  {{ jury.teacher.name }} {{ jury.teacher.firstname }}
                </p>
              </div>
            </div>

            <div class="flex items-center gap-3">
              <Mail class="h-4 w-4 text-muted-foreground" />
              <div>
                <p class="text-sm font-medium">Délibération</p>
                <p class="text-sm text-muted-foreground">
                  {{ jury.deliberation.level.name }} [{{
                    jury.deliberation.year.name
                  }}]
                </p>
              </div>
            </div>

            <div class="flex items-center gap-3">
              <Calendar class="h-4 w-4 text-muted-foreground" />
              <div>
                <p class="text-sm font-medium">Créé le</p>
                <p class="text-sm text-muted-foreground">
                  {{ ago(jury.created_at) }}
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  </div>
</template>
