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
import {
  SchemaContactForm,
  type SchemaContactFormInfer,
} from "@/definitions/other";
import { toTypedSchema } from "@vee-validate/zod";
import { useForm } from "vee-validate";
import { ref } from "vue";
import { toast } from "vue-sonner";

const props = defineProps<{
  onSubmit: (values: SchemaContactFormInfer) => Promise<void>;
}>();

const isPending = ref(false);

const formSchema = toTypedSchema(SchemaContactForm);

const form = useForm({
  validationSchema: formSchema,
});

const handleSubmit = form.handleSubmit(async (values) => {
  isPending.value = true;

  try {
    await props.onSubmit(values);
  } catch (error) {
    toast.error("Une erreur est survenue, veuillez réessayer.");
    console.error(error);
  } finally {
    form.resetField("email", { value: "" });
    form.resetField("name", { value: "" });
    form.resetField("message", { value: "" });
    form.resetField("subject", { value: "" });

    isPending.value = false;
  }
});
</script>

<template>
  <form @submit.prevent="handleSubmit" class="space-y-7">
    <FormField v-slot="{ componentField }" name="name">
      <FormItem>
        <FormLabel> Nom </FormLabel>
        <FormControl>
          <Input type="text" v-bind="componentField" />
        </FormControl>
        <FormMessage />
      </FormItem>
    </FormField>

    <FormField v-slot="{ componentField }" name="subject">
      <FormItem>
        <FormLabel>Sujet</FormLabel>
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

    <FormField v-slot="{ componentField }" name="message">
      <FormItem>
        <FormLabel>Message</FormLabel>
        <FormControl>
          <Textarea v-bind="componentField" />
        </FormControl>
        <FormMessage />
      </FormItem>
    </FormField>

    <Button type="submit" :disabled="isPending">
      <template v-if="isPending">
        <Loader type="spinner" text="Chargement..." color="secondary" />
      </template>
      <template v-else> Connexion </template>
    </Button>
  </form>
</template>
