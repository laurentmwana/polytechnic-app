<script setup lang="ts">
import {
  SchemaOptionForm,
  type SchemaOptionFormInfer,
} from "@/definitions/option";
import { getRouteApi } from "@/lib/route";
import type { DepartmentModel, OptionModel } from "@/types/model";
import { toTypedSchema } from "@vee-validate/zod";
import { useForm } from "vee-validate";
import { computed, ref } from "vue";
import { toast } from "vue-sonner";

const props = defineProps<{
  onSubmit: (values: SchemaOptionFormInfer) => Promise<void>;
  option?: OptionModel;
}>();

const { data: departments, pending: departmentsPending } = await useFetch<
  DepartmentModel[]
>(getRouteApi("&department"));

const isPending = ref(false);

const formSchema = toTypedSchema(SchemaOptionForm);

const form = useForm({
  validationSchema: formSchema,
  initialValues: {
    name: props.option?.name ?? "",
    alias: props.option?.alias ?? "",
    department_id: props.option?.department?.id?.toString() ?? "",
  },
});

// Computed pour le texte du placeholder du select
const selectPlaceholder = computed(() => {
  if (departmentsPending.value) return "Chargement...";
  return "Sélectionner un département";
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

    <FormField v-slot="{ componentField }" name="department_id">
      <FormItem>
        <FormLabel>Département</FormLabel>
        <FormControl>
          <Select v-bind="componentField" :disabled="departmentsPending">
            <SelectTrigger class="w-full">
              <SelectValue :placeholder="selectPlaceholder" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup v-if="departments && departments.length > 0">
                <SelectLabel>Départements disponibles</SelectLabel>
                <SelectItem
                  v-for="department in departments"
                  :key="department.id"
                  :value="department.id.toString()"
                >
                  {{ department.name }}
                </SelectItem>
              </SelectGroup>
              <SelectGroup v-else-if="!departmentsPending">
                <SelectLabel>Aucun départment trouvée</SelectLabel>
              </SelectGroup>
            </SelectContent>
          </Select>
        </FormControl>
        <FormMessage />
      </FormItem>
    </FormField>

    <Button variant="secondary" type="submit" :disabled="isPending">
      <template v-if="isPending">
        <Loader type="spinner" text="Chargement..." />
      </template>
      <template v-else>
        {{ props.option ? "Modifier" : "Créer" }}
      </template>
    </Button>
  </form>
</template>
