<script setup lang="ts">
import {
  SchemaResultForm,
  type SchemaResultFormInfer,
} from "~/definitions/result";
import { getRouteApi } from "@/lib/route";
import type { DeliberationModel, ResultModel } from "@/types/model";
import { toTypedSchema } from "@vee-validate/zod";
import { useForm } from "vee-validate";
import { computed, ref } from "vue";
import { toast } from "vue-sonner";

const props = defineProps<{
  onSubmit: (values: SchemaResultFormInfer) => Promise<void>;
  result?: ResultModel;
}>();

const { data: deliberations, pending: delibesPending } = await useFetch<{
  data: DeliberationModel[];
}>(getRouteApi("&delibe"));

const isPending = ref(false);

const formSchema = toTypedSchema(SchemaResultForm);

const form = useForm<SchemaResultFormInfer>({
  validationSchema: formSchema,
  initialValues: {
    deliberation_id: props.result?.deliberation?.id?.toString() ?? "",
    file: undefined,
  },
});

// Placeholder du select
const selectPlaceholder = computed(() => {
  if (delibesPending.value) return "Chargement...";
  return "Sélectionner une délibération";
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
          <Input type="file" v-bind="componentField" />
        </FormControl>
        <FormMessage />
      </FormItem>
    </FormField>

    <FormField v-slot="{ componentField }" name="deliberation_id">
      <FormItem>
        <FormLabel>Délibération</FormLabel>
        <FormControl>
          <Select v-bind="componentField" :disabled="delibesPending">
            <SelectTrigger class="w-full">
              <SelectValue :placeholder="selectPlaceholder" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup
                v-if="deliberations && deliberations.data.length > 0"
              >
                <SelectLabel>Délibérations disponibles</SelectLabel>
                <SelectItem
                  v-for="delibe in deliberations.data"
                  :key="delibe.id"
                  :value="delibe.id.toString()"
                >
                  {{ delibe.level.name }} {{ delibe.year.name }} [{{
                    delibe.semester
                  }}]
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

    <Button variant="secondary" type="submit" :disabled="isPending">
      <template v-if="isPending">
        <Loader type="spinner" text="Chargement..." color="secondary" />
      </template>
      <template v-else>
        {{ props.result ? "Modifier" : "Créer" }}
      </template>
    </Button>
  </form>
</template>
