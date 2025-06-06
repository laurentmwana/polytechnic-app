<script setup lang="ts">
import LevelForm from "@/components/features/level/LevelForm.vue";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useAuth } from "@/composables/useAuth";
import type { SchemaLevelFormInfer } from "@/definitions/level";
import { createLevel } from "@/services/level";
import type { StateActionModel, ValidatorErrorProps } from "@/types/util";
import { toast } from "vue-sonner";

useHead({
  title: "Création d'une promotion - Polytechnic Application",
});

definePageMeta({
  layout: "admin",
  middleware: ["admin"],
});
const validator = ref<ValidatorErrorProps | null>(null);

const auth = useAuth();
const router = useRouter();

const isLoading = ref<boolean>(true);

const onSubmit = async (values: SchemaLevelFormInfer) => {
  try {
    isLoading.value = true;
    validator.value = null;

    if (!auth.session.value?.accessToken) {
      throw new Error("utilisateur non authentifié");
    }

    const response = await createLevel(auth.session.value.accessToken, values);
    const data = await response.json();

    if (response.ok) {
      const state = (data as StateActionModel).state;
      if (state) {
        toast.success("Création", {
          description: `Une promotion a été créée`,
        });

        router.push("/admin/level");
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
      description: "Impossible de créer une promotion, merci de réessayer (:",
    });
  }
};
</script>

<template>
  <div class="space-y-6">
    <GoBack back="/admin/level" />

    <div class="w-full">
      <Card>
        <CardHeader>
          <CardTitle class="flex items-center gap-2">
            Création d'une promotion
          </CardTitle>
          <CardDescription> </CardDescription>
        </CardHeader>
        <CardContent>
          <div class="max-w-2xl space-y-4">
            <ValidatorError :validator="validator" />
            <LevelForm :onSubmit="onSubmit" />
          </div>
        </CardContent>
      </Card>
    </div>
  </div>
</template>
