<script setup lang="ts">
import TeacherForm from "@/components/features/teacher/TeacherForm.vue";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import LoaderContainer from "@/components/LoaderContainer.vue";
import { useAuth } from "@/composables/useAuth";
import type { SchemaTeacherFormInfer } from "@/definitions/teacher";
import { editTeacher, getItemTeacher } from "@/services/teacher";
import type { TeacherModel } from "@/types/model";
import type { StateActionModel, ValidatorErrorProps } from "@/types/util";
import { UserCog } from "lucide-vue-next";
import { toast } from "vue-sonner";

useHead({
  title: "Édition d'un professeur - Polytechnic Application",
});

definePageMeta({
  layout: "admin",
  middleware: ["admin", "verified"],
});

interface ModelDataResponse {
  data: TeacherModel;
}

const auth = useAuth();
const route = useRoute();
const router = useRouter();

const teacher = ref<TeacherModel | null>(null);
const isLoading = ref<boolean>(true);
const isEdit = ref<boolean>(false);
const validator = ref<ValidatorErrorProps | null>(null);

const teacherId = parseInt(route.params.id as string);

if (!teacherId || isNaN(teacherId)) {
  throw createError({
    statusCode: 400,
    statusMessage: "L'ID du professeur est requis et doit être un nombre valide",
  });
}

const fetchTeacher = async () => {
  try {
    isLoading.value = true;

    if (!auth.session.value?.accessToken) {
      throw new Error("Utilisateur non authentifié");
    }

    const response = await getItemTeacher(
      auth.session.value.accessToken,
      teacherId
    );
    const data = await response.json();

    if (response.ok) {
      teacher.value = (data as ModelDataResponse).data;
    } else if (response.status === 401) {
      toast.warning("Session", {
        description: "Votre session a expiré, merci de vous reconnecter",
      });
      auth.logout();
    } else {
      toast.error("Erreur", {
        description:
          (data as { message: string }).message || "Une erreur est survenue",
      });
    }
  } catch (error) {
    toast.error("Erreur", {
      description: "Impossible de charger le professeur",
    });
  } finally {
    isLoading.value = false;
  }
};

const onSubmit = async (values: SchemaTeacherFormInfer) => {
  try {
    isEdit.value = true;
    validator.value = null;

    if (!auth.session.value?.accessToken) {
      throw new Error("Utilisateur non authentifié");
    }

    const response = await editTeacher(
      auth.session.value.accessToken,
      teacherId,
      values
    );
    const data = await response.json();

    if (response.ok) {
      const state = (data as StateActionModel).state;
      if (state) {
        toast.success("Édition", {
          description: `Les informations du professeur #${teacherId} ont été mises à jour`,
        });
        router.push("/admin/teacher");
      } else {
        toast.error("Échec", {
          description: "Impossible de modifier le professeur.",
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
        description:
          (data as { message: string }).message || "Une erreur est survenue",
      });
    }
  } catch (error) {
    toast.error("Erreur", {
      description: `Impossible d’éditer le professeur #${teacher.value?.id}`,
    });
  } finally {
    isEdit.value = false;
  }
};

onMounted(fetchTeacher);
</script>

<template>
  <div class="space-y-6">
    <GoBack back="/admin/teacher" />

    <!-- Loader -->
    <LoaderContainer v-if="isLoading" :isCard="true" />

    <!-- Professeur non trouvé -->
    <Card v-else-if="!teacher">
      <CardContent class="text-center py-12">
        <UserCog class="h-12 w-12 mx-auto text-muted-foreground mb-4" />
        <p class="text-lg font-medium mb-2">Professeur non trouvé</p>
        <p class="text-muted-foreground">
          Le professeur avec l'ID {{ teacherId }} n'existe pas.
        </p>
      </CardContent>
    </Card>

    <!-- Formulaire d'édition -->
    <div v-else class="w-full">
      <Card>
        <CardHeader>
          <CardTitle class="flex items-center gap-2">
            <UserCog class="w-5 h-5" />
            Éditer le professeur #{{ teacher.id }}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div class="max-w-2xl space-y-5">
            <ValidatorError :validator="validator" />
            <TeacherForm :teacher="teacher" :onSubmit="onSubmit" :loading="isEdit" />
          </div>
        </CardContent>
      </Card>
    </div>
  </div>
</template>
