<script setup lang="ts">
import {
  SchemaStudentForm,
  type SchemaStudentFormInfer,
} from "@/definitions/student";
import { getRouteApi } from "@/lib/route";
import type { LevelModel, StudentModel, YearModel } from "@/types/model";
import { toTypedSchema } from "@vee-validate/zod";
import { useForm } from "vee-validate";
import { computed, ref } from "vue";
import { toast } from "vue-sonner";

const props = defineProps<{
  onSubmit: (values: SchemaStudentFormInfer) => Promise<void>;
  student?: StudentModel;
}>();

// Chargement des niveaux et années
const { data: levels, pending: levelsPending } = await useFetch<LevelModel[]>(
  getRouteApi("&level")
);
const { data: years, pending: yearsPending } = await useFetch<YearModel[]>(
  getRouteApi("&year")
);

const isPending = ref(false);

const formSchema = toTypedSchema(SchemaStudentForm);

const form = useForm({
  validationSchema: formSchema,
  initialValues: {
    name: props.student?.name ?? "",
    firstname: props.student?.firstname ?? "",
    gender: props.student?.gender ?? "",
    phone: props.student?.phone ?? "",
    level_id: props.student?.actual_level?.level?.id?.toString() ?? "",
    year_academic_id: props.student?.actual_level?.year?.id?.toString() ?? "",
  },
});


const selectPlaceholder = computed(() => {
  if (levelsPending.value || yearsPending.value) return "Chargement...";
  return "Sélectionner une option";
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
    <FormField name="name" v-slot="{ componentField }">
      <FormItem>
        <FormLabel>Nom</FormLabel>
        <FormControl>
          <Input type="text" v-bind="componentField" />
        </FormControl>
        <FormMessage />
      </FormItem>
    </FormField>

    <FormField name="firstname" v-slot="{ componentField }">
      <FormItem>
        <FormLabel>Postnom</FormLabel>
        <FormControl>
          <Input type="text" v-bind="componentField" />
        </FormControl>
        <FormMessage />
      </FormItem>
    </FormField>

    <FormField name="phone" v-slot="{ componentField }">
      <FormItem>
        <FormLabel>Téléphone</FormLabel>
        <FormControl>
          <Input type="text" v-bind="componentField" />
        </FormControl>
        <FormMessage />
      </FormItem>
    </FormField>

    <FormField name="gender" v-slot="{ componentField }">
      <FormItem>
        <FormLabel>Genre</FormLabel>
        <FormControl>
          <Select v-bind="componentField">
            <SelectTrigger class="w-full">
              <SelectValue placeholder="Sélectionner un genre" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Genres</SelectLabel>
                <SelectItem value="homme">Homme</SelectItem>
                <SelectItem value="femme">Femme</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </FormControl>
        <FormMessage />
      </FormItem>
    </FormField>

    <FormField name="level_id" v-slot="{ componentField }">
      <FormItem>
        <FormLabel>Promotion</FormLabel>
        <FormControl>
          <Select v-bind="componentField" :disabled="levelsPending">
            <SelectTrigger class="w-full">
              <SelectValue :placeholder="selectPlaceholder" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup v-if="levels && levels.length > 0">
                <SelectLabel>Étudiants disponibles</SelectLabel>
                <SelectItem
                  v-for="level in levels"
                  :key="level.id"
                  :value="level.id.toString()"
                >
                  {{ level.alias }} {{  level.department ? `- [${level.department.alias}]` : '' }}
                </SelectItem>
              </SelectGroup>
              <SelectGroup v-else-if="!levelsPending">
                <SelectLabel>Aucune promotion trouvée</SelectLabel>
              </SelectGroup>
            </SelectContent>
          </Select>
        </FormControl>
        <FormMessage />
      </FormItem>
    </FormField>

    <FormField name="year_academic_id" v-slot="{ componentField }">
      <FormItem>
        <FormLabel>Année académique</FormLabel>
        <FormControl>
          <Select v-bind="componentField" :disabled="yearsPending">
            <SelectTrigger class="w-full">
              <SelectValue :placeholder="selectPlaceholder" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup v-if="years && years.length > 0">
                <SelectLabel>Années académiques</SelectLabel>
                <SelectItem
                  v-for="year in years"
                  :key="year.id"
                  :value="year.id.toString()"
                >
                  {{ year.name }} [{{ year.is_closed ? "Fermée" : "Actuelle" }}]
                </SelectItem>
              </SelectGroup>
              <SelectGroup v-else-if="!yearsPending">
                <SelectLabel>Aucune année trouvée</SelectLabel>
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
        {{ props.student ? "Modifier" : "Créer" }}
      </template>
    </Button>
  </form>
</template>
