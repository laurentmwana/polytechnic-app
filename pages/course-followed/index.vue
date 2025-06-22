<script setup lang="ts">
import { ref, watch, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { toast } from "vue-sonner";

import { ago } from "@/lib/date-time";
import { excerpt } from "@/lib/utils";
import { getCollectionFollowes } from "@/services/other";
import type { CourseFollowModel } from "@/types/model";
import type { PaginatedResponse } from "@/types/paginate";

import { EyeIcon } from "lucide-vue-next";

useHead({
  title: "Mes cours suivis - Polytechnic Application",
});

definePageMeta({
  layout: "default",
  middleware: ["student", "verified"],
});

type CoursePaginateProps = PaginatedResponse<CourseFollowModel[]>;

const isPending = ref(true);
const follows = ref<CoursePaginateProps>();
const auth = useAuth();
const router = useRouter();
const route = useRoute();

const numberPage = ref(
  route.query.page ? parseInt(route.query.page as string, 10) : 1
);

const fetchFollows = async () => {
  isPending.value = true;
  try {
    const token = auth.session.value?.accessToken;
    if (!token) return;

    const response = await getCollectionFollowes(token, numberPage.value);
    const data = await response.json();

    if (response.ok) {
      follows.value = data as CoursePaginateProps;
    } else if (response.status === 401) {
      toast.warning("Session expirée", {
        description: "Veuillez vous reconnecter pour continuer.",
      });
      auth.logout();
    } else {
      toast.error("Erreur lors du chargement", {
        description:
          (data as { message?: string }).message || "Une erreur est survenue.",
      });
    }
  } catch (error) {
    toast.error("Erreur réseau", {
      description: "Impossible de récupérer vos cours. Vérifiez votre connexion.",
    });
  } finally {
    isPending.value = false;
  }
};

const onPage = async (page: number) => {
  numberPage.value = page;
  await router.push(`/course-follow?page=${page}`);
  await fetchFollows();
};

watch(
  () => route.query.page,
  (newPage) => {
    const pageNumber = newPage ? parseInt(newPage as string, 10) : 1;
    if (pageNumber !== numberPage.value) {
      numberPage.value = pageNumber;
      fetchFollows();
    }
  }
);

onMounted(fetchFollows);
</script>

<template>
  <div class="container my-12">
    <div class="section-page-header mb-6">
      <h2 class="section-page-title">Mes cours suivis</h2>
      <p class="text-muted-foreground text-sm">
        Retrouvez ici la liste des cours que vous suivez pour cette année académique.
      </p>
    </div>

    <!-- Chargement -->
    <LoaderContainer v-if="isPending" :is-card="true" />

    <!-- Aucun cours -->
    <template v-else-if="!follows || follows.data.length === 0">
      <p class="text-muted-foreground py-6">Vous ne suivez actuellement aucun cours.</p>
    </template>

    <!-- Liste des cours -->
    <template v-else>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Cours</TableHead>
            <TableHead>Année académique</TableHead>
            <TableHead>Suivi depuis</TableHead>
            <TableHead class="text-right">Détail</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow v-for="follow in follows.data" :key="follow.id">
            <TableCell class="font-medium">{{ follow.course.name }}</TableCell>
            <TableCell>{{ excerpt(follow.year.name, 30) }}</TableCell>
            <TableCell>{{ ago(follow.created_at) }}</TableCell>
            <TableCell>
              <div class="flex justify-end">
                <NuxtLink :href="`/course/${follow.course.id}`">
                  <Button size="sm" variant="outline" class="flex items-center gap-1">
                    <EyeIcon class="w-4 h-4" />
                    Voir
                  </Button>
                </NuxtLink>
              </div>
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>

      <!-- Pagination -->
      <Pagination :onPage="onPage" :meta="follows" />
    </template>
  </div>
</template>
