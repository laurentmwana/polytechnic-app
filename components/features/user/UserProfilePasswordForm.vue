<script setup lang="ts">
import {
  SchemaProfilePassword,
  type SchemaProfilePasswordInfer,
} from "@/definitions/profile";
import { toTypedSchema } from "@vee-validate/zod";
import { useForm } from "vee-validate";
import { toast } from "vue-sonner";
import PasswordInput from "~/components/ui/input/PasswordInput.vue";

const props = defineProps<{
  onSubmit: (values: SchemaProfilePasswordInfer) => Promise<void>;
}>();

const isPending = ref(false);

const formSchema = toTypedSchema(SchemaProfilePassword);

const form = useForm({
  validationSchema: formSchema,
  initialValues: {
    current_password: "",
    password: "",
    password_confirmation: "",
  },
});

const handleSubmit = form.handleSubmit(async (values) => {
  isPending.value = true;

  try {
    await props.onSubmit(values);
    form.resetField("current_password", { value: "" });
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
    <FormField v-slot="{ componentField }" name="current_password">
      <FormItem>
        <FormLabel> Ancient mot de mot de passe </FormLabel>
        <FormControl>
          <PasswordInput
            id="current-password"
            placeholder="Entrez votre mot de passe"
            autocomplete="current-password"
            v-bind="componentField"
            :disabled="isPending"
          />
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

    <Button variant="secondary" type="submit" :disabled="isPending">
      <template v-if="isPending">
        <Loader type="spinner" text="Chargement..." color="secondary" />
      </template>
      <template v-else> Sauvegarder </template>
    </Button>
  </form>
</template>
