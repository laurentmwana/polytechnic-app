<script setup lang="ts">
import LoaderContainer from "@/components/LoaderContainer.vue";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Pagination from "@/components/ui/pagination/Pagination.vue";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import ConfirmationDialog from "@/components/ui/dialog/ConfirmationDialog.vue";
import { useAuth } from "@/composables/useAuth";
import { ago } from "@/lib/date-time";
import { excerpt } from "@/lib/utils";
import type { EventModel } from "@/types/model";
import type { PaginatedResponse } from "@/types/paginate";
import { Eye, Pen, Trash } from "lucide-vue-next";
import { toast } from "vue-sonner";
import { getCollectionEvents, deleteEvent } from "@/services/event";
import { onMounted, ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";

useHead({
  title: "Gestion des évènements - Polytechnic Application",
});

definePageMeta({
  layout: "admin",
  middleware: ["admin", "verified"],
});

type ModelCollectionProps = PaginatedResponse<EventModel[]>;

const auth = useAuth();
const router = useRouter();
const route = useRoute();

const numberPage = ref<number>(
  route.query.page ? parseInt(route.query.page as string) : 1
);

const events = ref<ModelCollectionProps | null>(null);
const isLoading = ref<boolean>(true);
const showModalDeleteEventId = ref<number | null>(null);

const fetchEvents = async () => {
  try {
    isLoading.value = true;

    if (!auth.session.value?.accessToken) {
      throw new Error("utilisateur non authentifié");
    }

    const response = await getCollectionEvents(
      auth.session.value.accessToken,
      numberPage.value
    );
    const data = await response.json();

    if (response.ok) {
      events.value = data as ModelCollectionProps;
    } else if (response.status === 401) {
      toast.warning("Session expirée", {
        description: "Merci de vous reconnecter",
      });
      auth.logout();
    } else {
      toast.error("Erreur", {
        description: (data as { message: string }).message || "Erreur serveur",
      });
    }
  } catch {
    toast.error("Erreur", {
      description: "Impossible de charger les évènements",
    });
  } finally {
    isLoading.value = false;
  }
};

const onDelete = async (eventId: number) => {
  try {
    isLoading.value = true;
    if (!auth.session.value?.accessToken) {
      throw new Error("Non authentifié");
    }

    const response = await deleteEvent(auth.session.value.accessToken, eventId);

    if (response.ok) {
      toast.success("Évènement supprimé");
      await fetchEvents();
    } else {
      const data = await response.json();
      toast.error("Erreur", {
        description: data.message || "Suppression échouée",
      });
    }
  } catch {
    toast.error("Erreur", {
      description: "Erreur lors de la suppression",
    });
  } finally {
    isLoading.value = false;
    showModalDeleteEventId.value = null;
  }
};

const onPage = async (page: number) => {
  numberPage.value = page;
  await router.push(`/admin/event?page=${page}`);
  await fetchEvents();
};

watch(
  () => route.query.page,
  (newPage) => {
    const pageNumber = newPage ? parseInt(newPage as string) : 1;
    if (pageNumber !== numberPage.value) {
      numberPage.value = pageNumber;
      fetchEvents();
    }
  }
);

onMounted(fetchEvents);
</script>

<template>
  <Card>
    <CardHeader>
      <div class="flex items-center justify-between">
        <div>
          <CardTitle>Gestion des évènements</CardTitle>
          <CardDescription>
            Gérez les évènements académiques et administratifs.
          </CardDescription>
        </div>
        <Button asChild variant="outline" size="sm">
          <NuxtLink to="/admin/event/create" class="flex items-center gap-2">
            Créer
          </NuxtLink>
        </Button>
      </div>
    </CardHeader>
    <CardContent>
      <LoaderContainer v-if="isLoading" />

      <div v-else-if="!events?.data?.length" class="text-center py-8">
        <p class="text-muted-foreground">Aucun évènement trouvé</p>
      </div>

      <div v-else class="space-y-4">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Titre</TableHead>
              <TableHead>Promotion</TableHead>
              <TableHead>Année</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Tags</TableHead>
              <TableHead class="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow v-for="event in events.data" :key="event.id">
              <TableCell class="font-medium">
                {{ excerpt(event.title, 40) }}
              </TableCell>
              <TableCell>{{ event.level?.name ?? "—" }}</TableCell>
              <TableCell>{{ event.year?.name ?? "—" }}</TableCell>
              <TableCell>
                <p class="text-sm text-muted-foreground">
                  {{ ago(event.start_at) }}
                </p>
              </TableCell>
              <TableCell>
                <span class="text-sm text-muted-foreground">
                  {{ event.tags?.join(", ") ?? "—" }}
                </span>
              </TableCell>
              <TableCell>
                <div class="flex items-center gap-2 justify-end">
                  <Button size="sm" variant="outline" :as-child="true">
                    <NuxtLink :href="`/admin/event/${event.id}/edit`">
                      <Pen :size="15" />
                    </NuxtLink>
                  </Button>
                  <Button size="sm" variant="secondary" :as-child="true">
                    <NuxtLink :href="`/admin/event/${event.id}`">
                      <Eye :size="15" />
                    </NuxtLink>
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    @click="showModalDeleteEventId = event.id"
                  >
                    <Trash :size="15" />
                  </Button>

                  <ConfirmationDialog
                    :open="showModalDeleteEventId === event.id"
                    variant="destructive"
                    title="Suppression de l'évènement"
                    description="Cette action est irréversible. L'évènement sera définitivement supprimé."
                    confirm-text="Supprimer"
                    cancel-text="Annuler"
                    :loading="isLoading"
                    @confirm="() => onDelete(event.id)"
                    @cancel="showModalDeleteEventId = null"
                  />
                </div>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>

        <Pagination v-if="events" :onPage="onPage" :meta="events" />
      </div>
    </CardContent>
  </Card>
</template>
