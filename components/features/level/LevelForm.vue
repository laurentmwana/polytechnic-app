<script setup lang="ts">
import {
  SchemaLevelForm,
  type SchemaLevelFormInfer,
} from "@/definitions/level";
import { getRouteApi } from "@/lib/route";
import type { LevelModel, DepartmentModel } from "@/types/model";
import { toTypedSchema } from "@vee-validate/zod";
import { useForm } from "vee-validate";
import { computed, ref } from "vue";
import { toast } from "vue-sonner";

const props = defineProps<{
  onSubmit: (values: SchemaLevelFormInfer) => Promise<void>;
  level?: LevelModel;
}>();

const { data: departments, pending: departmentPending } = await useFetch<
  DepartmentModel[]
>(getRouteApi("&department"));

const isPending = ref(false);

const formSchema = toTypedSchema(SchemaLevelForm);

const form = useForm({
  validationSchema: formSchema,
  initialValues: {
    name: props.level?.name ?? "",
    alias: props.level?.alias ?? "",
    programme: props.level?.programme ?? "",
    department_id: props.level?.department?.id?.toString() ?? "", // conserve `department_id` si côté backend ça reste ainsi
  },
});

const selectPlaceholder = computed(() => {
  if (departmentPending.value) return "Chargement...";
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
    <!-- Nom -->
    <FormField v-slot="{ componentField }" name="name">
      <FormItem>
        <FormLabel>Nom</FormLabel>
        <FormControl>
          <Input type="text" v-bind="componentField" />
        </FormControl>
        <FormMessage />
      </FormItem>
    </FormField>

    <!-- Alias -->
    <FormField v-slot="{ componentField }" name="alias">
      <FormItem>
        <FormLabel>Alias</FormLabel>
        <FormControl>
          <Input type="text" v-bind="componentField" />
        </FormControl>
        <FormMessage />
      </FormItem>
    </FormField>

    <!-- Département -->
    <FormField v-slot="{ componentField }" name="department_id">
      <FormItem>
        <FormLabel>Département</FormLabel>
        <FormControl>
          <Select v-bind="componentField" :disabled="departmentPending">
            <SelectTrigger class="w-full">
              <SelectValue :placeholder="selectPlaceholder" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup v-if="departments?.length">
                <SelectLabel>Départements disponibles</SelectLabel>
                <SelectItem
                  v-for="department in departments"
                  :key="department.id"
                  :value="department.id.toString()"
                >
                  {{ department.name }}
                </SelectItem>
              </SelectGroup>
              <SelectGroup v-else-if="!departmentPending">
                <SelectLabel>Aucun département trouvé</SelectLabel>
              </SelectGroup>
            </SelectContent>
          </Select>
        </FormControl>
        <FormMessage />
      </FormItem>
    </FormField>

    <!-- Bouton -->
    <Button variant="secondary" type="submit" :disabled="isPending">
      <template v-if="isPending">
        <Loader type="spinner" text="Chargement..." color="secondary" />
      </template>
      <template v-else>
        {{ props.level ? "Modifier" : "Créer" }}
      </template>
    </Button>
  </form>
</template>
