<script setup lang="ts">
import { toast } from "vue-sonner";
import { ago } from "../../lib/date-time";
import { getShowCourse, getShowTeacher } from "../../services/other";
import type { CourseModel, TeacherModel } from "../../types/model";
import { Calendar, Mail, User, UserCheck } from "lucide-vue-next";

useHead({
  title: "En savoir plus sur un cours - Polytechnic Application",
});
definePageMeta({
  layout: "default",
});

const route = useRoute();

const courseId = parseInt(route.params.id as string);

if (!courseId || isNaN(courseId)) {
  throw createError({
    statusCode: 400,
    statusMessage:
      "L'ID du cours est requis et doit être un nombre valide",
  });
}

const isPending = ref<boolean>(true);
const course = ref<CourseModel>();

const fetchTeacher = async () => {
  try {
    isPending.value = true;

    const response = await getShowCourse(courseId);
    const data = await response.json();

    if (response.ok) {
      course.value = (data as { data: CourseModel }).data;
    } else {
      toast.error("Erreur", {
        description:
          (data as { message: string }).message || "Une erreur est survenue",
      });
    }
  } catch (error) {
    toast.error("Erreur", {
      description: `Impossible de récupèrer les courss`,
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
    <GoBack back="/course" />
  </div>

  <div class="container my-12" v-if="isPending">
    <div class="section-page-header">
      <h2 class="section-page-title">
        En savoir plus sur le cours #{{ courseId }}
      </h2>
    </div>

    <LoaderContainer :is-card="true" />
  </div>

  <div class="container my-12" v-if="course">
    <div class="section-page-header">
      <h2 class="section-page-title">
        En savoir plus sur le cours #{{ courseId }}
      </h2>
    </div>
    

    <div class="grid gap-6 md:grid-cols-2">
      <!-- Informations principales -->
      <Card>
        <CardHeader>
          <CardTitle class="flex items-center gap-2">
            <User class="h-5 w-5" />
            Informations sur le course #{{ courseId }}
          </CardTitle>
        </CardHeader>
        <CardContent class="space-y-4">
          <div class="grid gap-4">
            <div class="flex items-center gap-3">
              <User class="h-4 w-4 text-muted-foreground" />
              <div>
                <p class="text-sm font-medium">Nom du cours</p>
                <p class="text-sm text-muted-foreground">
                  {{ course.name }}
                </p>
              </div>
            </div>

            <div class="flex items-center gap-3">
              <Mail class="h-4 w-4 text-muted-foreground" />
              <div>
                <p class="text-sm font-medium">Professeur</p>
                <p class="text-sm text-muted-foreground">
                  {{ course.teacher.name }} {{ course.teacher.firstname }}
                </p>
              </div>
            </div>

            <div class="flex items-center gap-3">
              <UserCheck class="h-4 w-4 text-muted-foreground" />
              <div>
                <p class="text-sm font-medium">Promotion</p>
                <p class="text-sm text-muted-foreground">
                  {{ course.level.name }}  {{ course.level.alias }}
                </p>
              </div>
            </div>


            <div class="flex items-center gap-3">
              <Calendar class="h-4 w-4 text-muted-foreground" />
              <div>
                <p class="text-sm font-medium">Créé le</p>
                <p class="text-sm text-muted-foreground">
                  {{ ago(course.created_at) }}
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  </div>
</template>
