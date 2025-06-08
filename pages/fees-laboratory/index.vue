<script setup lang="ts">
import { ago } from "@/lib/date-time";
import { getCollectionLabos } from "@/services/other";
import type { FeesLaboratoryModel } from "@/types/model";
import type { PaginatedResponse } from "@/types/paginate";
import { toast } from "vue-sonner";

useHead({
  title: "Frais laboratoire - Polytechnic Application",
});
definePageMeta({
  layout: "default",
});

type FeesLaboPaginateProps = PaginatedResponse<FeesLaboratoryModel[]>;

const isPending = ref<boolean>(true);
const feesLaboratories = ref<FeesLaboPaginateProps>();

const router = useRouter();
const route = useRoute();

const numberPage = ref<number>(
  route.query.page ? parseInt(route.query.page as string) : 1
);

const fetchTeacher = async () => {
  try {
    isPending.value = true;

    const response = await getCollectionLabos(numberPage.value);
    const data = await response.json();

    if (response.ok) {
      feesLaboratories.value = data as FeesLaboPaginateProps;
    } else {
      toast.error("Erreur", {
        description:
          (data as { message: string }).message || "Une erreur est survenue",
      });
    }
  } catch (error) {
    toast.error("Erreur", {
      description: `Impossible de récupèrer les frais laboratoires`,
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
      <h2 class="section-page-title">Frais laboratoire</h2>
    </div>

    <LoaderContainer :is-card="true" />
  </div>

  <div
    class="container my-12"
    v-if="!isPending && (feesLaboratories && feesLaboratories.data.length === 0)" 
  >
    <div class="section-page-header">
      <h2 class="section-page-title">Frais laboratoire</h2>
    </div>
    <p>Pas de frais laboratoire</p>
  </div>

  <div class="container my-12" v-if="feesLaboratories">
    <div class="section-page-header">
      <h2 class="section-page-title">Frais laboratoire</h2>
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
        <TableRow v-for="feesLabo in feesLaboratories.data" :key="feesLabo.id">
          <TableCell>
            {{ feesLabo.amount }}$
          </TableCell>
          <TableCell>
            {{ feesLabo.level.name }}
          </TableCell>
          <TableCell>
            {{ feesLabo.year.name }}
          </TableCell>
          <TableCell>
            {{ ago(feesLabo.created_at) }}
          </TableCell>
          <TableCell>
            <div class="flex items-center justify-end">
              <Button variant="secondary">
                <NuxtLink :href="`/fees-laboratory/${feesLabo.id}`">
                  En savoir plus
                </NuxtLink>
              </Button>
            </div>
          </TableCell>
        </TableRow>
      </TableBody>
    </Table>

    <!-- Pagination -->
    <Pagination :onPage="onPage" :meta="feesLaboratories" />
  </div>
</template>
