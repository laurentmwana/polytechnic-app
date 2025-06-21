<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";
import UserForm from "@/components/features/user/UserForm.vue";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useAuth } from "@/composables/useAuth";
import type { SchemaUserFormInfer } from "@/definitions/user";
import { createUser } from "@/services/user";
import type { UserModel } from "@/types/model";
import type { StateActionModel, ValidatorErrorProps } from "@/types/util";
import { toast } from "vue-sonner";

useHead({
  title: "Création d'utilisateur - Polytechnic Application",
});

definePageMeta({
  layout: "admin",
  middleware: ["admin", "verified"],
});

const validator = ref<ValidatorErrorProps | null>(null);
const auth = useAuth();
const router = useRouter();

const user = ref<UserModel | null>(null);
const isLoading = ref<boolean>(false);

const onSubmit = async (values: SchemaUserFormInfer) => {
  try {
    isLoading.value = true;
    validator.value = null;

    if (!auth.session.value?.accessToken) {
      throw new Error("Utilisateur non authentifié");
    }

    const response = await createUser(auth.session.value.accessToken, values);
    const data = await response.json();

    if (response.ok) {
      // On suppose que data a la forme { state: boolean }
      const state = (data as StateActionModel).state;
      if (state === true) {
        toast.success("Création", {
          description: `Un utilisateur a été créé`,
        });
        await router.push("/admin/user");
      } else {
        toast.error("Création", {
          description: `Nous n'avons pas pu effectuer cette action`,
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
  } catch {
    toast.error("Erreur", {
      description: "Impossible de créer l'utilisateur",
    });
  } finally {
    isLoading.value = false;
  }
};
</script>

<template>
  <div class="space-y-6">
    <GoBack back="/admin/user" />

    <div class="w-full">
      <Card>
        <CardHeader>
          <CardTitle class="flex items-center gap-2">
            Création d'un utilisateur
          </CardTitle>
          <CardDescription></CardDescription>
        </CardHeader>
        <CardContent>
          <div class="max-w-2xl space-y-4">
            <ValidatorError :validator="validator" />
            <UserForm :onSubmit="onSubmit" :loading="isLoading" />
          </div>
        </CardContent>
      </Card>
    </div>
  </div>
</template>
