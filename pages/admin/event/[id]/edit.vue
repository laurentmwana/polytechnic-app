<script setup lang="ts">
import EventForm from "@/components/features/event/EventForm.vue";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import LoaderContainer from "@/components/LoaderContainer.vue";
import GoBack from "@/components/GoBack.vue";
import { useAuth } from "@/composables/useAuth";
import type { SchemaEventFormInfer } from "@/definitions/event";
import { editEvent, getItemEvent } from "@/services/event";
import type { EventModel } from "@/types/model";
import type { StateActionModel, ValidatorErrorProps } from "@/types/util";
import { User } from "lucide-vue-next";
import { toast } from "vue-sonner";

useHead({
  title: "Édition d’un évènement - Polytechnic Application",
});

definePageMeta({
  layout: "admin",
  middleware: ["admin", "verified"],
});

interface ModelResponse {
  data: EventModel;
}

const auth = useAuth();
const route = useRoute();
const router = useRouter();

const eventData = ref<EventModel | null>(null);
const isLoading = ref(true);
const isEdit = ref(false);
const validator = ref<ValidatorErrorProps | null>(null);

const eventId = parseInt(route.params.id as string);

if (!eventId || isNaN(eventId)) {
  throw createError({
    statusCode: 400,
    statusMessage: "L’ID de l’évènement est requis et doit être un nombre valide",
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
      eventData.value = (data as ModelResponse).data;
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
  } catch {
    toast.error("Erreur", {
      description: "Impossible de charger l’évènement",
    });
  } finally {
    isLoading.value = false;
  }
};

const onSubmit = async (values: SchemaEventFormInfer) => {
  try {
    isEdit.value = true;
    validator.value = null;

    if (!auth.session.value?.accessToken) {
      throw new Error("Utilisateur non authentifié");
    }

    const response = await editEvent(auth.session.value.accessToken, eventId, values);
    const data = await response.json();

    if (response.ok) {
      const state = (data as StateActionModel).state;
      if (state) {
        toast.success("Édition réussie", {
          description: `Les informations de l’évènement #${eventId} ont été modifiées.`,
        });
        await router.push("/admin/event");
      } else {
        toast.error("Édition échouée", {
          description: "L’action n’a pas pu être complétée.",
        });
      }
    } else if (response.status === 422) {
      validator.value = data as ValidatorErrorProps;
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
  } catch {
    toast.error("Erreur", {
      description: `Impossible d’éditer l’évènement #${eventId}`,
    });
  } finally {
    isEdit.value = false;
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
          L’évènement avec l’ID {{ eventId }} n’existe pas.
        </p>
      </CardContent>
    </Card>

    <!-- Formulaire d'édition -->
    <div v-else class="w-full max-w-4xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle class="flex items-center gap-2">
            Éditer l’évènement #{{ eventData.id }}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div class="space-y-5">
            <ValidatorError :validator="validator" />
            <EventForm :event="eventData" :onSubmit="onSubmit" :loading="isEdit" />
          </div>
        </CardContent>
      </Card>
    </div>
  </div>
</template>
