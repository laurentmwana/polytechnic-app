<script setup lang="ts">
import StudentForm from "@/components/features/student/StudentForm.vue";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import LoaderContainer from "@/components/LoaderContainer.vue";
import { useAuth } from "@/composables/useAuth";
import type { SchemaStudentFormInfer } from "@/definitions/student";
import { editStudent, getItemStudent } from "@/services/student";
import type { StudentModel } from "@/types/model";
import type { StateActionModel, ValidatorErrorProps } from "@/types/util";
import { User } from "lucide-vue-next";
import { toast } from "vue-sonner";

useHead({
  title: "Édition d'un étudiant - Polytechnic Application",
});

definePageMeta({
  layout: "admin",
  middleware: ["admin", "verified"],
});

interface ModelDataResponse {
  data: StudentModel;
}

const auth = useAuth();
const route = useRoute();
const router = useRouter();

const student = ref<StudentModel | null>(null);
const isLoading = ref(true);
const isEdit = ref(false);
const validator = ref<ValidatorErrorProps | null>(null);

const studentId = parseInt(route.params.id as string);
if (!studentId || isNaN(studentId)) {
  throw createError({
    statusCode: 400,
    statusMessage: "L'ID de l'étudiant est requis et doit être un nombre valide",
  });
}

const fetchStudent = async () => {
  try {
    isLoading.value = true;

    if (!auth.session.value?.accessToken) {
      throw new Error("Utilisateur non authentifié");
    }

    const response = await getItemStudent(auth.session.value.accessToken, studentId);
    const data = await response.json();

    if (response.ok) {
      student.value = (data as ModelDataResponse).data;
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
      description: "Impossible de charger l'étudiant",
    });
  } finally {
    isLoading.value = false;
  }
};

const onSubmit = async (values: SchemaStudentFormInfer) => {
  try {
    isEdit.value = true;
    validator.value = null;

    if (!auth.session.value?.accessToken) {
      throw new Error("Utilisateur non authentifié");
    }

    const response = await editStudent(auth.session.value.accessToken, studentId, values);
    const data = await response.json();

    if (response.ok) {
      const state = (data as StateActionModel).state;
      if (state) {
        toast.success("Édition", {
          description: `Les informations de l'étudiant #${studentId} ont été modifiées`,
        });
        router.push("/admin/student");
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
      description: `Impossible d'éditer l'étudiant #${student.value?.id}`,
    });
    console.error(error);
  } finally {
    isEdit.value = false;
  }
};

onMounted(fetchStudent);
</script>

<template>
  <div class="space-y-6">
    <!-- Bouton retour -->
    <GoBack back="/admin/student" />

    <!-- Loader -->
    <LoaderContainer v-if="isLoading" :isCard="true" />

    <!-- Étudiant non trouvé -->
    <Card v-else-if="!student">
      <CardContent class="text-center py-12">
        <User class="h-12 w-12 mx-auto text-muted-foreground mb-4" />
        <p class="text-lg font-medium mb-2">Étudiant non trouvé</p>
        <p class="text-muted-foreground">
          L'étudiant avec l'ID {{ studentId }} n'existe pas.
        </p>
      </CardContent>
    </Card>

    <!-- Formulaire édition étudiant -->
    <div v-else class="w-full">
      <Card>
        <CardHeader>
          <CardTitle class="flex items-center gap-2">
            Éditer l'étudiant #{{ student.id }}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div class="max-w-2xl space-y-5">
            <ValidatorError :validator="validator" />
            <StudentForm :student="student" :onSubmit="onSubmit" :loading="isEdit" />
          </div>
        </CardContent>
      </Card>
    </div>
  </div>
</template>
