<script setup lang="ts">
import LoginForm from "@/components/features/auth/LoginForm.vue";
import { loginUser } from "@/services/auth";
import type { AuthModel } from "@/types/model";
import { toast } from "vue-sonner";
import { createUserLocal } from "~/services/session";

const router = useRouter();

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
    <Card>
      <CardHeader class="text-center">
        <CardTitle class="text-xl font-semibold"> Connecion réussi </CardTitle>
        <CardDescription> </CardDescription>
      </CardHeader>
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
          <TextLink href="/forgot-password"> Réinitialiser </TextLink>
        </div>
      </CardContent>
    </Card>
  </div>
</template>
