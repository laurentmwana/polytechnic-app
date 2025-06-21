<script setup lang="ts">
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useAuth } from "@/composables/useAuth";
import type { StateActionModel, ValidatorErrorProps } from "@/types/util";
import { toast } from "vue-sonner";
import TeacherForm from "@/components/features/teacher/TeacherForm.vue";
import type { SchemaTeacherFormInfer } from "@/definitions/teacher";
import { createTeacher } from "@/services/teacher";
import { UserPlus } from "lucide-vue-next";

useHead({
  title: "Création d'un professeur - Polytechnic Application",
});

definePageMeta({
  layout: "admin",
  middleware: ["admin", "verified"],
});

const validator = ref<ValidatorErrorProps | null>(null);
const auth = useAuth();
const router = useRouter();
const isLoading = ref<boolean>(false);

const onSubmit = async (values: SchemaTeacherFormInfer) => {
  try {
    isLoading.value = true;
    validator.value = null;

    if (!auth.session.value?.accessToken) {
      throw new Error("Utilisateur non authentifié");
    }

    const response = await createTeacher(
      auth.session.value.accessToken,
      values
    );
    const data = await response.json();

    if (response.ok) {
      const state = (data as StateActionModel).state;
      if (state) {
        toast.success("Création", {
          description: "Le professeur a été créé avec succès.",
        });
        router.push("/admin/teacher");
      } else {
        toast.error("Échec", {
          description: "Nous n'avons pas pu créer le professeur.",
        });
      }
    } else if (response.status === 422) {
      validator.value = data as ValidatorErrorProps;
    } else if (response.status === 401) {
      toast.warning("Session expirée", {
        description: "Merci de vous reconnecter.",
      });
      auth.logout();
    } else {
      toast.error("Erreur", {
        description: (data as { message: string }).message || "Une erreur est survenue.",
      });
    }
  } catch (error) {
    toast.error("Erreur", {
      description: "Impossible d'enregistrer le professeur.",
    });
  } finally {
    isLoading.value = false;
  }
};
</script>

<template>
  <div class="space-y-6">
    <GoBack back="/admin/teacher" />

    <div class="w-full">
      <Card>
        <CardHeader>
          <CardTitle class="flex items-center gap-2">
            <UserPlus class="w-5 h-5" />
            Création d'un professeur
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div class="max-w-2xl space-y-4">
            <ValidatorError :validator="validator" />
            <TeacherForm :onSubmit="onSubmit" :loading="isLoading" />
          </div>
        </CardContent>
      </Card>
    </div>
  </div>
</template>
