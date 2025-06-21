<script setup lang="ts">
import { toast } from "vue-sonner";
import { ago } from "@/lib/date-time";
import { getShowTeacher } from "@/services/other";
import type { TeacherModel } from "@/types/model";
import { Calendar, Mail, User, UserCheck } from "lucide-vue-next";

useHead({
  title: "En savoir plus sur un professeur - Polytechnic Application",
});
definePageMeta({
  layout: "default",
});

const route = useRoute();
const teacherId = parseInt(route.params.id as string);

if (!teacherId || isNaN(teacherId)) {
  throw createError({
    statusCode: 400,
    statusMessage:
      "L'ID du professeur est requis et doit être un nombre valide",
  });
}

const isPending = ref<boolean>(true);
const teacher = ref<TeacherModel>();

const fetchTeacher = async () => {
  try {
    if (!isPending.value) {
      isPending.value = true;
    }

    const response = await getShowTeacher(teacherId);
    const data = await response.json();

    if (response.ok) {
      teacher.value = (data as { data: TeacherModel }).data;
    } else {
      toast.error("Erreur", {
        description:
          (data as { message: string }).message || "Une erreur est survenue",
      });
    }
  } catch (error) {
    toast.error("Erreur", {
      description: `Impossible de récupérer le professeur`,
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
    <GoBack back="/teacher" />
  </div>

  <div class="container my-12" v-if="isPending">
    <div class="section-page-header">
      <h2 class="section-page-title">
        En savoir plus sur le professeur #{{ teacherId }}
      </h2>
    </div>

    <LoaderContainer :is-card="true" />
  </div>

  <div class="container my-12" v-else-if="teacher">
    <div class="section-page-header">
      <h2 class="section-page-title">
        En savoir plus sur le professeur #{{ teacherId }}
      </h2>
    </div>

    <div class="grid gap-6 md:grid-cols-2">
      <!-- Informations principales -->
      <Card>
        <CardHeader>
          <CardTitle class="flex items-center gap-2">
            <User class="h-5 w-5" />
            Informations personnelles
          </CardTitle>
          <CardDescription>
            Détails du professeur {{ teacher.name }} {{ teacher.firstname }}
          </CardDescription>
        </CardHeader>
        <CardContent class="space-y-4">
          <div class="grid gap-4">
            <div class="flex items-center gap-3">
              <User class="h-4 w-4 text-muted-foreground" />
              <div>
                <p class="text-sm font-medium">Nom complet</p>
                <p class="text-sm text-muted-foreground">
                  {{ teacher.name }} {{ teacher.firstname }}
                </p>
              </div>
            </div>

            <div class="flex items-center gap-3">
              <Mail class="h-4 w-4 text-muted-foreground" />
              <div>
                <p class="text-sm font-medium">Téléphone</p>
                <p class="text-sm text-muted-foreground">
                  {{ teacher.phone }}
                </p>
              </div>
            </div>

            <div class="flex items-center gap-3">
              <UserCheck class="h-4 w-4 text-muted-foreground" />
              <div>
                <p class="text-sm font-medium">Genre</p>
                <p class="text-sm text-muted-foreground">
                  {{ teacher.gender }}
                </p>
              </div>
            </div>

            <div class="flex items-center gap-3">
              <UserCheck class="h-4 w-4 text-muted-foreground" />
              <div>
                <p class="text-sm font-medium">Département</p>
                <p class="text-sm text-muted-foreground">
                  {{ teacher.department.name }}
                </p>
              </div>
            </div>

            <div class="flex items-center gap-3">
              <Calendar class="h-4 w-4 text-muted-foreground" />
              <div>
                <p class="text-sm font-medium">Créé le</p>
                <p class="text-sm text-muted-foreground">
                  {{ ago(teacher.created_at) }}
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  </div>
</template>
