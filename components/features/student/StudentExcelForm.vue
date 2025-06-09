<script setup lang="ts">
import {
  SchemaStudentExcelForm,
  type SchemaStudentExcelFormInfer,
} from "@/definitions/student";
import { toTypedSchema } from "@vee-validate/zod";
import { useForm } from "vee-validate";
import { ref } from "vue";
import { toast } from "vue-sonner";

const props = defineProps<{
  onSubmit: (values: SchemaStudentExcelFormInfer) => Promise<void>;
}>();

const isPending = ref(false);

const formSchema = toTypedSchema(SchemaStudentExcelForm);

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
    isPending.value = false;
  }
});
</script>

<template>
  <form
    enctype="multipart/form-data"
    @submit.prevent="handleSubmit"
    class="space-y-7"
  >
    <FormField v-slot="{ componentField }" name="file">
      <FormItem>
        <FormLabel>Fichier</FormLabel>
        <FormControl>
          <Input type="file" v-bind="componentField" />
        </FormControl>
        <FormMessage />
      </FormItem>
    </FormField>
    <Button variant="secondary" type="submit" :disabled="isPending">
      <template v-if="isPending">
        <Loader type="spinner" text="Chargement..." color="secondary" />
      </template>
      <template v-else> Ajouter </template>
    </Button>
  </form>
</template>
