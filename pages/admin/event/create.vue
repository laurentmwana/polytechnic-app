<script setup lang="ts">
import EventForm from "@/components/features/event/EventForm.vue";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useAuth } from "@/composables/useAuth";
import type { SchemaEventFormInfer } from "@/definitions/event";
import { createEvent } from "@/services/event";
import type { StateActionModel, ValidatorErrorProps } from "@/types/util";
import { toast } from "vue-sonner";

useHead({
  title: "Création d’un évènement - Polytechnic Application",
});

definePageMeta({
  layout: "admin",
  middleware: ["admin", "verified"],
});

const validator = ref<ValidatorErrorProps | null>(null);
const auth = useAuth();
const router = useRouter();

const isLoading = ref(false);

const onSubmit = async (values: SchemaEventFormInfer) => {
  try {
    isLoading.value = true;
    validator.value = null;

    if (!auth.session.value?.accessToken) {
      throw new Error("Utilisateur non authentifié");
    }

    const response = await createEvent(auth.session.value.accessToken, values);
    const data = await response.json();

    if (response.ok) {
      const state = (data as StateActionModel).state;
      if (state) {
        toast.success("Création", {
          description: `L’évènement a été créé avec succès.`,
        });
        await router.push("/admin/event");
      } else {
        toast.error("Création échouée", {
          description: "L’action n’a pas pu être complétée.",
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
  } catch {
    toast.error("Erreur", {
      description: "Impossible de créer l’évènement, veuillez réessayer.",
    });
  } finally {
    isLoading.value = false;
  }
};
</script>
<template>
  <div class="space-y-6">
    <GoBack back="/admin/event" />

    <div class="w-full max-w-4xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle class="flex items-center gap-2">
            Création d’un évènement
          </CardTitle>
          <CardDescription>Complétez les informations ci-dessous.</CardDescription>
        </CardHeader>
        <CardContent>
          <div class="space-y-4">
            <ValidatorError :validator="validator" />
            <EventForm :onSubmit="onSubmit" :loading="isLoading" />
          </div>
        </CardContent>
      </Card>
    </div>
  </div>
</template>
