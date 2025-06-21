<script setup lang="ts">
import { CalendarDays } from "lucide-vue-next";
import { toast } from "vue-sonner";
import { ago } from "@/lib/date-time";
import { getShowDepartment } from "@/services/other";
import type { DepartmentModel } from "@/types/model";

useHead({
  title: "En savoir plus sur un département - Polytechnic Application",
});
definePageMeta({
  layout: "default",
});

const route = useRoute();

const departmentId = parseInt(route.params.id as string);

if (!departmentId || isNaN(departmentId)) {
  throw createError({
    statusCode: 400,
    statusMessage:
      "L'ID du département est requis et doit être un nombre valide",
  });
}

const isPending = ref<boolean>(true);
const department = ref<DepartmentModel>();

const fetchDepartment = async () => {
  try {
    if (!isPending.value) {
      isPending.value = true;
    }

    const response = await getShowDepartment(departmentId);
    const data = await response.json();

    if (response.ok) {
      department.value = (data as { data: DepartmentModel }).data;
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

onMounted(fetchDepartment);
</script>

<template>
  <div class="container my-12">
    <GoBack back="/department" />
  </div>

  <div class="container my-12" v-if="isPending">
    <div class="section-page-header">
      <h2 class="section-page-title">
        En savoir plus sur le département #{{ departmentId }}
      </h2>
    </div>

    <LoaderContainer :is-card="true" />
  </div>

  <div class="container my-12" v-if="department">
    <div class="section-page-header">
      <h2 class="section-page-title">
        En savoir plus sur le département #{{ departmentId }}
      </h2>
    </div>

    <div class="space-y-5">
      <Card class="border-t-2">
        <CardHeader>
          <CardTitle class="text-2xl md:text-3xl">
            {{ department.name }}
          </CardTitle>
          <CardDescription class="text-base">
            {{ department.alias }}
          </CardDescription>
        </CardHeader>
        <CardFooter
          class="border-t pt-4 text-sm text-muted-foreground flex flex-wrap gap-4"
        >
          <div class="flex items-center gap-1">
            <CalendarDays class="h-4 w-4" />
            <span>Mis à jour : {{ ago(department.updated_at) }}</span>
          </div>
        </CardFooter>
      </Card>

      <div class="section-page-header">
        <h2 class="section-page-title">Les promotions</h2>
      </div>
      <div>
        <Accordion
          type="single"
          collapsible
          class="grid gris-cols-1 md:grid-cols-2 gap-4 w-full"
        >
          <AccordionItem
            v-for="level in department.levels"
            class="mb-5 rounded-md border px-3 shadow-sm"
            :key="level.id"
            :value="level.id.toString()"
          >
            <AccordionTrigger class="text-base font-medium">
              {{ level.alias }}
            </AccordionTrigger>
            <AccordionContent>{{ level.name }}</AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </div>
  </div>
</template>
