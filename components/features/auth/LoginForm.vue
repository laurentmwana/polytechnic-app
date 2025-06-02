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
  onSubmit: (values: { email: string; password: string }) => Promise<boolean>;
}>();

const isPending = ref(false);

const formSchema = toTypedSchema(
  z.object({
    email: z.string().email("Adresse e-mail invalide").min(2).max(50),
    password: z.string().min(2).max(50),
  })
);

const form = useForm({
  validationSchema: formSchema,
});

const handleSubmit = form.handleSubmit(async (values) => {
  isPending.value = true;

  try {
    const state = await props.onSubmit(values);

    if (state) {
      form.resetField("password");
    }
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
          <Input type="email" v-bind="componentField" />
        </FormControl>
        <FormMessage />
      </FormItem>
    </FormField>

    <FormField v-slot="{ componentField }" name="password">
      <FormItem>
        <FormLabel>Mot de passe</FormLabel>
        <FormControl>
          <Input type="password" v-bind="componentField" />
        </FormControl>
        <FormMessage />
      </FormItem>
    </FormField>

    <Button class="w-full" type="submit" :disabled="isPending">
      <template v-if="isPending">
        <Loader type="spinner" text="Chargement..." />
      </template>
      <template v-else> Connexion </template>
    </Button>
  </form>
</template>
