<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useRoute } from "vue-router";
import { createError } from "h3";
import { toast } from "vue-sonner";

import { ago } from "@/lib/date-time";
import { getShowCourse } from "@/services/other";
import type { CourseModel } from "@/types/model";
import { Calendar, BookOpen, GraduationCap, User } from "lucide-vue-next";

import GoBack from "@/components/GoBack.vue";
import LoaderContainer from "@/components/LoaderContainer.vue";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";

useHead({
  title: "Détails d’un cours - Polytechnic Application",
});

definePageMeta({
  layout: "default",
});

const route = useRoute();
const courseId = parseInt(route.params.id as string, 10);

if (!courseId || isNaN(courseId)) {
  throw createError({
    statusCode: 400,
    statusMessage: "L'identifiant du cours est requis et doit être un nombre valide.",
  });
}

const isPending = ref(true);
const course = ref<CourseModel>();

const fetchCourse = async () => {
  try {
    isPending.value = true;
    const response = await getShowCourse(courseId);
    const data = await response.json();

    if (response.ok) {
      course.value = (data as { data: CourseModel }).data;
    } else {
      toast.error("Erreur", {
        description:
          (data as { message?: string }).message || "Une erreur est survenue.",
      });
    }
  } catch (error) {
    toast.error("Erreur", {
      description: "Impossible de récupérer les données du cours.",
    });
  } finally {
    isPending.value = false;
  }
};

onMounted(fetchCourse);
</script>

<template>
  <div class="container my-12 space-y-8">
    <GoBack back="/course" />

    <div class="section-page-header">
      <h2 class="section-page-title text-2xl md:text-3xl font-semibold text-primary">
        Détails du cours #{{ courseId }}
      </h2>
      <p class="text-muted-foreground mt-2">
        Informations détaillées sur ce cours, le professeur, et la promotion associée.
      </p>
    </div>

    <LoaderContainer v-if="isPending" :is-card="true" />

    <div v-else-if="course" class="grid md:grid-cols-2 gap-6">
      <Card class="border bg-white dark:bg-muted rounded-lg shadow-sm dark:shadow-md">
        <CardHeader>
          <CardTitle class="flex items-center gap-2 text-xl text-blue-700 dark:text-blue-400">
            <BookOpen class="h-5 w-5" />
            Informations sur le cours
          </CardTitle>
        </CardHeader>

        <CardContent class="space-y-5">
          <div class="flex items-start gap-4">
            <BookOpen class="text-muted-foreground h-5 w-5 mt-1" />
            <div>
              <p class="text-sm font-medium">Nom du cours</p>
              <p class="text-muted-foreground text-sm">{{ course.name }}</p>
            </div>
          </div>

          <div class="flex items-start gap-4">
            <User class="text-muted-foreground h-5 w-5 mt-1" />
            <div>
              <p class="text-sm font-medium">Professeur</p>
              <p class="text-muted-foreground text-sm">
                {{ course.teacher.name }} {{ course.teacher.firstname }}
              </p>
            </div>
          </div>

          <div class="flex items-start gap-4">
            <GraduationCap class="text-muted-foreground h-5 w-5 mt-1" />
            <div>
              <p class="text-sm font-medium">Promotion</p>
              <p class="text-muted-foreground text-sm">
                {{ course.level.name }} — {{ course.level.alias }}
              </p>
            </div>
          </div>

          <div class="flex items-start gap-4">
            <Calendar class="text-muted-foreground h-5 w-5 mt-1" />
            <div>
              <p class="text-sm font-medium">Créé le</p>
              <p class="text-muted-foreground text-sm">
                {{ ago(course.created_at) }}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>

    <div v-else class="text-center text-muted-foreground py-10">
      Impossible d’afficher les informations de ce cours.
    </div>
  </div>
</template>
