<script setup lang="ts">
import { ago } from "@/lib/date-time";
import { getCollectionTeachers } from "@/services/other";
import type { TeacherModel } from "@/types/model";
import type { PaginatedResponse } from "@/types/paginate";
import { toast } from "vue-sonner";

useHead({
  title: "Nos professeurs - Polytechnic Application",
});
definePageMeta({
  layout: "default",
});

type TeacherPaginateProps = PaginatedResponse<TeacherModel[]>;

const isPending = ref<boolean>(true);
const teachers = ref<TeacherPaginateProps>();
const router = useRouter();
const route = useRoute();

const numberPage = ref<number>(
  route.query.page ? parseInt(route.query.page as string) : 1
);

const fetchTeacher = async () => {
  try {
    isPending.value = true;

    const response = await getCollectionTeachers(numberPage.value);
    const data = await response.json();

    if (response.ok) {
      teachers.value = data as TeacherPaginateProps;
    } else {
      toast.error("Erreur", {
        description:
          (data as { message: string }).message || "Une erreur est survenue",
      });
    }
  } catch (error) {
    toast.error("Erreur", {
      description: `Impossible de récupèrer les professeurs`,
    });
  } finally {
    isPending.value = false;
  }
};

const onPage = async (page: number) => {
  numberPage.value = page;
  await router.push(`/teacher?page=${page}`);
  await fetchTeacher();
};

watch(
  () => route.query.page,
  (newPage) => {
    const pageNumber = newPage ? parseInt(newPage as string) : 1;
    if (pageNumber !== numberPage.value) {
      numberPage.value = pageNumber;
      fetchTeacher();
    }
  }
);

onMounted(() => {
  fetchTeacher();
});
</script>

<template>
  <div class="container my-12">
    <div class="section-page-header">
      <h2 class="section-page-title">Nos professeurs</h2>
    </div>

    <LoaderContainer v-if="isPending" :is-card="true" />

    <p v-else-if="!teachers || teachers.data.length === 0">
      Pas de professeurs
    </p>

    <div v-else>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nom</TableHead>
            <TableHead>Postnom</TableHead>
            <TableHead>Genre</TableHead>
            <TableHead>Département</TableHead>
            <TableHead>Nombre de cours</TableHead>
            <TableHead>Création</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow v-for="teacher in teachers.data" :key="teacher.id">
            <TableCell>{{ teacher.name }}</TableCell>
            <TableCell>{{ teacher.firstname }}</TableCell>
            <TableCell>{{ teacher.gender }}</TableCell>
            <TableCell>{{ teacher.department.name }}</TableCell>
            <TableCell>
              <Badge>{{ teacher.courses.length }}</Badge>
            </TableCell>
            <TableCell>{{ ago(teacher.created_at) }}</TableCell>
            <TableCell>
              <div class="flex items-center justify-end">
                <NuxtLink :href="`/teacher/${teacher.id}`">
                  <Button variant="secondary">En savoir plus</Button>
                </NuxtLink>
              </div>
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>

      <Pagination :onPage="onPage" :meta="teachers" />
    </div>
  </div>
</template>
