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
import { Input } from "@/components/ui/input";
import { toTypedSchema } from "@vee-validate/zod";
import { useForm } from "vee-validate";
import { ref } from "vue";
import { toast } from "vue-sonner";
import z from "zod";

const props = defineProps<{
  onSubmit: (values: {
    email: string;
    password: string;
    password_confirmation: string;
  }) => Promise<boolean>;
  email: string;
}>();

const isPending = ref(false);

const formSchema = toTypedSchema(
  z
    .object({
      email: z
        .string()
        .email("Adresse e-mail invalide.")
        .min(1, "L’email est requis."),
      password: z
        .string()
        .min(8, "Le mot de passe doit contenir au moins 6 caractères."),
      password_confirmation: z
        .string()
        .min(8, "La confirmation du mot de passe est requise."),
    })
    .refine((data) => data.password === data.password_confirmation, {
      message: "Les mots de passe ne correspondent pas.",
      path: ["password_confirmation"],
    })
);

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
          <Input type="password" v-bind="componentField" />
        </FormControl>
        <FormMessage />
      </FormItem>
    </FormField>

    <FormField v-slot="{ componentField }" name="password_confirmation">
      <FormItem>
        <FormLabel>Confirmation du nouveau mot de passe</FormLabel>
        <FormControl>
          <Input type="password_confirmation" v-bind="componentField" />
        </FormControl>
        <FormMessage />
      </FormItem>
    </FormField>

    <Button class="w-full" type="submit" :disabled="isPending">
      <template v-if="isPending">
        <Loader type="spinner" text="Chargement..." />
      </template>
      <template v-else> Modifier </template>
    </Button>
  </form>
</template>
