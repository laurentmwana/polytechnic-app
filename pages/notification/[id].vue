<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useRoute } from "vue-router";
import { createError } from "h3";
import { getInitials } from "@/lib/utils";
import { ago } from "@/lib/date-time";
import { getShowNotification } from "@/services/other";
import type { NotificationModel } from "@/types/model";
import { toast } from "vue-sonner";

useHead({
  title: "En savoir plus sur une notification - Polytechnic Application",
});

definePageMeta({
  layout: "default",
});

const route = useRoute();
const auth = useAuth();
const notificationId = route.params.id as string;

if (!notificationId) {
  throw createError({
    statusCode: 400,
    statusMessage: "L'ID de la notification est requis.",
  });
}

const isPending = ref(true);
const notification = ref<NotificationModel | null>(null);

const fetchNotification = async () => {
  try {
    isPending.value = true;

    const token = auth.session.value?.accessToken;
    if (!token) {
      throw new Error("Utilisateur non authentifié.");
    }

    const response = await getShowNotification(token, notificationId);
    const data = await response.json();

    if (response.ok) {
      notification.value = data as NotificationModel;
    } else {
      toast.error("Erreur", {
        description: data?.message || "Une erreur est survenue.",
      });
    }
  } catch (error) {
    toast.error("Erreur", {
      description: "Impossible de récupérer la notification.",
    });
  } finally {
    isPending.value = false;
  }
};

onMounted(fetchNotification);
</script>

<template>
  <div class="container py-12">
    <GoBack back="/notification" />

    <div class="section-page-header">
      <h2 class="section-page-title">En savoir plus sur une notification</h2>
    </div>

    <LoaderContainer v-if="isPending" :is-card="true" />

    <div v-else-if="notification">
      <div
        :class="[
          'p-4 rounded-lg border flex items-start gap-4',
          notification.read_at ? '' : 'border-primary/60',
        ]"
      >
        <span
          class="relative flex shrink-0 overflow-hidden rounded-full h-10 w-10"
        >
          <span
            class="flex h-full w-full items-center justify-center rounded-full bg-muted"
          >
            {{ getInitials(notification.data.title) }}
          </span>
        </span>
        <div class="flex-1">
          <p class="font-medium">{{ notification.data.title }}</p>
          <p class="font-normal my-4">{{ notification.data.description }}</p>
          <p class="text-sm text-muted-foreground mt-1 mb-4">
            {{ ago(notification.created_at) }}
          </p>
          <Button variant="secondary" as-child>
            <NuxtLink :to="notification.data.url">Voir la source</NuxtLink>
          </Button>
        </div>
      </div>
    </div>

    <div v-else>
      <p class="text-center">Aucune notification trouvée.</p>
    </div>
  </div>
</template>
