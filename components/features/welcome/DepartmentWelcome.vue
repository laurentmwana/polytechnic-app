<script setup lang="ts">
import { getDepartmentLimit } from "@/services/other";
import type { DepartmentModel } from "@/types/model";
import { toast } from "vue-sonner";
import DepartmentCard from "../department/DepartmentCard.vue";
import DepartmentLoader from "../department/DepartmentLoader.vue";

const isPending = ref<boolean>(true);
const departments = ref<DepartmentModel[]>([]);

const fetchDepartments = async () => {
  try {
    isPending.value = true;

    const response = await getDepartmentLimit(2);
    const data = await response.json();

    if (response.ok) {
      departments.value = (data as { data: DepartmentModel[] }).data;
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

onMounted(() => {
  fetchDepartments();
});
</script>

<template>
  <div class="container my-12" v-if="isPending">
    <DepartmentLoader />
  </div>
  <div class="container my-12" v-if="departments.length > 0">
    <div class="section-header">
      <h2 class="section-title">Nos Départements</h2>
      <p class="section-subtitle">
        Nous regroupons plusieurs départements dynamiques, chacun dédié à un
        domaine d&#39;expertise précis.
      </p>
    </div>

    <div
      class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 justify-center"
    >
      <DepartmentCard
        v-for="department in departments"
        :department="department"
        :key="department.id"
      />
    </div>
  </div>
</template>
