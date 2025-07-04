<script setup lang="ts">
import { ref, onMounted } from "vue";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/composables/useAuth";
import { ago } from "@/lib/date-time";
import { getItemCourse } from "@/services/course";
import type { CourseModel } from "@/types/model";
import { Calendar, Tag, BookOpen, UserCheck, User } from "lucide-vue-next";
import { toast } from "vue-sonner";
import LoaderContainer from "@/components/LoaderContainer.vue";

useHead({
  title: "Détails cours - Polytechnic Application",
});

definePageMeta({
  layout: "admin",
  middleware: ["admin", "verified"],
});

interface ModelDataResponse {
  data: CourseModel;
}

const auth = useAuth();
const route = useRoute();

const course = ref<CourseModel | null>(null);
const isLoading = ref(true);

const courseId = parseInt(route.params.id as string);
if (!courseId || isNaN(courseId)) {
  throw createError({
    statusCode: 400,
    statusMessage: "L'ID du cours est requis et doit être un nombre valide",
  });
}

const fetchCourse = async () => {
  try {
    isLoading.value = true;

    if (!auth.session.value?.accessToken) {
      throw new Error("Utilisateur non authentifié");
    }

    const response = await getItemCourse(auth.session.value.accessToken, courseId);
    const data = await response.json();

    if (response.ok) {
      course.value = (data as ModelDataResponse).data;
    } else if (response.status === 401) {
      toast.warning("Session", {
        description: "Votre session a expiré, merci de vous reconnecter",
      });
      auth.logout();
    } else {
      toast.error("Erreur", {
        description: (data as { message: string }).message || "Une erreur est survenue",
      });
    }
  } catch (error) {
    toast.error("Erreur", {
      description: "Impossible de charger le cours",
    });
  } finally {
    isLoading.value = false;
  }
};

onMounted(fetchCourse);
</script>

<template>
  <div class="space-y-6">
    <!-- Header avec bouton retour -->
    <GoBack back="/admin/course" />

    <!-- Loader -->
    <LoaderContainer v-if="isLoading" :isCard="true" />

    <!-- Cours non trouvé -->
    <Card v-else-if="!course">
      <CardContent class="text-center py-12">
        <User class="h-12 w-12 mx-auto text-muted-foreground mb-4" />
        <p class="text-lg font-medium mb-2">Cours non trouvé</p>
        <p class="text-muted-foreground">
          Le cours avec l'ID {{ courseId }} n'existe pas.
        </p>
      </CardContent>
    </Card>

    <!-- Détails du cours -->
    <div v-else class="grid gap-6 md:grid-cols-2">
      <!-- Informations principales -->
      <Card>
        <CardHeader>
          <CardTitle class="flex items-center gap-2">
            <BookOpen class="h-5 w-5" />
            Informations du cours
          </CardTitle>
        </CardHeader>
        <CardContent class="space-y-4">
          <div class="grid gap-4">
            <div class="flex items-center gap-3">
              <Tag class="h-4 w-4 text-muted-foreground" />
              <div>
                <p class="text-sm font-medium">Nom du cours</p>
                <p class="text-sm text-muted-foreground">{{ course.name }}</p>
              </div>
            </div>

            <div class="flex items-center gap-3">
              <Tag class="h-4 w-4 text-muted-foreground" />
              <div>
                <p class="text-sm font-medium">Code</p>
                <p class="text-sm text-muted-foreground">{{ course.code }}</p>
              </div>
            </div>

            <div class="flex items-center gap-3">
              <BookOpen class="h-4 w-4 text-muted-foreground" />
              <div>
                <p class="text-sm font-medium">Crédit(s)</p>
                <p class="text-sm text-muted-foreground">{{ course.credits }}</p>
              </div>
            </div>

            <div class="flex items-center gap-3">
              <UserCheck class="h-4 w-4 text-muted-foreground" />
              <div>
                <p class="text-sm font-medium">Promotion</p>
                <p class="text-sm text-muted-foreground">
                  {{ course.level.name }} [{{ course.level.programme }}]
                </p>
              </div>
            </div>

            <div class="flex items-center gap-3">
              <Calendar class="h-4 w-4 text-muted-foreground" />
              <div>
                <p class="text-sm font-medium">Créé le</p>
                <p class="text-sm text-muted-foreground">{{ ago(course.created_at) }}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  </div>
</template>
