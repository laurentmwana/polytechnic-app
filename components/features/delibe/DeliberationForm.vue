<script setup lang="ts">
import {
  SchemaDeliberationForm,
  type SchemaDeliberationFormInfer,
} from "@/definitions/deliberation";
import { getRouteApi } from "@/lib/route";
import type { DeliberationModel, LevelModel, YearModel } from "@/types/model";
import { toTypedSchema } from "@vee-validate/zod";
import { useForm } from "vee-validate";
import { computed, ref } from "vue";
import { toast } from "vue-sonner";

const props = defineProps<{
  onSubmit: (values: SchemaDeliberationFormInfer) => Promise<void>;
  delibe?: DeliberationModel;
}>();

const { data: levels, pending: levelPending } = await useFetch<LevelModel[]>(
  getRouteApi("&level")
);

const { data: years, pending: yearPending } = await useFetch<YearModel[]>(
  getRouteApi("&year")
);

const isPending = ref(false);

const formSchema = toTypedSchema(SchemaDeliberationForm);

const form = useForm({
  validationSchema: formSchema,
  initialValues: {
    criteria: props.delibe?.criteria ?? "",
    semester: props.delibe?.semester ?? "",
    start_at: props.delibe?.start_at ?? "",
    level_id: props.delibe?.level?.id?.toString() ?? "",
    year_academic_id: props.delibe?.year?.id?.toString() ?? "",
  },
});

const selectLevelPlaceholder = computed(() => {
  if (levelPending.value) return "Chargement...";
  return "Sélectionner une promotion";
});

const selectYearPlaceholder = computed(() => {
  if (levelPending.value) return "Chargement...";
  return "Sélectionner une année académique";
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
    <FormField v-slot="{ componentField }" name="start_at">
      <FormItem>
        <FormLabel>Début</FormLabel>
        <FormControl>
          <Input type="datetime-local" v-bind="componentField" />
        </FormControl>
        <FormMessage />
      </FormItem>
    </FormField>

    <FormField v-slot="{ componentField }" name="level_id">
      <FormItem>
        <FormLabel>Promotion</FormLabel>
        <FormControl>
          <Select v-bind="componentField" :disabled="levelPending">
            <SelectTrigger class="w-full">
              <SelectValue :placeholder="selectLevelPlaceholder" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup v-if="levels && levels.length > 0">
                <SelectLabel>Promotion disponibles</SelectLabel>
                <SelectItem
                  v-for="level in levels"
                  :key="level.id"
                  :value="level.id.toString()"
                >
                  {{ level.name }} [{{ level.programme }}]
                </SelectItem>
              </SelectGroup>
              <SelectGroup v-else-if="!levelPending">
                <SelectLabel>Aucune promotion trouvée</SelectLabel>
              </SelectGroup>
            </SelectContent>
          </Select>
        </FormControl>
        <FormMessage />
      </FormItem>
    </FormField>

    <FormField v-slot="{ componentField }" name="year_academic_id">
      <FormItem>
        <FormLabel>Année académique</FormLabel>
        <FormControl>
          <Select v-bind="componentField" :disabled="yearPending">
            <SelectTrigger class="w-full">
              <SelectValue :placeholder="selectYearPlaceholder" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup v-if="years && years.length > 0">
                <SelectLabel>Année académique disponibles</SelectLabel>
                <SelectItem
                  v-for="year in years"
                  :key="year.id"
                  :value="year.id.toString()"
                >
                  {{ year.name }} [{{ year.is_closed ? "Fermée" : "Ouverte" }}]
                </SelectItem>
              </SelectGroup>
              <SelectGroup v-else-if="!yearPending">
                <SelectLabel>Aucune année académique trouvée</SelectLabel>
              </SelectGroup>
            </SelectContent>
          </Select>
        </FormControl>
        <FormMessage />
      </FormItem>
    </FormField>

    <FormField v-slot="{ componentField }" name="semester">
      <FormItem>
        <FormLabel>Semestre</FormLabel>
        <FormControl>
          <Select v-bind="componentField">
            <SelectTrigger class="w-full">
              <SelectValue placeholder="Selectionner un semestre" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel> Semestres </SelectLabel>
                <SelectItem value="Semestre 1"> Semestre 1 </SelectItem>
                <SelectItem value="Semestre 2"> Semestre 2 </SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </FormControl>
        <FormMessage />
      </FormItem>
    </FormField>

    <FormField v-slot="{ componentField }" name="criteria">
      <FormItem>
        <FormLabel>Critère</FormLabel>
        <FormControl>
          <Textarea v-bind="componentField"></Textarea>
        </FormControl>
        <FormMessage />
      </FormItem>
    </FormField>

    <Button variant="secondary" type="submit" :disabled="isPending">
      <template v-if="isPending">
        <Loader type="spinner" text="Chargement..." />
      </template>
      <template v-else>
        {{ props.delibe ? "Modifier" : "Créer" }}
      </template>
    </Button>
  </form>
</template>
