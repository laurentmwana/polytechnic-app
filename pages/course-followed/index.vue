<script setup lang="ts">
import { ago } from "@/lib/date-time";
import { excerpt } from "@/lib/utils";
import { getCollectionFollowes } from "@/services/other";
import type { CourseFollowModel } from "@/types/model";
import type { PaginatedResponse } from "@/types/paginate";
import { Eye } from "lucide-vue-next";
import { toast } from "vue-sonner";

useHead({
  title: "Mes cours - Polytechnic Application",
});
definePageMeta({
  layout: "default",
  middleware: ["student"],
});

type CoursePaginateProps = PaginatedResponse<CourseFollowModel[]>;

const isPending = ref<boolean>(true);
const auth = useAuth();
const followes = ref<CoursePaginateProps>();
const router = useRouter();
const route = useRoute();

const numberPage = ref<number>(
  route.query.page ? parseInt(route.query.page as string) : 1
);

const fetchFollowes = async () => {
  try {
    isPending.value = true;

    if (!auth.session.value?.accessToken) {
      return;
    }

    const response = await getCollectionFollowes(
      auth.session.value.accessToken,
      numberPage.value
    );
    const data = await response.json();

    if (response.ok) {
      followes.value = data as CoursePaginateProps;
    } else if (response.status === 401) {
      toast.warning("Session expiré", {
        description: "Votre session a expirée (:",
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
      description: `Impossible de récupèrer les professeurss`,
    });
  } finally {
    isPending.value = false;
  }
};

const onPage = async (page: number) => {
  numberPage.value = page;
  await router.push(`/course-follow?page=${page}`);
  await fetchFollowes();
};

watch(
  () => route.query.page,
  (newPage) => {
    const pageNumber = newPage ? parseInt(newPage as string) : 1;
    if (pageNumber !== numberPage.value) {
      numberPage.value = pageNumber;
      fetchFollowes();
    }
  }
);

onMounted(() => {
  fetchFollowes();
});
</script>

<template>
  <div class="container my-12" v-if="isPending">
    <div class="section-page-header">
      <h2 class="section-page-title">Mes cours</h2>
    </div>

    <LoaderContainer :is-card="true" />
  </div>

  <div
    class="container my-12"
    v-else-if="
      (!followes || (followes && followes.data.length === 0)) && !isPending
    "
  >
    <div class="section-page-header">
      <h2 class="section-page-title">Mes cours</h2>
    </div>
    <p>Pas de cours</p>
  </div>

  <div
    class="container my-12"
    v-else-if="followes && followes.data.length > 0 && !isPending"
  >
    <div class="section-page-header">
      <h2 class="section-page-title">Mes cours</h2>
    </div>

    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Cours</TableHead>
          <TableHead>Année académique</TableHead>
          <TableHead>Création</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow v-for="follow in followes.data" :key="follow.id">
          <TableCell>
            {{ follow.course.name }}
          </TableCell>
          <TableCell>
            {{ excerpt(follow.year.name, 30) }}
          </TableCell>
          <TableCell>
            {{ ago(follow.created_at) }}
          </TableCell>
          <TableCell>
            <div class="flex items-center justify-end gap-4">
              <Button size="sm" variant="secondary">
                <NuxtLink :href="`/course/${follow.course.id}`">
                  <Eye :size="15" />
                </NuxtLink>
              </Button>
            </div>
          </TableCell>
        </TableRow>
      </TableBody>
    </Table>

    <!-- Pagination -->
    <Pagination :onPage="onPage" :meta="followes" />
  </div>
</template>
