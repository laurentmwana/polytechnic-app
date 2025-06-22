<script setup lang="ts">
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import LoaderContainer from "@/components/LoaderContainer.vue";
import GoBack from "@/components/GoBack.vue";
import { useAuth } from "@/composables/useAuth";
import { ago } from "@/lib/date-time";
import { getItemEvent } from "@/services/event";
import type { EventModel } from "@/types/model";
import { Calendar, User, Layers, Tag, Clock, Link as LinkIcon } from "lucide-vue-next";
import { toast } from "vue-sonner";

useHead({
  title: "Détails évènement - Polytechnic Application",
});

definePageMeta({
  layout: "admin",
  middleware: ["admin", "verified"],
});

interface ModelDataResponse {
  data: EventModel;
}

const auth = useAuth();
const route = useRoute();

const eventData = ref<EventModel | null>(null);
const isLoading = ref<boolean>(true);

const eventId = parseInt(route.params.id as string);

if (!eventId || isNaN(eventId)) {
  throw createError({
    statusCode: 400,
    statusMessage: "L'ID de l'évènement est requis et doit être un nombre valide",
  });
}

const fetchEvent = async () => {
  try {
    isLoading.value = true;

    if (!auth.session.value?.accessToken) {
      throw new Error("Utilisateur non authentifié");
    }

    const response = await getItemEvent(auth.session.value.accessToken, eventId);
    const data = await response.json();

    if (response.ok) {
      eventData.value = (data as ModelDataResponse).data;
    } else if (response.status === 401) {
      toast.warning("Session expirée", {
        description: "Merci de vous reconnecter",
      });
      auth.logout();
    } else {
      toast.error("Erreur", {
        description: (data as { message: string }).message || "Une erreur est survenue",
      });
    }
  } catch (error) {
    toast.error("Erreur", {
      description: "Impossible de charger l'évènement",
    });
  } finally {
    isLoading.value = false;
  }
};

onMounted(fetchEvent);
</script>

<template>
  <div class="space-y-6">
    <!-- Bouton retour -->
    <GoBack back="/admin/event" />

    <!-- Loader -->
    <LoaderContainer v-if="isLoading" :isCard="true" />

    <!-- Évènement non trouvé -->
    <Card v-else-if="!eventData">
      <CardContent class="text-center py-12">
        <User class="h-12 w-12 mx-auto text-muted-foreground mb-4" />
        <p class="text-lg font-medium mb-2">Évènement non trouvé</p>
        <p class="text-muted-foreground">
          L'évènement avec l'ID {{ eventId }} n'existe pas.
        </p>
      </CardContent>
    </Card>

    <!-- Détails de l'évènement -->
    <div v-else class="space-y-6">
      <!-- Infos principales -->
      <Card>
        <CardHeader>
          <CardTitle class="flex items-center gap-2">
            <Calendar class="h-5 w-5" />
            Informations de l'évènement
          </CardTitle>
        </CardHeader>
        <CardContent class="space-y-4">
          <div class="grid gap-4 md:grid-cols-2">
            <div class="flex items-center gap-3">
              <User class="h-4 w-4 text-muted-foreground" />
              <div>
                <p class="text-sm font-medium">Titre</p>
                <p class="text-sm text-muted-foreground">
                  {{ eventData.title }}
                </p>
              </div>
            </div>

            <div class="flex items-center gap-3">
              <Layers class="h-4 w-4 text-muted-foreground" />
              <div>
                <p class="text-sm font-medium">Promotion</p>
                <p class="text-sm text-muted-foreground">
                  {{ eventData.level?.name ?? "—" }}
                </p>
              </div>
            </div>

            <div class="flex items-center gap-3">
              <Calendar class="h-4 w-4 text-muted-foreground" />
              <div>
                <p class="text-sm font-medium">Année académique</p>
                <p class="text-sm text-muted-foreground">
                  {{ eventData.year?.name ?? "—" }}
                </p>
              </div>
            </div>

            <div class="flex items-center gap-3">
              <Clock class="h-4 w-4 text-muted-foreground" />
              <div>
                <p class="text-sm font-medium">Commence le</p>
                <p class="text-sm text-muted-foreground">
                  {{ ago(eventData.start_at) }}
                </p>
              </div>
            </div>

            <div class="flex items-center gap-3">
              <Tag class="h-4 w-4 text-muted-foreground" />
              <div>
                <p class="text-sm font-medium">Tags</p>
                <p class="text-sm text-muted-foreground">
                  {{ eventData.tags?.join(", ") || "Aucun tag" }}
                </p>
              </div>
            </div>

            <div class="flex items-center gap-3" v-if="eventData.url">
              <LinkIcon class="h-4 w-4 text-muted-foreground" />
              <div>
                <p class="text-sm font-medium">Lien source</p>
                <a
                  :href="eventData.url"
                  target="_blank"
                  class="text-sm font-medium text-blue-600 hover:underline dark:text-blue-400"
                >
                  Voir la source
                </a>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <!-- Contenu HTML enrichi -->
      <Card>
        <CardHeader>
          <CardTitle class="flex items-center gap-2">
            📄 Contenu
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div class="markdown" v-html="eventData.content" />
        </CardContent>
      </Card>
    </div>
  </div>
</template>
