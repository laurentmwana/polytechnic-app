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
import { editUser, getItemUsers } from "@/services/user";
import type { UserModel } from "@/types/model";
import type { StateActionModel, ValidatorErrorProps } from "@/types/util";
import { User } from "lucide-vue-next";
import { toast } from "vue-sonner";

useHead({
  title: "Détails utilisateur - Polytechnic Application",
});

definePageMeta({
  layout: "admin",
  middleware: ["admin", "verified"],
});

interface ModelDataResponse {
  data: UserModel;
}

const auth = useAuth();
const route = useRoute();
const router = useRouter();

const user = ref<UserModel | null>(null);
const isLoading = ref<boolean>(true);
const isEdit = ref<boolean>(false);
const validator = ref<ValidatorErrorProps | null>(null);

const userId = parseInt(route.params.id as string);

if (!userId || isNaN(userId)) {
  throw createError({
    statusCode: 400,
    statusMessage:
      "L'ID de l'utilisateur est requis et doit être un nombre valide",
  });
}

const fetchUser = async () => {
  try {
    isLoading.value = true;

    if (!auth.session.value?.accessToken) {
      throw new Error("Utilisateur non authentifié");
    }

    const response = await getItemUsers(auth.session.value.accessToken, userId);
    const data = await response.json();

    if (response.ok) {
      user.value = (data as ModelDataResponse).data;
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
      description: "Impossible de charger l'utilisateur",
    });
  } finally {
    isLoading.value = false;
  }
};

const onSubmit = async (values: SchemaUserFormInfer) => {
  try {
    isEdit.value = true;
    validator.value = null;

    if (!auth.session.value?.accessToken) {
      throw new Error("Utilisateur non authentifié");
    }

    const response = await editUser(
      auth.session.value.accessToken,
      userId,
      values
    );
    const data = await response.json();

    if (response.ok) {
      const state = (data as StateActionModel).state;
      if (state) {
        toast.success("Edition", {
          description: `les informations de l'utilisateur ${userId} ont été modifiées`,
        });

        router.push("/admin/user");
      } else {
        toast.error("Edition", {
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
      description: `Impossible d'editer l'utilisateur #${user.value?.id}`,
    });
  } finally {
    isEdit.value = false;
  }
};

onMounted(() => {
  fetchUser();
});
</script>

<template>
  <div class="space-y-6">
    <!-- Header avec bouton retour -->
    <GoBack back="/admin/user" />

    <!-- Loader -->
    <LoaderContainer v-if="isLoading" :isCard="true" />

    <!-- Utilisateur non trouvé -->
    <Card v-else-if="!user">
      <CardContent class="text-center py-12">
        <User class="h-12 w-12 mx-auto text-muted-foreground mb-4" />
        <p class="text-lg font-medium mb-2">Utilisateur non trouvé</p>
        <p class="text-muted-foreground">
          L'utilisateur avec l'ID {{ userId }} n'existe pas.
        </p>
      </CardContent>
    </Card>

    <div v-else class="w-full">
      <Card>
        <CardHeader>
          <CardTitle class="flex items-center gap-2">
            Editer l'utilisateur #{{ user.id }}
          </CardTitle>
          <CardDescription>
            Détails de l'utilisateur {{ user.name }} {{ user.firstname }}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div class="max-w-2xl space-y-5">
            <ValidatorError :validator="validator" />

            <UserForm :user="user" :onSubmit="onSubmit" />
          </div>
        </CardContent>
      </Card>
    </div>
  </div>
</template>
