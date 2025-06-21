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
  middleware: ["admin", "verified"],
});

const auth = useAuth();
const router = useRouter();

const validator = ref<ValidatorErrorProps | null>(null);
const isLoading = ref(false);

const onSubmit = async (values: SchemaLevelFormInfer) => {
  try {
    isLoading.value = true;
    validator.value = null;

    if (!auth.session.value?.accessToken) {
      throw new Error("Utilisateur non authentifié");
    }

    const response = await createLevel(auth.session.value.accessToken, values);
    const data = await response.json();

    if (response.ok) {
      const state = (data as StateActionModel).state;

      if (state) {
        toast.success("Création réussie", {
          description: "La promotion a été créée avec succès.",
        });

        router.push("/admin/level");
      } else {
        toast.error("Échec de la création", {
          description: "Impossible de créer la promotion. Veuillez réessayer.",
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
    toast.error("Erreur critique", {
      description: "Une erreur est survenue pendant la création. Merci de réessayer.",
    });
  } finally {
    isLoading.value = false;
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
          <CardDescription>
            Veuillez remplir les informations de la promotion.
          </CardDescription>
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
