<script setup lang="ts">
import { ref, watch, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import {
  getCollectionNotifications,
  markAsReadNotification,
  deleteNotification,
} from "@/services/other";
import type { NotificationModel } from "@/types/model";
import type { PaginatedResponse } from "@/types/paginate";
import { toast } from "vue-sonner";
import { Bell } from "lucide-vue-next";
import { getInitials } from "@/lib/utils";
import { ago } from "@/lib/date-time";

useHead({
  title: "Notifications - Polytechnic Application",
});

definePageMeta({
  layout: "default",
});

type NotificationPaginateProps = PaginatedResponse<NotificationModel[]>;

const auth = useAuth();
const isPending = ref(true);
const notifications = ref<NotificationPaginateProps & { total: number; unread: number }>();
const router = useRouter();
const route = useRoute();

const numberPage = ref(
  route.query.page ? parseInt(route.query.page as string, 10) : 1
);

const fetchNotifications = async () => {
  try {
    isPending.value = true;

    if (!auth.session.value?.accessToken) {
      throw new Error("Utilisateur non authentifié.");
    }

    const response = await getCollectionNotifications(
      auth.session.value.accessToken,
      numberPage.value
    );
    const data = await response.json();

    if (response.ok) {
      notifications.value = data as NotificationPaginateProps;
    } else {
      toast.error("Erreur", {
        description:
          (data as { message?: string }).message ||
          "Une erreur est survenue lors du chargement des notifications.",
      });
    }
  } catch (error) {
    toast.error("Erreur", {
      description: "Impossible de récupérer les notifications.",
    });
  } finally {
    isPending.value = false;
  }
};

const onPage = async (page: number) => {
  numberPage.value = page;
  await router.push(`/notification?page=${page}`);
  await fetchNotifications();
};

const onMarkAsRead = async () => {
  try {
    isPending.value = true;

    if (!auth.session.value?.accessToken) {
      throw new Error("Utilisateur non authentifié.");
    }

    const response = await markAsReadNotification(auth.session.value.accessToken);
    const data = await response.json();

    if (response.ok) {
      if ((data as { state: boolean }).state) {
        toast.success("Succès", {
          description: "Toutes les notifications non lues ont été marquées comme lues.",
        });
      } else {
        toast.error("Échec", {
          description: "Impossible de marquer les notifications comme lues. Veuillez réessayer.",
        });
      }
    } else {
      toast.error("Erreur", {
        description:
          (data as { message?: string }).message || "Une erreur est survenue.",
      });
    }
  } catch (error) {
    toast.error("Erreur", {
      description: "Impossible de marquer les notifications comme lues.",
    });
  } finally {
    await fetchNotifications();
  }
};

const onDelete = async (id: string) => {
  try {
    isPending.value = true;

    if (!auth.session.value?.accessToken) {
      throw new Error("Utilisateur non authentifié.");
    }

    const response = await deleteNotification(auth.session.value.accessToken, id);
    const data = await response.json();

    if (response.ok) {
      if ((data as { state: boolean }).state) {
        toast.success("Succès", {
          description: "Notification supprimée avec succès.",
        });
      } else {
        toast.error("Échec", {
          description: "Impossible de supprimer cette notification. Veuillez réessayer.",
        });
      }
    } else {
      toast.error("Erreur", {
        description:
          (data as { message?: string }).message || "Une erreur est survenue.",
      });
    }
  } catch (error) {
    toast.error("Erreur", {
      description: "Impossible de supprimer cette notification.",
    });
  } finally {
    await fetchNotifications();
  }
};

watch(
  () => route.query.page,
  (newPage) => {
    const pageNumber = newPage ? parseInt(newPage as string, 10) : 1;
    if (pageNumber !== numberPage.value) {
      numberPage.value = pageNumber;
      fetchNotifications();
    }
  }
);

onMounted(fetchNotifications);
</script>

<template>
  <div class="container my-12">
    <div class="section-page-header">
      <h2 class="section-page-title">Notifications</h2>
    </div>

    <LoaderContainer v-if="isPending" :is-card="true" />

    <div v-else>
      <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
        <!-- Sidebar -->
        <div class="md:col-span-1">
          <div class="rounded-lg border bg-card text-card-foreground shadow-sm">
            <div class="p-4 space-y-4">
              <div class="space-y-1">
                <a
                  class="inline-flex items-center gap-2 text-sm font-medium h-10 px-4 py-2 w-full justify-start hover:bg-accent rounded-md"
                  href="/notification"
                >
                  <Bell :size="15" />
                  Notifications
                  <div class="ml-auto inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold bg-primary text-primary-foreground">
                    {{ notifications?.total ?? 0 }}
                  </div>
                </a>
                <a
                  class="inline-flex items-center gap-2 text-sm font-medium h-10 px-4 py-2 w-full justify-start hover:bg-accent rounded-md"
                  href="/notification?filter=unread"
                >
                  <div class="h-4 w-4 mr-2" />
                  Non lues
                  <div class="ml-auto inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold bg-primary text-primary-foreground">
                    {{ notifications?.unread ?? 0 }}
                  </div>
                </a>
              </div>

              <Separator class="my-4" />

              <Button :onclick="onMarkAsRead" class="w-full" variant="secondary">
                {{ isPending ? "Chargement..." : "Tout marquer comme lues" }}
              </Button>
            </div>
          </div>
        </div>

        <!-- Notifications list -->
        <div class="md:col-span-3">
          <div class="space-y-4">
            <div
              v-for="notification in notifications?.data"
              :key="notification.id"
              :class="[
                'p-4 rounded-lg border flex items-start gap-4',
                notification.read_at ? '' : 'border-primary/60'
              ]"
            >
              <span class="relative flex shrink-0 overflow-hidden rounded-full h-10 w-10">
                <span class="flex h-full w-full items-center justify-center rounded-full bg-muted">
                  {{ getInitials(notification.data.title) }}
                </span>
              </span>
              <div class="flex-1">
                <p class="font-medium">{{ notification.data.title }}</p>
                <p class="text-sm text-muted-foreground mt-1 mb-4">
                  Reçue {{ ago(notification.created_at) }}
                </p>
                <div class="flex items-center gap-3">
                  <Button variant="secondary" as-child>
                    <NuxtLink :to="`/notification/${notification.id}`">En savoir plus</NuxtLink>
                  </Button>
                  <Button :onclick="() => onDelete(notification.id)" variant="destructive">
                    Supprimer
                  </Button>
                </div>
              </div>
            </div>

            <!-- Aucune notification -->
            <div v-if="notifications?.data?.length === 0" class="text-center text-muted-foreground mt-8">
              Aucune notification à afficher.
            </div>
          </div>

          <!-- Pagination -->
          <Pagination :onPage="onPage" :meta="notifications" />
        </div>
      </div>
    </div>
  </div>
</template>
