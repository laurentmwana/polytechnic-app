<script setup lang="ts">
import {
  SchemaProfileInfo,
  type SchemaProfileInfoInfer,
} from "@/definitions/profile";
import { toTypedSchema } from "@vee-validate/zod";
import { useForm } from "vee-validate";
import { toast } from "vue-sonner";

const props = defineProps<{
  onSubmit: (values: SchemaProfileInfoInfer) => Promise<void>;
  profile: { email: string; name: string };
}>();

const isPending = ref(false);

const formSchema = toTypedSchema(SchemaProfileInfo);

const form = useForm({
  validationSchema: formSchema,
  initialValues: {
    name: props.profile.name,
    email: props.profile.email,
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
    <FormField v-slot="{ componentField }" name="name">
      <FormItem>
        <FormLabel>Nom d'utilisateur</FormLabel>
        <FormControl>
          <Input type="text" v-bind="componentField" />
        </FormControl>
        <FormMessage />
      </FormItem>
    </FormField>

    <FormField v-slot="{ componentField }" name="email">
      <FormItem>
        <FormLabel>Adresse e-mail</FormLabel>
        <FormControl>
          <Input type="email" v-bind="componentField" />
        </FormControl>
        <FormMessage />
      </FormItem>
    </FormField>

    <Button variant="secondary" type="submit" :disabled="isPending">
      <template v-if="isPending">
        <Loader type="spinner" text="Chargement..." />
      </template>
      <template v-else> Sauvegarder </template>
    </Button>
  </form>
</template>
