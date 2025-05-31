<script setup lang="ts">
import ForgotPasswordForm from "@/components/features/auth/ForgotPasswordForm.vue";
import { forgotPasswordUser } from "@/services/auth";
import type { ForgotPasswordModel } from "@/types/model";
import { toast } from "vue-sonner";

useHead({
  title: "Mot de passe oublié - Polytechnic Application",
});

definePageMeta({
  layout: "auth",
});

interface ForgotPasswordValidatorErrorProps {
  message: string;
  errors: {
    email: string[];
  };
}

const validator = ref<ForgotPasswordValidatorErrorProps | null>(null);
const redirecting = ref<boolean>(false);
const message = ref<string | null>(null);
const isSend = ref<boolean>(false);

const onSubmit = async (values: { email: string }) => {
  const response = await forgotPasswordUser(values);

  const data = await response.json();

  if (response.ok) {
    redirecting.value = true;
    const state = data as ForgotPasswordModel;

    if (state.is_send) {
      isSend.value = true;
      message.value = state.message;
    } else {
      toast("Message", {
        description: state.message,
      });
    }

    return true;
  } else if (response.status == 422) {
    validator.value = data as ForgotPasswordValidatorErrorProps;
  } else {
    toast("Problème", {
      description: (data as { message: string }).message,
    });
  }

  return true;
};
</script>

<template>
  <Card>
    <CardHeader class="text-center">
      <CardTitle>Mot de passe oublié</CardTitle>
      <CardDescription>
        {{
          isSend
            ? message
            : "Entrez votre e-mail pour recevoir un lien de réinitialisation"
        }}
      </CardDescription>
    </CardHeader>
    <CardContent>
      <ForgotPasswordForm :onSubmit="onSubmit" v-if="!isSend" />
      <div class="text-muted-foreground space-x-1 text-center text-sm mt-6">
        <span>Ou, retour </span>
        <TextLink href="/auth/login">à la connexion</TextLink>
      </div>
    </CardContent>
  </Card>
</template>
