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
import { useAuth } from "@/composables/useAuth";
import { ago } from "@/lib/date-time";
import { excerpt } from "@/lib/utils";
import type { EventModel } from "@/types/model";
import type { PaginatedResponse } from "@/types/paginate";
import { Eye, Pen, Trash } from "lucide-vue-next";
import { toast } from "vue-sonner";
import { getCollectionEvents } from "@/services/other";
import { onMounted, ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";

useHead({
  title: "Evènements - Polytechnic Application",
});

definePageMeta({
  layout: "default",
});

type ModelCollectionProps = PaginatedResponse<EventModel[]>;

const router = useRouter();
const route = useRoute();

const numberPage = ref<number>(
  route.query.page ? parseInt(route.query.page as string) : 1
);

const events = ref<ModelCollectionProps | null>(null);
const isLoading = ref<boolean>(true);

const fetchEvents = async () => {
  try {
    isLoading.value = true;
    const response = await getCollectionEvents(numberPage.value
    );
    const data = await response.json();

    if (response.ok) {
      events.value = data as ModelCollectionProps;
    }  else {
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
  <div class="py-12 container">
    <div class="section-page-header">
      <h2 class="section-page-title">Liste d'évènements</h2>
    </div>

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
                <Button size="sm" variant="secondary" :as-child="true">
                  <NuxtLink :href="`/event/${event.id}`">
                    <Eye :size="15" />
                  </NuxtLink>
                </Button>
              </div>
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>

      <Pagination v-if="events" :onPage="onPage" :meta="events" />
    </div>
  </div>
</template>
