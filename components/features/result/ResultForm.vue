<script setup lang="ts">
import { ref, computed } from "vue";
import { useForm } from "vee-validate";
import { toTypedSchema } from "@vee-validate/zod";
import { toast } from "vue-sonner";
import {
  SchemaResultForm,
  type SchemaResultFormInfer,
} from "~/definitions/result";
import { getRouteApi } from "@/lib/route";
import type { DeliberationModel, ResultModel } from "@/types/model";

// Props
const props = defineProps<{
  onSubmit: (values: SchemaResultFormInfer) => Promise<void>;
  result?: ResultModel;
}>();

// Chargement des délibérations
const { data: deliberations, pending: delibesPending } = await useFetch<{
  data: DeliberationModel[];
}>(getRouteApi("&delibe", {year: 'no-closed'}));

// Etat du formulaire
const isPending = ref(false);

// Schéma de validation
const formSchema = toTypedSchema(SchemaResultForm);

// Formulaire
const form = useForm<SchemaResultFormInfer>({
  validationSchema: formSchema,
  initialValues: {
    deliberation_id: props.result?.deliberation?.id?.toString() ?? "",
    file: null,
  },
});

// Placeholder
const selectPlaceholder = computed(() => {
  if (delibesPending.value) return "Chargement...";
  return "Sélectionner une délibération";
});

// Soumission
const handleSubmit = form.handleSubmit(async (values) => {
  isPending.value = true;
  try {
    await props.onSubmit(values);
    form.reset({
      file: null,
      deliberation_id: "",
    });
  } catch (error) {
    console.error("Erreur formulaire :", error);
  } finally {
    isPending.value = false;
  }
});
</script>
<template>
  <form @submit.prevent="handleSubmit" class="space-y-7">
    <FormField name="file" v-slot="{ componentField, field, meta }">
      <FormItem>
        <FormLabel>Fichier</FormLabel>
        <FormControl>
          <Input
            type="file"
            accept=".xlsx,.xls"
            :name="field.name"
            v-bind="componentField"
            :disabled="isPending"
            class="input-file"
          />
        </FormControl>
        <FormMessage />
      </FormItem>
    </FormField>

    <FormField name="deliberation_id" v-slot="{ componentField }">
      <FormItem>
        <FormLabel>Délibération</FormLabel>
        <FormControl>
          <Select
            v-bind="componentField"
            :disabled="delibesPending || isPending"
          >
            <SelectTrigger class="w-full">
              <SelectValue :placeholder="selectPlaceholder" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup v-if="deliberations?.data?.length">
                <SelectLabel>Délibérations disponibles</SelectLabel>
                <SelectItem
                  v-for="delibe in deliberations.data"
                  :key="delibe.id"
                  :value="delibe.id.toString()"
                >
                  {{ delibe.level.alias }}
                  {{
                    delibe.level.department ? delibe.level.department.alias : ""
                  }}
                  {{ delibe.year.name }} {{ delibe.semester }}
                </SelectItem>
              </SelectGroup>
              <SelectGroup v-else-if="!delibesPending">
                <SelectLabel>Aucune délibération trouvée</SelectLabel>
              </SelectGroup>
            </SelectContent>
          </Select>
        </FormControl>
        <FormMessage />
      </FormItem>
    </FormField>

    <Button
      variant="secondary"
      type="submit"
      :disabled="isPending || delibesPending"
    >
      <template v-if="isPending">
        <Loader type="spinner" text="Chargement..." color="secondary" />
      </template>
      <template v-else>
        {{ props.result ? "Modifier" : "Créer" }}
      </template>
    </Button>
  </form>
</template>
