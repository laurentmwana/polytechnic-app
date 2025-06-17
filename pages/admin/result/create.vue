<script setup lang="ts">
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useAuth } from "@/composables/useAuth";
import type { UserModel } from "@/types/model";
import type { StateActionModel, ValidatorErrorProps } from "@/types/util";
import { toast } from "vue-sonner";
import ResultForm from "~/components/features/result/ResultForm.vue";
import type { SchemaResultFormInfer } from "~/definitions/result";
import { createResult } from "~/services/result";
import { ref } from "vue";
import { useRouter } from "vue-router";
import GoBack from "@/components/GoBack.vue";
import ValidatorError from "@/components/ValidatorError.vue";

useHead({
  title: "Création d'étudiants par fichier excel - Polytechnic Application",
});

definePageMeta({
  layout: "admin",
  middleware: ["admin"],
});

const validator = ref<ValidatorErrorProps | null>(null);

const auth = useAuth();
const router = useRouter();

const user = ref<UserModel | null>(null);
const isLoading = ref(false);

const onSubmit = async (values: SchemaResultFormInfer) => {
  try {
    isLoading.value = true;
    validator.value = null;

    if (!auth.session.value?.accessToken) {
      throw new Error("Utilisateur non authentifié");
    }

    const formData = new FormData();
    formData.append("file", values.file, values.file.name);
    formData.append("deliberation_id", values.deliberation_id);

    const response = await createResult(
      auth.session.value.accessToken,
      formData
    );
    const data = await response.json();

    if (response.ok) {
      const state = (data as StateActionModel).state;
      if (state) {
        toast.success("Publication réussie", {
          description: `Les résultats ont été publiés avec succès.`,
        });
        router.push("/admin/result");
      } else {
        toast.error("Échec de la publication", {
          description: `Nous n'avons pas pu effectuer cette action.`,
        });
      }
    } else if (response.status === 422) {
      validator.value = data as ValidatorErrorProps;
    } else if (response.status === 401) {
      toast.warning("Session expirée", {
        description: "Votre session a expiré, merci de vous reconnecter.",
      });
      auth.logout();
    } else {
      toast.error("Erreur", {
        description:
          (data as { message?: string }).message || "Une erreur est survenue.",
      });
    }
  } catch (error) {
    toast.error("Erreur", {
      description: `Impossible de publier les résultats.`,
    });
    console.error(error);
  } finally {
    isLoading.value = false;
  }
};
</script>

<template>
  <div class="space-y-6">
    <GoBack back="/admin/result" />

    <div class="w-full">
      <Card>
        <CardHeader>
          <CardTitle class="flex items-center gap-2">
            Publication de résultats
          </CardTitle>
          <CardDescription />
        </CardHeader>
        <CardContent>
          <div class="max-w-2xl space-y-4">
            <ValidatorError :validator="validator" />
            <ResultForm :onSubmit="onSubmit" />
          </div>
        </CardContent>
      </Card>
    </div>
  </div>
</template>
