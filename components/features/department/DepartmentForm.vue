<script setup lang="ts">
import {
  SchemaDepartmentForm,
  type SchemaDepartmentFormInfer,
} from "@/definitions/department";
import type { DepartmentModel } from "@/types/model";
import { toTypedSchema } from "@vee-validate/zod";
import { useForm } from "vee-validate";
import { ref } from "vue";
import { toast } from "vue-sonner";

const props = defineProps<{
  onSubmit: (values: SchemaDepartmentFormInfer) => Promise<void>;
  department?: DepartmentModel;
}>();

const isPending = ref(false);

const formSchema = toTypedSchema(SchemaDepartmentForm);

const form = useForm({
  validationSchema: formSchema,
  initialValues: {
    name: props.department?.name ?? "",
    alias: props.department?.alias ?? "",
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
        <FormLabel>Nom</FormLabel>
        <FormControl>
          <Input type="text" v-bind="componentField" />
        </FormControl>
        <FormMessage />
      </FormItem>
    </FormField>

    <FormField v-slot="{ componentField }" name="alias">
      <FormItem>
        <FormLabel>Alias</FormLabel>
        <FormControl>
          <Input type="text" v-bind="componentField" />
        </FormControl>
        <FormMessage />
      </FormItem>
    </FormField>

    <Button variant="secondary" type="submit" :disabled="isPending">
      <template v-if="isPending">
        <Loader type="spinner" text="Chargement..." color="secondary" />
      </template>
      <template v-else>
        {{ props.department ? "Modifier" : "Créer" }}
      </template>
    </Button>
  </form>
</template>
