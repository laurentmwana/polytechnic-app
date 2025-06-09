<script setup lang="ts">
import { ago } from "@/lib/date-time";
import type { PaidLaboratoryModel } from "@/types/model";
import type { PaginatedResponse } from "@/types/paginate";
import { toast } from "vue-sonner";
import { getAllPaidLabos } from "../../../services/paid";

useHead({
  title: "Paiement frais académique - Polytechnic Application",
});
definePageMeta({
  layout: "default",
});

type FeesLaboPaginateProps = PaginatedResponse<PaidLaboratoryModel[]>;

const auth = useAuth();
const isPending = ref<boolean>(true);
const feesLaboratories = ref<FeesLaboPaginateProps>();

const router = useRouter();
const route = useRoute();

const numberPage = ref<number>(
  route.query.page ? parseInt(route.query.page as string) : 1
);

const fetchPaidLaboratory = async () => {
  try {
    isPending.value = true;

    if (!auth.session.value?.accessToken) {
      throw new Error("utilisateur non authentifié");
    }

    const response = await getAllPaidLabos(
      auth.session.value.accessToken,
      numberPage.value
    );
    const data = await response.json();

    if (response.ok) {
      feesLaboratories.value = data as FeesLaboPaginateProps;
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
      description: `Impossible de récupèrer les paiement de frais laboratoires`,
    });
  } finally {
    isPending.value = false;
  }
};

const onPage = async (page: number) => {
  numberPage.value = page;
  await router.push(`/teacher?page=${page}`);
  await fetchPaidLaboratory();
};

watch(
  () => route.query.page,
  (newPage) => {
    const pageNumber = newPage ? parseInt(newPage as string) : 1;
    if (pageNumber !== numberPage.value) {
      numberPage.value = pageNumber;
      fetchPaidLaboratory();
    }
  }
);

onMounted(() => {
  fetchPaidLaboratory();
});
</script>

<template>
  <div class="container my-12">
    <GoBack back="/paid" />
  </div>
  <div class="container my-12" v-if="isPending">
    <div class="section-page-header">
      <h2 class="section-page-title">Paiement de frais laboratoire</h2>
    </div>

    <LoaderContainer :is-card="true" />
  </div>

  <div
    class="container my-12"
    v-if="!isPending && feesLaboratories && feesLaboratories.data.length === 0"
  >
    <div class="section-page-header">
      <h2 class="section-page-title">Paiement de frais laboratoire</h2>
    </div>
    <p>Pas de paiement de frais laboratoire</p>
  </div>

  <div
    class="container my-12"
    v-if="feesLaboratories && feesLaboratories.data.length > 0"
  >
    <div class="section-page-header">
      <h2 class="section-page-title">Paiement de frais laboratoire</h2>
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
          v-for="feesLaboratory in feesLaboratories.data"
          :key="feesLaboratory.id"
        >
          <TableCell> {{ feesLaboratory.laboratory.amount }}$ </TableCell>
          <TableCell>
            {{ feesLaboratory.laboratory.level.name }}
          </TableCell>
          <TableCell>
            {{ feesLaboratory.laboratory.year.name }}
          </TableCell>
          <TableCell>
            <Badge
              :variant="feesLaboratory.is_paid ? 'outline' : 'destructive'"
            >
              {{ feesLaboratory.is_paid ? "payé" : "pas encore payé" }}
            </Badge>
          </TableCell>
          <TableCell>
            {{ ago(feesLaboratory.created_at) }}
          </TableCell>
          <TableCell>
            <div class="flex items-center justify-end">
              <Button variant="secondary">
                <NuxtLink
                  :href="`/fees-laboratory/${feesLaboratory.laboratory.id}`"
                >
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
