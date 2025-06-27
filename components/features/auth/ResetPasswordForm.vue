<script setup lang="ts">
import Loader from "@/components/Loader.vue";
import { Button } from "@/components/ui/button";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input, PasswordInput } from "@/components/ui/input";
import { toTypedSchema } from "@vee-validate/zod";
import { useForm } from "vee-validate";
import { ref } from "vue";
import { toast } from "vue-sonner";
import z from "zod";
import { ResetPasswordSchema, type ResetPasswordSchemaInfer } from "~/definitions/auth";

const props = defineProps<{
  onSubmit: (values: ResetPasswordSchemaInfer) => Promise<boolean>;
  email: string;
}>();

const isPending = ref(false);

const formSchema = toTypedSchema(ResetPasswordSchema);

const form = useForm({
  validationSchema: formSchema,
  initialValues: {
    email: props.email,
  },
});

const handleSubmit = form.handleSubmit(async (values) => {
  isPending.value = true;

  try {
    await props.onSubmit(values);

    form.resetField("password", { value: "" });
    form.resetField("password_confirmation", { value: "" });
  } catch (error) {
    toast.error("Une erreur est survenue, veuillez réessayer.");
    console.error(error);
  } finally {
    isPending.value = false;
  }
});
</script>

<template>
  <form @submit.prevent="handleSubmit" class="space-y-7">
    <FormField v-slot="{ componentField }" name="email">
      <FormItem>
        <FormLabel>Adresse e-mail</FormLabel>
        <FormControl>
          <Input :disabled="true" type="email" v-bind="componentField" />
        </FormControl>
        <FormMessage />
      </FormItem>
    </FormField>

    <FormField v-slot="{ componentField }" name="password">
      <FormItem>
        <FormLabel> Nouveau mot de passe </FormLabel>
        <FormControl>
          <PasswordInput
            id="new-password"
            :show-strength-indicator="true"
            :show-criteria="true"
            autocomplete="new-password"
            v-bind="componentField"
            :disabled="isPending"
          />
        </FormControl>
        <FormMessage />
      </FormItem>
    </FormField>

    <FormField v-slot="{ componentField }" name="password_confirmation">
      <FormItem>
        <FormLabel>Confirmation du nouveau mot de passe</FormLabel>
        <FormControl>
          <PasswordInput
            id="password-confirmation"
            :show-strength-indicator="true"
            :show-criteria="true"
            autocomplete="password-confirmation"
            v-bind="componentField"
            :disabled="isPending"
          />
        </FormControl>
        <FormMessage />
      </FormItem>
    </FormField>

    <Button class="w-full" type="submit" :disabled="isPending">
      <template v-if="isPending">
        <Loader type="spinner" text="Chargement..." color="secondary" />
      </template>
      <template v-else> Modifier </template>
    </Button>
  </form>
</template>
