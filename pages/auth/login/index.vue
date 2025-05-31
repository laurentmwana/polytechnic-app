<script setup lang="ts">
import LoginForm from "@/components/features/auth/LoginForm.vue";
import { loginUser } from "@/services/auth";
import type { AuthModel } from "@/types/model";
import { toast } from "vue-sonner";
import { createUserLocal } from "~/services/session";

const router = useRouter();

useHead({
  title: "Se connecter - Polytechnic Application",
});

definePageMeta({
  layout: "auth",
  middleware: ["guest"],
});

interface LoginValidatorErrorProps {
  message: string;
  errors: {
    email: string[];
    password: string[];
  };
}

const validator = ref<LoginValidatorErrorProps | null>(null);
const redirecting = ref<boolean>(false);

const onSubmit = async (values: { email: string; password: string }) => {
  const response = await loginUser(values);

  const data = await response.json();

  if (response.ok) {
    redirecting.value = true;
    const user = (data as { data: AuthModel }).data;

    createUserLocal(user);

    router.push("/");
  } else if (response.status == 422) {
    validator.value = data as LoginValidatorErrorProps;
  } else {
    toast("Problème", {
      description: (data as { message: string }).message,
    });
  }

  return true;
};
</script>

<template>
  <div v-if="redirecting">
    <Card className="rounded-xl">
      <CardHeader className="px-10 pt-8 pb-0 text-center">
        <CardTitle className="text-xl">Connexion réussie</CardTitle>
        <CardDescription>Redirection en cours...</CardDescription>
      </CardHeader>
      <CardContent className="px-10 py-8">
        <div className="space-y-4 py-4">
          <div className="flex items-center justify-center mb-6">
            <Skeleton className="h-12 w-3/4" />
          </div>
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
          <div className="flex justify-end mt-6">
            <Skeleton className="h-10 w-24" />
          </div>
        </div>
      </CardContent>
    </Card>
  </div>
  <div class="space-y-4" v-else>
    <ValidatorError :validator="validator" />
    <Card>
      <CardHeader class="text-center">
        <CardTitle class="text-xl font-semibold">Se connecter</CardTitle>
        <CardDescription>
          Connectez-vous à votre compte pour accéder à votre espace
        </CardDescription>
      </CardHeader>
      <CardContent>
        <LoginForm :onSubmit="onSubmit" />

        <div class="text-muted-foreground text-center text-sm mt-6">
          Vous avez oublié votre mot de passe ?
          <TextLink href="/auth/forgot-password"> Réinitialiser </TextLink>
        </div>
      </CardContent>
    </Card>
  </div>
</template>
