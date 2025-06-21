<script setup lang="ts">
import { ref, onMounted } from "vue";
import CourseForm from "@/components/features/course/CourseForm.vue";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useAuth } from "@/composables/useAuth";
import type { SchemaCourseFormInfer } from "@/definitions/course";
import { editCourse, getItemCourse } from "@/services/course";
import type { CourseModel } from "@/types/model";
import type { StateActionModel, ValidatorErrorProps } from "@/types/util";
import { User } from "lucide-vue-next";
import { toast } from "vue-sonner";
import LoaderContainer from "@/components/LoaderContainer.vue";

useHead({
  title: "Édition d'un cours - Polytechnic Application",
});

definePageMeta({
  layout: "admin",
  middleware: ["admin", "verified"],
});

interface ModelResponse {
  data: CourseModel;
}

const auth = useAuth();
const route = useRoute();
const router = useRouter();

const course = ref<CourseModel | null>(null);
const isLoading = ref(true);
const isEditing = ref(false);
const validator = ref<ValidatorErrorProps | null>(null);

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
      course.value = (data as ModelResponse).data;
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

const onSubmit = async (values: SchemaCourseFormInfer) => {
  try {
    isEditing.value = true;
    validator.value = null;

    if (!auth.session.value?.accessToken) {
      throw new Error("Utilisateur non authentifié");
    }

    const response = await editCourse(auth.session.value.accessToken, courseId, values);
    const data = await response.json();

    if (response.ok) {
      const state = (data as StateActionModel).state;
      if (state) {
        toast.success("Édition", {
          description: `Les informations du cours #${courseId} ont été modifiées`,
        });
        router.push("/admin/course");
      } else {
        toast.error("Édition", {
          description: "Nous n'avons pas pu effectuer cette action",
        });
      }
    } else if (response.status === 422) {
      validator.value = data as ValidatorErrorProps;
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
      description: `Impossible d'éditer le cours #${courseId}`,
    });
  } finally {
    isEditing.value = false;
  }
};

onMounted(fetchCourse);
</script>

<template>
  <div class="space-y-6">
    <!-- Bouton retour -->
    <GoBack back="/admin/course" />

    <!-- Loader -->
    <LoaderContainer v-if="isLoading" :isCard="true" />

    <!-- Cours non trouvé -->
    <Card v-else-if="!course">
      <CardContent class="text-center py-12">
        <User class="h-12 w-12 mx-auto text-muted-foreground mb-4" />
        <p class="text-lg font-medium mb-2">Cours non trouvé</p>
        <p class="text-muted-foreground">Le cours avec l'ID {{ courseId }} n'existe pas.</p>
      </CardContent>
    </Card>

    <!-- Formulaire d'édition -->
    <div v-else class="w-full">
      <Card>
        <CardHeader>
          <CardTitle class="flex items-center gap-2">
            Éditer le cours #{{ course.id }}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div class="max-w-2xl space-y-5">
            <ValidatorError :validator="validator" />
            <CourseForm :course="course" :onSubmit="onSubmit" :isLoading="isEditing" />
          </div>
        </CardContent>
      </Card>
    </div>
  </div>
</template>
