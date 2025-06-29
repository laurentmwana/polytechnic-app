<script setup lang="ts">
import ActualityForm from "@/components/features/actuality/ActualityForm.vue";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useAuth } from "@/composables/useAuth";
import type { SchemaActualityFormInfer } from "@/definitions/actuality";
import { createActuality } from "@/services/actuality";
import type { StateActionModel, ValidatorErrorProps } from "@/types/util";
import { toast } from "vue-sonner";

useHead({
  title: "Création d'une actualité - Polytechnic Application",
});

definePageMeta({
  layout: "admin",
  middleware: ["admin", "verified"],
});

const validator = ref<ValidatorErrorProps | null>(null);
const auth = useAuth();
const router = useRouter();

const isLoading = ref(false);

const onSubmit = async (values: SchemaActualityFormInfer) => {
  try {
    isLoading.value = true;
    validator.value = null;

    const token = auth.session.value?.accessToken;
    if (!token) throw new Error("Utilisateur non authentifié");

    const response = await createActuality(token, values);
    const data = await response.json();

    if (response.ok) {
      const state = (data as StateActionModel).state;
      if (state) {
        toast.success("Création", {
          description: `Une actualité a été créée.`,
        });
        await router.push("/admin/actuality");
      } else {
        toast.error("Création échouée", {
          description: "Nous n'avons pas pu effectuer cette action.",
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
        description: (data as { message: string }).message || "Une erreur est survenue.",
      });
    }
  } catch {
    toast.error("Erreur", {
      description: "Impossible de créer une actualité, merci de réessayer.",
    });
  } finally {
    isLoading.value = false;
  }
};
</script>
<template>
  <div class="space-y-6">
    <GoBack back="/admin/actuality" />

    <div class="w-full max-w-2xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle class="flex items-center gap-2">
            Création d'une actualité
          </CardTitle>
          <CardDescription>
            <!-- Tu peux écrire ici un descriptif rapide ou le supprimer -->
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div class="space-y-4">
            <ValidatorError :validator="validator" />
            <ActualityForm :onSubmit="onSubmit" :loading="isLoading" />
          </div>
        </CardContent>
      </Card>
    </div>
  </div>
</template>
