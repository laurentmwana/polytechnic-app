<script setup lang="ts">
import StudentExcelForm from "@/components/features/student/StudentExcelForm.vue";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useAuth } from "@/composables/useAuth";
import { createStudentExcell } from "@/services/student";
import type { UserModel } from "@/types/model";
import type { StateActionModel, ValidatorErrorProps } from "@/types/util";
import { toast } from "vue-sonner";

useHead({
  title: "Création d'étudiants par fichier excel - Polytechnic Application",
});

definePageMeta({
  layout: "admin",
  middleware: ["admin", "verified"],
});
const validator = ref<ValidatorErrorProps | null>(null);

const auth = useAuth();
const router = useRouter();

const user = ref<UserModel | null>(null);
const isLoading = ref<boolean>(true);

const onSubmit = async (file: File) => {
  try {
    isLoading.value = true;
    validator.value = null;

    if (!auth.session.value?.accessToken) {
      throw new Error("utilisateur non authentifié");
    }

    const formData = new FormData();

    formData.append("excel", file, file.name);

    const response = await createStudentExcell(
      auth.session.value.accessToken,
      formData
    );
    const data = await response.json();

    if (response.ok) {
      const state = (data as StateActionModel).state;
      if (state) {
        toast.success("Création", {
          description: `Un étudiant a été créé`,
        });

        router.push("/admin/student");
      } else {
        toast.error("Création", {
          description: `Nous n'avons pas pu effectuer cette action`,
        });
      }
    } else if (response.status === 422) {
      validator.value = data as ValidatorErrorProps;
    } else if (response.status == 401) {
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
      description: `Impossible d'editer l'étudiant #${user.value?.id}`,
    });
  }
};
</script>

<template>
  <div class="space-y-6">
    <GoBack back="/admin/student" />

    <div class="w-full">
      <Card>
        <CardHeader>
          <CardTitle class="flex items-center gap-2">
            Création d'étudiants par fichier Excel
          </CardTitle>
          <CardDescription> </CardDescription>
        </CardHeader>
        <CardContent>
          <div class="max-w-2xl space-y-4">
            <ValidatorError :validator="validator" />
            <StudentExcelForm :onSubmit="onSubmit" />
          </div>
        </CardContent>
      </Card>
    </div>
  </div>
</template>
