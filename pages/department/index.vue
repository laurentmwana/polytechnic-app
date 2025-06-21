<script setup lang="ts">
import DepartmentCard from "@/components/features/department/DepartmentCard.vue";
import { getCollectionDepartments } from "@/services/other";
import type { DepartmentModel } from "@/types/model";
import { toast } from "vue-sonner";
import type { PaginatedResponse } from "@/types/paginate";

useHead({
  title: "départements - Polytechnic Application",
});
definePageMeta({
  layout: "default",
});

type DepartmentPaginateProps = PaginatedResponse<DepartmentModel[]>;

const isPending = ref<boolean>(true);
const departments = ref<DepartmentPaginateProps>();
const router = useRouter();
const route = useRoute();

const numberPage = ref<number>(
  route.query.page ? parseInt(route.query.page as string) : 1
);

const fetchDepartments = async () => {
  try {
    if (!isPending.value) {
      isPending.value = true;
    }

    const response = await getCollectionDepartments(numberPage.value);
    const data = await response.json();

    if (response.ok) {
      departments.value = data as DepartmentPaginateProps;
    } else {
      toast.error("Erreur", {
        description:
          (data as { message: string }).message || "Une erreur est survenue",
      });
    }
  } catch (error) {
    toast.error("Erreur", {
      description: `Impossible de récupèrer les départments`,
    });
  } finally {
    isPending.value = false;
  }
};

const onPage = async (page: number) => {
  numberPage.value = page;
  await router.push(`/department?page=${page}`);
  await fetchDepartments();
};

watch(
  () => route.query.page,
  (newPage) => {
    const pageNumber = newPage ? parseInt(newPage as string) : 1;
    if (pageNumber !== numberPage.value) {
      numberPage.value = pageNumber;
      fetchDepartments();
    }
  }
);

onMounted(() => {
  fetchDepartments();
});
</script>

<template>
  <div class="container my-12" v-if="isPending">
    <div class="section-page-header">
      <h2 class="section-page-title">Départements</h2>
    </div>

    <LoaderContainer :is-card="true" />
  </div>

  <div
    class="container my-12"
    v-if="
      (!departments || (departments && departments.data.length === 0)) &&
      !isPending
    "
  >
    <div class="section-page-header">
      <h2 class="section-page-title">Départements</h2>
    </div>
    <p>Pas de départements</p>
  </div>

  <div class="container my-12" v-if="departments">
    <div class="section-page-header">
      <h2 class="section-page-title">Départements</h2>
    </div>

    <div
      class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 justify-center"
    >
      <DepartmentCard
        v-for="department in departments.data"
        :department="department"
        :key="department.id"
      />
    </div>

    <!-- Pagination -->
    <Pagination :onPage="onPage" :meta="departments" />
  </div>
</template>
