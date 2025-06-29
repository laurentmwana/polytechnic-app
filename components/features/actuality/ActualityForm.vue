<script setup lang="ts">
import {
  SchemaActualityForm,
  type SchemaActualityFormInfer,
} from "@/definitions/actuality";
import type { ActualityModel } from "@/types/model";
import { toTypedSchema } from "@vee-validate/zod";
import { useForm } from "vee-validate";
import { toast } from "vue-sonner";

const props = defineProps<{
  onSubmit: (values: SchemaActualityFormInfer) => Promise<void>;
  actuality?: ActualityModel;
}>();

const isPending = ref(false);

const formSchema = toTypedSchema(SchemaActualityForm);

const form = useForm({
  validationSchema: formSchema,
  initialValues: {
    title: props.actuality?.title ?? "",
    description: props.actuality?.description ?? "",
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

     <FormField v-slot="{ componentField }" name="title">
      <FormItem>
        <FormLabel>Titre</FormLabel>
        <FormControl>
          <Input type="text" v-bind="componentField" />
        </FormControl>
        <FormMessage />
      </FormItem>
    </FormField>


    <FormField v-slot="{ componentField }" name="description">
      <FormItem>
        <FormLabel>Description</FormLabel>
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
        {{ props.actuality ? "Modifier" : "Créer" }}
      </template>
    </Button>
  </form>
</template>
