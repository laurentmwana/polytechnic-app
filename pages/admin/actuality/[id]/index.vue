<script setup lang="ts">
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/composables/useAuth";
import { ago } from "@/lib/date-time";
import { getItemActuality } from "@/services/actuality";
import type { ActualityModel } from "@/types/model";
import { Calendar } from "lucide-vue-next";
import { toast } from "vue-sonner";
import GoBack from "@/components/GoBack.vue";
import LoaderContainer from "@/components/LoaderContainer.vue";

useHead({
  title: "Détails actualité - Polytechnic Application",
});

definePageMeta({
  layout: "admin",
  middleware: ["admin", "verified"],
});

interface ModelDataResponse {
  data: ActualityModel;
}

const auth = useAuth();
const route = useRoute();

const actuality = ref<ActualityModel | null>(null);
const isLoading = ref(true);

const actualityId = parseInt(route.params.id as string);

if (!actualityId || isNaN(actualityId)) {
  throw createError({
    statusCode: 400,
    statusMessage: "L'ID de l'actualité est requis et doit être un nombre valide",
  });
}

const fetchActuality = async () => {
  try {
    isLoading.value = true;

    const token = auth.session.value?.accessToken;
    if (!token) throw new Error("Utilisateur non authentifié");

    const response = await getItemActuality(token, actualityId);
    const data = await response.json();

    if (response.ok) {
      actuality.value = (data as ModelDataResponse).data;
    } else if (response.status === 401) {
      toast.warning("Session expirée", {
        description: "Votre session a expiré, merci de vous reconnecter.",
      });
      auth.logout();
    } else {
      toast.error("Erreur", {
        description: (data as { message: string }).message || "Une erreur est survenue",
      });
    }
  } catch {
    toast.error("Erreur", {
      description: "Impossible de charger l'actualité.",
    });
  } finally {
    isLoading.value = false;
  }
};

onMounted(fetchActuality);
</script>
<template>
  <div class="space-y-6">
    <!-- Bouton retour -->
    <GoBack back="/admin/actuality" />

    <!-- Loader -->
    <LoaderContainer v-if="isLoading" :isCard="true" />

    <!-- Actualité non trouvée -->
    <Card v-else-if="!actuality">
      <CardContent class="text-center py-12">
        <FileText class="h-12 w-12 mx-auto text-muted-foreground mb-4" />
        <p class="text-lg font-medium mb-2">Actualité non trouvée</p>
        <p class="text-muted-foreground">
          L'actualité avec l'ID {{ actualityId }} n'existe pas.
        </p>
      </CardContent>
    </Card>

    <!-- Détails de l’actualité -->
    <div v-else class="w-full max-w-3xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle class="flex items-center gap-2">
            Détails de l'actualité #{{ actuality.id }}
          </CardTitle>
        </CardHeader>
        <CardContent class="space-y-4">
          <div class="grid gap-5">
            <div>
              <p class="text-sm font-medium">Titre</p>
              <p class="text-base text-muted-foreground">{{ actuality.title }}</p>
            </div>

            <div>
              <p class="text-sm font-medium">Description</p>
              <p class="text-sm text-muted-foreground whitespace-pre-line">
                {{ actuality.description }}
              </p>
            </div>

            <div class="flex items-center gap-3">
              <Calendar class="h-4 w-4 text-muted-foreground" />
              <div>
                <p class="text-sm font-medium">Créée le</p>
                <p class="text-sm text-muted-foreground">
                  {{ ago(actuality.created_at) }}
                </p>
              </div>
            </div>

            <div class="flex items-center gap-3">
              <MessageCircle class="h-4 w-4 text-muted-foreground" />
              <div>
                <p class="text-sm font-medium">Commentaires</p>
                <p class="text-sm text-muted-foreground">
                  {{ actuality.comments.length }} commentaire(s)
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  </div>
</template>
