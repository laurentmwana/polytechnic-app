<script setup lang="ts">
import {
  SchemaStudentExcelForm,
  type SchemaStudentExcelFormInfer,
} from "@/definitions/student";
import type { StudentModel } from "@/types/model";
import { toTypedSchema } from "@vee-validate/zod";
import { useForm } from "vee-validate";
import { ref } from "vue";
import { toast } from "vue-sonner";
import { ExcelUploader } from "../../ui/file";

const props = defineProps<{
  onSubmit: (values: SchemaStudentExcelFormInfer) => Promise<void>;
  student?: StudentModel;
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
  <form @submit.prevent="handleSubmit" class="space-y-7">
    <FormField v-slot="{ componentField }" name="file">
      <FormItem>
        <FormLabel>Fichier</FormLabel>
        <FormControl>
          <ExcelUploader v-bind="componentField" />
        </FormControl>
        <FormMessage />
      </FormItem>
    </FormField>
    <Button variant="secondary" type="submit" :disabled="isPending">
      <template v-if="isPending">
        <Loader type="spinner" text="Chargement..." />
      </template>
      <template v-else>
        {{ props.student ? "Modifier" : "Créer" }}
      </template>
    </Button>
  </form>
</template>
