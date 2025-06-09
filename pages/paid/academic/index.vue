<script setup lang="ts">
import { ago } from "@/lib/date-time";
import type { PaidAcademicModel } from "@/types/model";
import type { PaginatedResponse } from "@/types/paginate";
import { toast } from "vue-sonner";
import { getAllPaidAcademics } from "../../../services/paid";

useHead({
  title: "Paiement frais académique - Polytechnic Application",
});
definePageMeta({
  layout: "default",
});

type feesAcademicPaginateProps = PaginatedResponse<PaidAcademicModel[]>;

const auth = useAuth();
const isPending = ref<boolean>(true);
const feesAcademics = ref<feesAcademicPaginateProps>();

const router = useRouter();
const route = useRoute();

const numberPage = ref<number>(
  route.query.page ? parseInt(route.query.page as string) : 1
);

const fetchPaidAcademics = async () => {
  try {
    isPending.value = true;

    if (!auth.session.value?.accessToken) {
      throw new Error("utilisateur non authentifié");
    }

    const response = await getAllPaidAcademics(
      auth.session.value.accessToken,
      numberPage.value
    );
    const data = await response.json();

    if (response.ok) {
      feesAcademics.value = data as feesAcademicPaginateProps;
    } else if (response.status === 401) {
      auth.logout();
      toast.warning("Session", {
        description: "votre sesssion a expirée",
      });
    } else {
      toast.error("Erreur", {
        description:
          (data as { message: string }).message || "Une erreur est survenue",
      });
    }
  } catch (error) {
    toast.error("Erreur", {
      description: `Impossible de récupèrer les paiement de frais académiques`,
    });
  } finally {
    isPending.value = false;
  }
};

const onPage = async (page: number) => {
  numberPage.value = page;
  await router.push(`/teacher?page=${page}`);
  await fetchPaidAcademics();
};

watch(
  () => route.query.page,
  (newPage) => {
    const pageNumber = newPage ? parseInt(newPage as string) : 1;
    if (pageNumber !== numberPage.value) {
      numberPage.value = pageNumber;
      fetchPaidAcademics();
    }
  }
);

onMounted(() => {
  fetchPaidAcademics();
});
</script>

<template>
  <div class="container my-12">
    <GoBack back="/paid" />
  </div>

  <div class="container my-12" v-if="isPending">
    <div class="section-page-header">
      <h2 class="section-page-title">Paiement de frais académique</h2>
    </div>

    <LoaderContainer :is-card="true" />
  </div>

  <div
    class="container my-12"
    v-if="!isPending && feesAcademics && feesAcademics.data.length === 0"
  >
    <div class="section-page-header">
      <h2 class="section-page-title">Paiement de frais académique</h2>
    </div>
    <p>Pas de paiement de frais académique</p>
  </div>

  <div
    class="container my-12"
    v-if="feesAcademics && feesAcademics.data.length > 0"
  >
    <div class="section-page-header">
      <h2 class="section-page-title">paiement de frais académique</h2>
    </div>

    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Montant</TableHead>
          <TableHead>Promotion</TableHead>
          <TableHead>Année académique</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Création</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow
          v-for="feesAcademic in feesAcademics.data"
          :key="feesAcademic.id"
        >
          <TableCell> {{ feesAcademic.academic.amount }}$ </TableCell>
          <TableCell>
            {{ feesAcademic.academic.level.name }}
          </TableCell>
          <TableCell>
            {{ feesAcademic.academic.year.name }}
          </TableCell>
          <TableCell>
            <Badge :variant="feesAcademic.is_paid ? 'outline' : 'destructive'">
              {{ feesAcademic.is_paid ? "payé" : "pas encore payé" }}
            </Badge>
          </TableCell>
          <TableCell>
            {{ ago(feesAcademic.created_at) }}
          </TableCell>
          <TableCell>
            <div class="flex items-center justify-end">
              <Button variant="secondary">
                <NuxtLink :href="`/fees-academic/${feesAcademic.academic.id}`">
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
