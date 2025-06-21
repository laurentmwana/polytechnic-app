<script setup lang="ts">
import { ref, watch } from "vue";
import { useForm } from "vee-validate";
import { toTypedSchema } from "@vee-validate/zod";
import { toast } from "vue-sonner";

import {
  SchemaDepartmentForm,
  type SchemaDepartmentFormInfer,
} from "@/definitions/department";
import type { DepartmentModel } from "@/types/model";

const props = defineProps<{
  onSubmit: (values: SchemaDepartmentFormInfer) => Promise<void>;
  department?: DepartmentModel;
}>();

const isPending = ref(false);

const formSchema = toTypedSchema(SchemaDepartmentForm);

// Création du formulaire
const form = useForm<SchemaDepartmentFormInfer>({
  validationSchema: formSchema,
  initialValues: {
    name: props.department?.name ?? "",
    alias: props.department?.alias ?? "",
  },
});

// Si le `department` change dynamiquement (rare mais propre à gérer)
watch(
  () => props.department,
  (newDepartment) => {
    if (newDepartment) {
      form.setValues({
        name: newDepartment.name,
        alias: newDepartment.alias,
      });
    }
  }
);

// Soumission du formulaire
const handleSubmit = form.handleSubmit(async (values) => {
  isPending.value = true;
  try {
    await props.onSubmit(values);
  } catch (error) {
    console.error(error);
    toast.error("Une erreur est survenue lors de la soumission du formulaire.");
  } finally {
    isPending.value = false;
  }
});
</script>
<template>
  <form @submit.prevent="handleSubmit" class="space-y-7">
    <!-- Champ Nom -->
    <FormField v-slot="{ componentField }" name="name">
      <FormItem>
        <FormLabel for="name">Nom</FormLabel>
        <FormControl>
          <Input :disable="isPending" id="name" type="text" v-bind="componentField" />
        </FormControl>
        <FormMessage />
      </FormItem>
    </FormField>

    <!-- Champ Alias -->
    <FormField v-slot="{ componentField }" name="alias">
      <FormItem>
        <FormLabel for="alias">Alias</FormLabel>
        <FormControl>
          <Input :disable="isPending" id="alias" type="text" v-bind="componentField" />
        </FormControl>
        <FormMessage />
      </FormItem>
    </FormField>

    <!-- Bouton Submit -->
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
