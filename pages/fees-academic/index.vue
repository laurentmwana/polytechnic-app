<script setup lang="ts">
import { ago } from "@/lib/date-time";
import { getCollectionAcademics, getCollectionTeachers } from "@/services/other";
import type {  FeesAcademicModel } from "@/types/model";
import type { PaginatedResponse } from "@/types/paginate";
import { toast } from "vue-sonner";

useHead({
  title: "Frais académique - Polytechnic Application",
});
definePageMeta({
  layout: "default",
});

type FeesAcaPaginateProps = PaginatedResponse<FeesAcademicModel[]>;

const isPending = ref<boolean>(true);
const feesAcademics = ref<FeesAcaPaginateProps>();
const router = useRouter();
const route = useRoute();

const numberPage = ref<number>(
  route.query.page ? parseInt(route.query.page as string) : 1
);

const fetchTeacher = async () => {
  try {
    isPending.value = true;

    const response = await getCollectionAcademics(numberPage.value);
    const data = await response.json();

    if (response.ok) {
      feesAcademics.value = data as FeesAcaPaginateProps;
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
  <div class="container my-12" v-if="isPending">
    <div class="section-page-header">
      <h2 class="section-page-title">Frais académique</h2>
    </div>

    <LoaderContainer :is-card="true" />
  </div>

  <div
    class="container my-12"
    v-if="(!feesAcademics || (feesAcademics && feesAcademics.data.length === 0)) && !isPending"
  >
    <div class="section-page-header">
      <h2 class="section-page-title">Frais académique</h2>
    </div>
    <p>Pas de frais académique</p>
  </div>

  <div class="container my-12" v-if="feesAcademics">
    <div class="section-page-header">
      <h2 class="section-page-title">Frais académique</h2>
    </div>

    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Montant</TableHead>
          <TableHead>Promotion</TableHead>
          <TableHead>Année académique</TableHead>
          <TableHead>Création</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow v-for="feesAcademic in feesAcademics.data" :key="feesAcademic.id">
          <TableCell>
            {{ feesAcademic.amount }}$
          </TableCell>
          <TableCell>
            {{ feesAcademic.level.name }}
          </TableCell>
          <TableCell>
            {{ feesAcademic.year.name }}
          </TableCell>
          <TableCell>
            {{ ago(feesAcademic.created_at) }}
          </TableCell>
          <TableCell>
            <div class="flex items-center justify-end">
              <Button variant="secondary">
                <NuxtLink :href="`/fees-academic/${feesAcademic.id}`">
                  En savoir plus
                </NuxtLink>
              </Button>
            </div>
          </TableCell>
        </TableRow>
      </TableBody>
    </Table>

    <!-- Pagination -->
    <Pagination :onPage="onPage" :meta="feesAcademics" />
  </div>
</template>
