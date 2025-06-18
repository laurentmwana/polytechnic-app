<script setup lang="ts">
import { ref, watch, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { toast } from "vue-sonner";

import { ago } from "@/lib/date-time";
import { excerpt } from "@/lib/utils";
import { getCollectionFollowes } from "@/services/other";
import type { CourseFollowModel } from "@/types/model";
import type { PaginatedResponse } from "@/types/paginate";

useHead({
  title: "Mes cours - Polytechnic Application",
});

definePageMeta({
  layout: "default",
  middleware: ["student"],
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
  try {
    isPending.value = true;

    const token = auth.session.value?.accessToken;
    if (!token) return;

    const response = await getCollectionFollowes(token, numberPage.value);
    const data = await response.json();

    if (response.ok) {
      follows.value = data as CoursePaginateProps;
    } else if (response.status === 401) {
      toast.warning("Session expirée", {
        description: "Votre session a expiré. Veuillez vous reconnecter.",
      });
      auth.logout();
    } else {
      toast.error("Erreur", {
        description:
          (data as { message: string }).message || "Une erreur est survenue.",
      });
    }
  } catch (error) {
    toast.error("Erreur", {
      description: "Impossible de récupérer les cours suivis.",
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
    <div class="section-page-header">
      <h2 class="section-page-title">Mes cours</h2>
    </div>

    <LoaderContainer v-if="isPending" :is-card="true" />

    <template v-else-if="!follows || follows.data.length === 0">
      <p>Aucun cours suivi pour l’instant.</p>
    </template>

    <template v-else>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Cours</TableHead>
            <TableHead>Année académique</TableHead>
            <TableHead>Suivi depuis</TableHead>
            <TableHead class="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow v-for="follow in follows.data" :key="follow.id">
            <TableCell>{{ follow.course.name }}</TableCell>
            <TableCell>{{ excerpt(follow.year.name, 30) }}</TableCell>
            <TableCell>{{ ago(follow.created_at) }}</TableCell>
            <TableCell>
              <div class="flex items-center justify-end gap-4">
                <NuxtLink :href="`/course/${follow.course.id}`">
                  <Button size="sm" variant="secondary">
                    <Eye :size="15" />
                  </Button>
                </NuxtLink>
              </div>
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>

      <Pagination :onPage="onPage" :meta="follows" />
    </template>
  </div>
</template>
