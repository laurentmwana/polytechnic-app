<script setup lang="ts">
import JuryForm from "@/components/features/jury/JuryForm.vue";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useAuth } from "@/composables/useAuth";
import type { SchemaJuryFormInfer } from "@/definitions/jury";
import { createJury } from "@/services/jury";
import type { StateActionModel, ValidatorErrorProps } from "@/types/util";
import { toast } from "vue-sonner";

useHead({
  title: "Création d'un jury - Polytechnic Application",
});

definePageMeta({
  layout: "admin",
  middleware: ["admin", "verified"],
});

const validator = ref<ValidatorErrorProps | null>(null);

const auth = useAuth();
const router = useRouter();

const isLoading = ref<boolean>(false);

const onSubmit = async (values: SchemaJuryFormInfer) => {
  try {
    isLoading.value = true;
    validator.value = null;

    if (!auth.session.value?.accessToken) {
      throw new Error("Utilisateur non authentifié");
    }

    const response = await createJury(auth.session.value.accessToken, values);
    const data = await response.json();

    if (response.ok) {
      const state = (data as StateActionModel).state;
      if (state) {
        toast.success("Création réussie", {
          description: `Le jury a été créé avec succès.`,
        });

        await router.push("/admin/jury");
      } else {
        toast.error("Création échouée", {
          description: `Impossible d'effectuer cette action.`,
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
      toast.error("Erreur serveur", {
        description:
          (data as { message: string }).message || "Une erreur est survenue.",
      });
    }
  } catch (error) {
    toast.error("Erreur", {
      description: "Impossible de créer le jury, veuillez réessayer.",
    });
  } finally {
    isLoading.value = false;
  }
};
</script>

<template>
  <div class="space-y-6">
    <GoBack back="/admin/jury" />

    <div class="w-full">
      <Card>
        <CardHeader>
          <CardTitle class="flex items-center gap-2">
            Création d'un jury
          </CardTitle>
          <CardDescription>
            <!-- Tu peux ajouter une description ici si besoin -->
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div class="max-w-2xl space-y-4">
            <ValidatorError :validator="validator" />
            <JuryForm :onSubmit="onSubmit" :loading="isLoading" />
          </div>
        </CardContent>
      </Card>
    </div>
  </div>
</template>
