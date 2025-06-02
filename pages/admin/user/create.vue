<script setup lang="ts">
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
import { deleteUserLocal } from "@/services/session";
import { createUser } from "@/services/user";
import type { UserModel } from "@/types/model";
import type { StateActionModel, ValidatorErrorProps } from "@/types/util";
import { toast } from "vue-sonner";

useHead({
  title: "Création d'utilisateur - Polytechnic Application",
});

definePageMeta({
  layout: "admin",
  middleware: ["admin"],
});

interface UserResponse {
  data: UserModel;
}

const validator = ref<ValidatorErrorProps | null>(null);

const auth = useAuth();
const router = useRouter();

const user = ref<UserModel | null>(null);
const isLoading = ref<boolean>(true);

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
      const state = (data as StateActionModel).state;
      if (state) {
        toast.success("Création", {
          description: `Un utilisateur a été créé`,
        });

        router.push("/admin/user");
      } else {
        toast.error("Création", {
          description: `Nous n'avons pas pu effectuer cette action`,
        });
      }
    } else if (response.status === 422) {
      validator.value = data as ValidatorErrorProps;
    } else if (response.status == 401) {
      deleteUserLocal();
      router.push("/auth/login");
      toast.warning("Session", {
        description: "Votre session a expirée, merci de vous reconnecter",
      });
    } else {
      toast.error("Erreur", {
        description:
          (data as { message: string }).message || "Une erreur est survenue",
      });
    }
  } catch (error) {
    toast.error("Erreur", {
      description: `Impossible d'editer l'utilisateur #${user.value?.id}`,
    });
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
          <CardDescription> </CardDescription>
        </CardHeader>
        <CardContent>
          <div class="max-w-2xl space-y-4">
            <ValidatorError :validator="validator" />
            <UserForm :onSubmit="onSubmit" />
          </div>
        </CardContent>
      </Card>
    </div>
  </div>
</template>
