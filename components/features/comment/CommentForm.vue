<script setup lang="ts">
import {
  SchemaCommentForm,
  type SchemaCommentFormInfer,
} from "@/definitions/actuality"; // correction ici
import { toTypedSchema } from "@vee-validate/zod";
import { useForm } from "vee-validate";
import { ref } from "vue";
import { toast } from "vue-sonner";

const props = defineProps<{
  onSubmit: (values: SchemaCommentFormInfer) => Promise<void>;
}>();

const isPending = ref(false);
const auth = useAuth();

const formSchema = toTypedSchema(SchemaCommentForm);

const form = useForm({
  validationSchema: formSchema,
  initialValues: {
    username: auth.session.value?.name ?? "",
    message: "",
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
    <FormField v-slot="{ componentField }" name="username">
      <FormItem>
        <FormLabel>Nom d'utilisateur</FormLabel>
        <FormControl>
          <Input type="text" v-bind="componentField" />
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

    <Button variant="secondary" type="submit" :disabled="isPending">
      <template v-if="isPending">
        <Loader type="spinner" text="Chargement..." color="secondary" />
      </template>
      <template v-else>
        Publier
      </template>
    </Button>
  </form>
</template>
