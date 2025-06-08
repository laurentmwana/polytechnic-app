<script setup lang="ts">
import { SchemaJuryForm, type SchemaJuryFormInfer } from "@/definitions/jury";
import { getRouteApi } from "@/lib/route";
import type { DeliberationModel, JuryModel, TeacherModel } from "@/types/model";
import { toTypedSchema } from "@vee-validate/zod";
import { useForm } from "vee-validate";
import { computed, ref } from "vue";
import { toast } from "vue-sonner";

const props = defineProps<{
  onSubmit: (values: SchemaJuryFormInfer) => Promise<void>;
  jury?: JuryModel;
}>();

const { data: delibes, pending: delibePending } = await useFetch<{
  data: DeliberationModel[];
}>(getRouteApi("&delibe"));

const { data: teachers, pending: teacherPending } = await useFetch<
  TeacherModel[]
>(getRouteApi("&teacher"));

const isPending = ref(false);

const formSchema = toTypedSchema(SchemaJuryForm);

const form = useForm({
  validationSchema: formSchema,
  initialValues: {
    teacher_id: props.jury?.teacher?.id?.toString() ?? "",
    deliberation_id: props.jury?.deliberation?.id?.toString() ?? "",
  },
});

const selectTeacherPlaceholder = computed(() => {
  if (teacherPending.value) return "Chargement...";
  return "Sélectionner un professeur";
});

const selectDelibePlaceholder = computed(() => {
  if (delibePending.value) return "Chargement...";
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
    <FormField v-slot="{ componentField }" name="deliberation_id">
      <FormItem>
        <FormLabel>Délibération</FormLabel>
        <FormControl>
          <Select v-bind="componentField" :disabled="delibePending">
            <SelectTrigger class="w-full">
              <SelectValue :placeholder="selectDelibePlaceholder" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup
                v-if="delibes && delibes.data && delibes.data.length > 0"
              >
                <SelectLabel>Promotion disponibles</SelectLabel>
                <SelectItem
                  v-for="delibe in delibes.data"
                  :key="delibe.id"
                  :value="delibe.id.toString()"
                >
                  {{ delibe.level.name }} [{{ delibe.year.name }}] pour
                  {{ delibe.start_at }}
                </SelectItem>
              </SelectGroup>
              <SelectGroup v-else-if="!delibePending">
                <SelectLabel>Aucune délibération trouvée</SelectLabel>
              </SelectGroup>
            </SelectContent>
          </Select>
        </FormControl>
        <FormMessage />
      </FormItem>
    </FormField>

    <FormField v-slot="{ componentField }" name="teacher_id">
      <FormItem>
        <FormLabel>Professeurs</FormLabel>
        <FormControl>
          <Select v-bind="componentField" :disabled="teacherPending">
            <SelectTrigger class="w-full">
              <SelectValue :placeholder="selectTeacherPlaceholder" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup v-if="teachers && teachers.length > 0">
                <SelectLabel>Professeur disponibles</SelectLabel>
                <SelectItem
                  v-for="teacher in teachers"
                  :key="teacher.id"
                  :value="teacher.id.toString()"
                >
                  {{ teacher.name }} {{ teacher.firstname }}
                </SelectItem>
              </SelectGroup>
              <SelectGroup v-else-if="!teacherPending">
                <SelectLabel>Aucun professeur trouvée</SelectLabel>
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
        {{ props.jury ? "Modifier" : "Créer" }}
      </template>
    </Button>
  </form>
</template>
