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

// Props
const props = defineProps<{
  onSubmit: (values: { email: string; password: string }) => Promise<boolean>;
}>();

const isPending = ref(false);

// Schéma de validation
const formSchema = toTypedSchema(
  z.object({
    email: z
      .string()
      .email("Veuillez entrer une adresse e-mail valide.")
      .min(2, "L'adresse e-mail est trop courte.")
      .max(50, "L'adresse e-mail est trop longue."),
    password: z
      .string()
      .min(2, "Le mot de passe est trop court.")
      .max(50, "Le mot de passe est trop long."),
  })
);

// Formulaire
const form = useForm({
  validationSchema: formSchema,
});

// Soumission
const handleSubmit = form.handleSubmit(async (values) => {
  isPending.value = true;

  try {
    const state = await props.onSubmit(values);

    if (state) {
      form.resetField("password");
    }
  } catch (error) {
    toast.error("Une erreur est survenue", {
      description: "Veuillez réessayer dans un instant.",
    });
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
          <Input
            type="email"
            v-bind="componentField"
            :disabled="isPending"
            placeholder="exemple@domaine.com"
          />
        </FormControl>
        <FormMessage />
      </FormItem>
    </FormField>

    <FormField v-slot="{ componentField }" name="password">
      <FormItem>
        <FormLabel>Mot de passe</FormLabel>
        <FormControl>
          <Input
            type="password"
            v-bind="componentField"
            :disabled="isPending"
            placeholder="••••••••"
          />
        </FormControl>
        <FormMessage />
      </FormItem>
    </FormField>

    <Button class="w-full" type="submit" :disabled="isPending">
      <template v-if="isPending">
        <Loader type="spinner" text="Connexion en cours..." color="secondary" />
      </template>
      <template v-else>
        Connexion
      </template>
    </Button>
  </form>
</template>
