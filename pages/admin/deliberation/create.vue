<script setup lang="ts">
import DeliberationForm from "@/components/features/delibe/DeliberationForm.vue";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useAuth } from "@/composables/useAuth";
import type { SchemaDeliberationFormInfer } from "@/definitions/deliberation";
import { createDeliberation } from "@/services/deliberation";
import type { StateActionModel, ValidatorErrorProps } from "@/types/util";
import { toast } from "vue-sonner";

useHead({
  title: "Création d'une délibération - Polytechnic Application",
});

definePageMeta({
  layout: "admin",
  middleware: ["admin", "verified"],
});

const validator = ref<ValidatorErrorProps | null>(null);
const auth = useAuth();
const router = useRouter();

const isLoading = ref(false);

const onSubmit = async (values: SchemaDeliberationFormInfer) => {
  try {
    isLoading.value = true;
    validator.value = null;

    if (!auth.session.value?.accessToken) {
      throw new Error("Utilisateur non authentifié");
    }

    const response = await createDeliberation(auth.session.value.accessToken, values);
    const data = await response.json();

    if (response.ok) {
      const state = (data as StateActionModel).state;
      if (state) {
        toast.success("Création", {
          description: `Une délibération a été créée.`,
        });
        await router.push("/admin/deliberation");
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
      description: "Impossible de créer une délibération, merci de réessayer.",
    });
  } finally {
    isLoading.value = false;
  }
};
</script>

<template>
  <div class="space-y-6">
    <GoBack back="/admin/deliberation" />

    <div class="w-full max-w-2xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle class="flex items-center gap-2">
            Création d'une délibération
          </CardTitle>
          <CardDescription></CardDescription>
        </CardHeader>
        <CardContent>
          <div class="space-y-4">
            <ValidatorError :validator="validator" />
            <DeliberationForm :onSubmit="onSubmit" :loading="isLoading" />
          </div>
        </CardContent>
      </Card>
    </div>
  </div>
</template>
