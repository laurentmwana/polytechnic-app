<script setup lang="ts">
import ResetPasswordForm from "@/components/features/auth/ResetPasswordForm.vue";
import { resetPasswordUser } from "@/services/auth";
import type { ResetPasswordModel } from "@/types/model";
import type { ValidatorErrorProps } from "@/types/util";
import { ref } from "vue";
import { useRoute } from "vue-router";
import { toast } from "vue-sonner";

useHead({
  title: "Réinitialisation de mot de passe - Polytechnic Application",
});

definePageMeta({
  layout: "auth",
});

const route = useRoute();
const router = useRouter();

const token = route.params.accessToken as string;
const email = route.query.email as string;

const validator = ref<ValidatorErrorProps | null>(null);
const redirecting = ref(false);

const onSubmit = async (values: {
  email: string;
  password: string;
  password_confirmation: string;
}) => {
  validator.value = null;

  const response = await resetPasswordUser({ ...values, token });

  const data = await response.json();

  if (response.ok) {
    redirecting.value = true;
    const state = data as ResetPasswordModel;

    toast("Message", {
      description: state.message,
    });

    if (state.is_update) {
      router.replace("/auth/login");
    }

    return true;
  } else if (response.status === 422) {
    validator.value = data as ValidatorErrorProps;
  } else {
    toast("Problème", {
      description: (data as { message: string }).message,
    });
  }

  return false;
};
</script>

<template>
  <Card>
    <CardHeader class="text-center">
      <CardTitle>Réinitialisation du mot de passe</CardTitle>
      <CardDescription>
        Veuillez entrer votre nouveau mot de passe ci-dessous
      </CardDescription>
    </CardHeader>
    <CardContent>
      <ResetPasswordForm :onSubmit="onSubmit" :email="email" />
    </CardContent>
  </Card>
</template>
