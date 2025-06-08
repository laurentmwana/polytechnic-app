<script setup lang="ts">
import { ago } from "@/lib/date-time";
import { getShowAcademic } from "@/services/other";
import type { FeesAcademicModel } from "@/types/model";
import { Calendar, User, UserCheck } from "lucide-vue-next";
import { toast } from "vue-sonner";

useHead({
  title: "En savoir plus sur un frais académique - Polytechnic Application",
});
definePageMeta({
  layout: "default",
});

const route = useRoute();

const feesId = parseInt(route.params.id as string);

if (!feesId || isNaN(feesId)) {
  throw createError({
    statusCode: 400,
    statusMessage:
      "L'ID du frais académique est requis et doit être un nombre valide",
  });
}

const isPending = ref<boolean>(true);
const fees = ref<FeesAcademicModel>();

const fetchTeacher = async () => {
  try {
    isPending.value = true;

    const response = await getShowAcademic(feesId);
    const data = await response.json();

    if (response.ok) {
      fees.value = (data as { data: FeesAcademicModel }).data;
    } else {
      toast.error("Erreur", {
        description:
          (data as { message: string }).message || "Une erreur est survenue",
      });
    }
  } catch (error) {
    toast.error("Erreur", {
      description: `Impossible de récupèrer les frais académiques`,
    });
  } finally {
    isPending.value = false;
  }
};

onMounted(() => {
  fetchTeacher();
});
</script>

<template>
  <div class="container my-12">
    <GoBack back="/fees-academic" />
  </div>

  <div class="container my-12" v-if="isPending">
    <div class="section-page-header">
      <h2 class="section-page-title">
        En savoir plus sur le frais académique #{{ feesId }}
      </h2>
    </div>

    <LoaderContainer :is-card="true" />
  </div>

  <div class="container my-12" v-if="fees">
    <div class="section-page-header">
      <h2 class="section-page-title">
        En savoir plus sur le frais académique #{{ feesId }}
      </h2>
    </div>

    <div class="grid gap-6 md:grid-cols-2">
      <!-- Informations principales -->
      <Card>
        <CardHeader>
          <CardTitle class="flex items-center gap-2">
            <User class="h-5 w-5" />
            Informations sur le frais académique #{{ feesId }}
          </CardTitle>
          <CardDescription>
            Détails du frais académique pour l'année {{ fees.year.name }}
          </CardDescription>
        </CardHeader>
        <CardContent class="space-y-4">
          <div class="grid gap-4">
            <div class="flex items-center gap-3">
              <User class="h-4 w-4 text-muted-foreground" />
              <div>
                <p class="text-sm font-medium">Année académique</p>
                <p class="text-sm text-muted-foreground">
                  {{ fees.year.name }}
                </p>
              </div>
            </div>

            <div class="flex items-center gap-3">
              <UserCheck class="h-4 w-4 text-muted-foreground" />
              <div>
                <p class="text-sm font-medium">Montant</p>
                <p class="text-sm text-muted-foreground">
                  {{ fees.amount }}$
                </p>
              </div>
            </div>

            <div class="flex items-center gap-3">
              <Calendar class="h-4 w-4 text-muted-foreground" />
              <div>
                <p class="text-sm font-medium">Créé le</p>
                <p class="text-sm text-muted-foreground">
                  {{ ago(fees.created_at) }}
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  </div>
</template>
