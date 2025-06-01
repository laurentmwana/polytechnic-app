<script setup lang="ts">
import { toast } from "vue-sonner";
import UserProfileInfoForm from "../components/features/user/UserProfileInfoForm.vue";
import UserProfilePasswordForm from "../components/features/user/UserProfilePasswordForm.vue";
import type {
  SchemaProfileInfoInfer,
  SchemaProfilePasswordInfer,
} from "../definitions/profile";
import { changePasswordUser, editProfileUser } from "../services/profile";
import { deleteUserLocal } from "../services/session";
import type { ValidatorErrorProps } from "../types/util";

useHead({
  title: "Mon profil - Polytechnic Application",
});

definePageMeta({
  middleware: ["auth"],
});

const router = useRouter();
const auth = useAuth();

const editValidator = ref<ValidatorErrorProps | null>(null);
const passwordValidator = ref<ValidatorErrorProps | null>(null);

const onSubmitEditInfo = async (values: SchemaProfileInfoInfer) => {
  try {
    editValidator.value = null;

    if (!auth.session.value?.accessToken) {
      throw new Error("Utilisateur non authentifié");
    }

    const response = await editProfileUser(
      auth.session.value.accessToken,
      values
    );
    const data = await response.json();

    if (response.ok) {
      const state = (data as { state: boolean }).state;

      if (state) {
        toast.success("Informations du profil", {
          description: "Vos informations ont été modifiées avec succès.",
        });
        deleteUserLocal();

        toast.success("Connexion requise", {
          description: "Veuillez vous reconnecter pour voir vos modifications.",
        });

        router.replace("/auth/login");
      } else {
        toast.error("Erreur", {
          description: "Nous n'avons pas pu effectuer cette action.",
        });
      }
    } else if (response.status === 422) {
      editValidator.value = data as ValidatorErrorProps;
    } else if (response.status === 401) {
      deleteUserLocal();
      router.replace("/auth/login");
      toast.warning("Session expirée", {
        description: "Votre session a expiré, merci de vous reconnecter.",
      });
    } else {
      toast.error("Erreur", {
        description:
          (data as { message: string }).message || "Une erreur est survenue.",
      });
    }
  } catch (error) {
    toast.error("Erreur", {
      description: "Impossible d'effectuer cette action.",
    });
  }
};

const onSubmitChangePassword = async (values: SchemaProfilePasswordInfer) => {
  try {
    passwordValidator.value = null;

    if (!auth.session.value?.accessToken) {
      throw new Error("Utilisateur non authentifié");
    }

    const response = await changePasswordUser(
      auth.session.value.accessToken,
      values
    );
    const data = await response.json();

    if (response.ok) {
      const state = (data as { state: boolean }).state;
      if (state) {
        toast.success("Mot de passe mis à jour", {
          description: "Votre mot de passe a été modifié avec succès.",
        });

        router.replace("/profile");
      } else {
        toast.error("Erreur", {
          description: "Nous n'avons pas pu effectuer cette action.",
        });
      }
    } else if (response.status === 422) {
      passwordValidator.value = data as ValidatorErrorProps;
    } else if (response.status === 401) {
      deleteUserLocal();
      router.replace("/auth/login");
      toast.warning("Session expirée", {
        description: "Votre session a expiré, merci de vous reconnecter.",
      });
    } else {
      toast.error("Erreur", {
        description:
          (data as { message: string }).message || "Une erreur est survenue.",
      });
    }
  } catch (error) {
    toast.error("Erreur", {
      description: "Impossible d'effectuer cette action.",
    });
  }
};
</script>

<template>
  <div class="container py-12">
    <div v-if="auth.isPending.value">
      <!-- Skeleton loaders for loading state -->
      <div class="mb-6">
        <Skeleton class="h-8 w-40 mb-2" />
      </div>

      <div class="mb-7">
        <Skeleton class="h-12 w-full rounded-md" />
      </div>

      <div class="space-y-7">
        <!-- Skeleton cards repeated for loading placeholders -->
        <Card>
          <CardHeader>
            <Skeleton class="h-6 w-48 mb-2" />
            <Skeleton class="h-4 w-72" />
          </CardHeader>
          <CardContent>
            <div class="max-w-lg space-y-6">
              <div class="space-y-2">
                <Skeleton class="h-4 w-16" />
                <Skeleton class="h-10 w-full" />
              </div>
              <div class="space-y-2">
                <Skeleton class="h-4 w-32" />
                <Skeleton class="h-10 w-full" />
              </div>
              <Skeleton class="h-9 w-28" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <Skeleton class="h-6 w-64 mb-2" />
            <Skeleton class="h-4 w-80" />
          </CardHeader>
          <CardContent>
            <div class="max-w-lg space-y-6">
              <div class="space-y-2">
                <Skeleton class="h-4 w-40" />
                <Skeleton class="h-10 w-full" />
              </div>
              <div class="space-y-2">
                <Skeleton class="h-4 w-40" />
                <Skeleton class="h-10 w-full" />
              </div>
              <div class="space-y-2">
                <Skeleton class="h-4 w-48" />
                <Skeleton class="h-10 w-full" />
              </div>
              <Skeleton class="h-9 w-28" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <Skeleton class="h-6 w-36 mb-2" />
            <Skeleton class="h-4 w-96" />
          </CardHeader>
          <CardContent>
            <div class="space-y-4">
              <Skeleton class="h-4 w-full" />
              <Skeleton class="h-4 w-5/6" />
              <Skeleton class="h-9 w-40" />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>

    <div class="space-y-6" v-else>
      <Card>
        <CardHeader>
          <CardTitle>Informations du profil</CardTitle>
          <CardDescription>
            Mettez à jour votre nom et votre adresse e-mail
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div class="max-w-3xl space-y-6">
            <ValidatorError :validator="editValidator" />

            <UserProfileInfoForm
              :onSubmit="onSubmitEditInfo"
              :profile="{
                name: auth.user.value?.name ?? '',
                email: auth.user.value?.email ?? '',
              }"
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Mettre à jour le mot de passe</CardTitle>
          <CardDescription>
            Assurez-vous que votre compte utilise un mot de passe long et
            aléatoire pour rester sécurisé
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div class="max-w-3xl space-y-6">
            <ValidatorError :validator="passwordValidator" />

            <UserProfilePasswordForm :onSubmit="onSubmitChangePassword" />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Suppression du compte</CardTitle>
          <CardDescription>
            <div class="max-w-3xl">
              {{
                auth.isAdmin
                  ? `Vous ne pouvez pas supprimer ce compte car vous êtes administrateur.`
                  : `Vous ne pouvez pas supprimer votre compte directement. Veuillez contacter un administrateur pour faire cette demande.`
              }}
            </div>
          </CardDescription>
        </CardHeader>
      </Card>
    </div>
  </div>
</template>
