<script setup lang="ts">
import {
  SchemaCourseForm,
  type SchemaCourseFormInfer,
} from "@/definitions/course";
import { getRouteApi } from "@/lib/route";
import type { CourseModel, LevelModel, TeacherModel } from "@/types/model";
import { toTypedSchema } from "@vee-validate/zod";
import { useForm } from "vee-validate";
import { computed, ref } from "vue";
import { toast } from "vue-sonner";

const props = defineProps<{
  onSubmit: (values: SchemaCourseFormInfer) => Promise<void>;
  course?: CourseModel;
}>();

const { data: levels, pending: levelsPending } = await useFetch<LevelModel[]>(
  getRouteApi("&level")
);

const { data: teachers, pending: teachersPending } = await useFetch<
  TeacherModel[]
>(getRouteApi("&teacher"));

const semesters = [
  { id: "Semestre 1", label: "Semestre 1" },
  { id: "Semestre 2", label: "Semestre 2" },
];

const isPending = ref(false);

const formSchema = toTypedSchema(SchemaCourseForm);

const form = useForm({
  validationSchema: formSchema,
  initialValues: {
    name: props.course?.name ?? "",
    code: props.course?.code ?? "",
    credits: props.course?.credits.toString() ?? "0",
    level_id: props.course?.level?.id?.toString() ?? "",
    teacher_id: props.course?.teacher.id.toString() ?? "",
    semester: props.course?.semester ?? "",
  },
});

const selectPlaceholder = computed(() => {
  if (levelsPending.value) return "Chargement...";
  return "Sélectionner une promotion";
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

    <FormField v-slot="{ componentField }" name="code">
      <FormItem>
        <FormLabel>Code</FormLabel>
        <FormControl>
          <Input type="text" v-bind="componentField" />
        </FormControl>
        <FormMessage />
      </FormItem>
    </FormField>

    <FormField v-slot="{ componentField }" name="credits">
      <FormItem>
        <FormLabel>Crédits</FormLabel>
        <FormControl>
          <Input type="text" v-bind="componentField" />
        </FormControl>
        <FormMessage />
      </FormItem>
    </FormField>

    <FormField v-slot="{ componentField }" name="level_id">
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
                  {{ level.name }} - [{{ level.department.alias }}]
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

    <FormField v-slot="{ componentField }" name="teacher_id">
      <FormItem>
        <FormLabel> Professeur </FormLabel>
        <FormControl>
          <Select v-bind="componentField" :disabled="teachersPending">
            <SelectTrigger class="w-full">
              <SelectValue :placeholder="selectPlaceholder" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup v-if="teachers && teachers.length > 0">
                <SelectLabel>Années académiques</SelectLabel>
                <SelectItem
                  v-for="teacher in teachers"
                  :key="teacher.id"
                  :value="teacher.id.toString()"
                >
                  {{ teacher.name }} {{ teacher.firstname }}
                </SelectItem>
              </SelectGroup>
              <SelectGroup v-else-if="!teachersPending">
                <SelectLabel>Aucune professeur trouvée</SelectLabel>
              </SelectGroup>
            </SelectContent>
          </Select>
        </FormControl>
        <FormMessage />
      </FormItem>
    </FormField>

    <!-- Nouveau champ Semestre -->
    <FormField name="semester" v-slot="{ componentField }">
      <FormItem>
        <FormLabel>Semestre</FormLabel>
        <FormControl>
          <Select v-bind="componentField">
            <SelectTrigger class="w-full">
              <SelectValue placeholder="Sélectionner un semestre" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Semestres</SelectLabel>
                <SelectItem
                  v-for="sem in semesters"
                  :key="sem.id"
                  :value="sem.id"
                >
                  {{ sem.label }}
                </SelectItem>
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
        {{ props.course ? "Modifier" : "Créer" }}
      </template>
    </Button>
  </form>
</template>
