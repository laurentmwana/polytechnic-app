<script setup lang="ts">
import LoginForm from "@/components/features/auth/LoginForm.vue";
import { loginUser } from "@/services/auth";
import type { AuthModel } from "@/types/model";
import type { ValidatorErrorProps } from "@/types/util";
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

const validator = ref<ValidatorErrorProps | null>(null);
const redirecting = ref<boolean>(false);

const onSubmit = async (values: { email: string; password: string }) => {
  validator.value = null;

  const response = await loginUser(values);

  const data = await response.json();

  if (response.ok) {
    redirecting.value = true;
    const user = (data as { data: AuthModel }).data;
    createUserLocal(user);
    router.replace("/");
  } else if (response.status == 422) {
    validator.value = data as ValidatorErrorProps;
  } else {
    toast("Problème", {
      description: (data as { message: string }).message,
    });
  }

  return true;
};
</script>

<template>
  <div>
    <div v-if="redirecting">
      <Card class="rounded-xl">
        <CardHeader class="px-10 pt-8 pb-0 text-center">
          <CardTitle class="text-xl">Connexion réussie</CardTitle>
          <CardDescription>Redirection en cours...</CardDescription>
        </CardHeader>
        <CardContent class="px-10 py-8">
          <div class="space-y-4 py-4">
            <div class="flex items-center justify-center mb-6">
              <Skeleton class="h-12 w-3/4" />
            </div>
            <Skeleton class="h-10 w-full" />
            <Skeleton class="h-10 w-full" />
            <Skeleton class="h-10 w-full" />
            <div class="flex justify-end mt-6">
              <Skeleton class="h-10 w-24" />
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
  </div>
</template>
