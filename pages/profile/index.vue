<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";
import { useAuth } from "@/composables/useAuth";
import type { AuthModel } from "@/types/model";
import UserProfileInfoForm from "@/components/features/user/UserProfileInfoForm.vue";
import UserProfilePasswordForm from "@/components/features/user/UserProfilePasswordForm.vue";
import type {
  SchemaProfileInfoInfer,
  SchemaProfilePasswordInfer,
} from "@/definitions/profile";
import { changePasswordUser, editProfileUser } from "@/services/profile";
import { updateUserLocal } from "@/services/session";
import type { ValidatorErrorProps } from "@/types/util";
import { toast } from "vue-sonner";

useHead({
  title: "Mon profil - Polytechnic Application",
});

definePageMeta({
  middleware: ["auth"],
  layout: "default",
});

const router = useRouter();
const auth = useAuth();

const editValidator = ref<ValidatorErrorProps | null>(null);
const passwordValidator = ref<ValidatorErrorProps | null>(null);

const onSubmitEditInfo = async (values: SchemaProfileInfoInfer) => {
  editValidator.value = null;

  if (!auth.session.value?.accessToken) {
    toast.error("Erreur", { description: "Utilisateur non authentifié." });
    return;
  }

  try {
    const response = await editProfileUser(
      auth.session.value.accessToken,
      values
    );
    const data = await response.json();

    if (response.ok) {
      const newUser = (data as { data: AuthModel }).data;
      updateUserLocal(newUser);
      auth.initializeAuth();
      toast.success("Profil mis à jour", {
        description: "Vos informations ont été modifiées avec succès.",
      });
      router.replace("/profile");
    } else if (response.status === 422) {
      editValidator.value = data as ValidatorErrorProps;
    } else if (response.status === 401) {
      auth.logout()

      toast.warning("Session expirée", {
        description: "Votre session a expiré. Veuillez vous reconnecter.",
      });
      router.replace("/auth/login");
 
    } else {
      toast.error("Erreur", {
        description: (data as any).message || "Une erreur est survenue.",
      });
    }
  } catch (error) {
    toast.error("Erreur", {
      description: "Impossible d'effectuer cette action.",
    });
  }
};

const onSubmitChangePassword = async (values: SchemaProfilePasswordInfer) => {
  passwordValidator.value = null;

  if (!auth.session.value?.accessToken) {
    toast.error("Erreur", { description: "Utilisateur non authentifié." });
    return;
  }

  try {
    const response = await changePasswordUser(
      auth.session.value.accessToken,
      values
    );
    const data = await response.json();

    if (response.ok && (data as any).state) {
      toast.success("Mot de passe mis à jour", {
        description: "Votre mot de passe a été modifié avec succès.",
      });

      router.replace("/profile");
    } else if (response.status === 422) {
      passwordValidator.value = data as ValidatorErrorProps;
    } else if (response.status === 401) {
      deleteUserLocal();
      router.replace("/auth/login");
      toast.warning("Session expirée", {
        description: "Votre session a expiré. Veuillez vous reconnecter.",
      });
    } else {
      toast.error("Erreur", {
        description: (data as any).message || "Une erreur est survenue.",
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
    <div class="section-page-header">
      <h2 class="section-page-title">Mon profil</h2>
    </div>

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
      <Alert
        variant="destructive"
        v-if="auth.session.value && !auth.session.value.isEmailVerified"
      >
        <AlertTitle> Votre adresse e-mail n’est pas vérifiée</AlertTitle>
        <AlertDescription>
          Veuillez cliquer sur le lien ci-dessous pour procéder à la
          vérification de votre adresse e-mail :
          <NuxtLink href="/auth/send-verification-email">
            👉 Vérifier mon adresse e-mail
          </NuxtLink>
        </AlertDescription>
      </Alert>

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
