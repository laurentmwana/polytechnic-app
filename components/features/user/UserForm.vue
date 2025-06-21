<script setup lang="ts">
import { SchemaUserForm, type SchemaUserFormInfer } from "@/definitions/user";
import { getRouteApi } from "@/lib/route";
import type { StudentModel, UserModel } from "@/types/model";
import { toTypedSchema } from "@vee-validate/zod";
import { useForm } from "vee-validate";
import { computed, ref } from "vue";
import { toast } from "vue-sonner";

const props = defineProps<{
  onSubmit: (values: SchemaUserFormInfer) => Promise<void>;
  user?: UserModel;
}>();


const students = ref<StudentModel[] | null>(null);
const studentsPending = ref(true);

import { onMounted } from "vue";

onMounted(async () => {
  studentsPending.value = true;
  try {
    const { data, error } = await useFetch<StudentModel[]>(getRouteApi("&student"));
    if (data) {
      students.value = data.value ?? [];
    }
  } catch (e) {
    toast.error("Erreur lors du chargement des étudiants.");
  } finally {
    studentsPending.value = false;
  }
});

// Schéma de validation typed
const formSchema = toTypedSchema(SchemaUserForm);

const form = useForm({
  validationSchema: formSchema,
  initialValues: {
    name: props.user?.name ?? "",
    email: props.user?.email ?? "",
    // Convertir student_id en string pour le Select
    student_id: props.user?.student?.id ? props.user.student.id.toString() : "",
    password: "",
    password_confirmation: "",
  },
});

// Texte placeholder du select
const selectPlaceholder = computed(() => {
  if (studentsPending.value) return "Chargement...";
  return "Sélectionner un étudiant";
});

const isPending = ref(false);

const handleSubmit = form.handleSubmit(async (values) => {
  isPending.value = true;
  try {
    await props.onSubmit(values);
    form.resetField("password", { value: "" });
    form.resetField("password_confirmation", { value: "" });
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
        <FormLabel>Nom d'utilisateur</FormLabel>
        <FormControl>
          <Input type="text" v-bind="componentField" />
        </FormControl>
        <FormMessage />
      </FormItem>
    </FormField>

    <FormField name="email" v-slot="{ componentField }">
      <FormItem>
        <FormLabel>Adresse e-mail</FormLabel>
        <FormControl>
          <Input type="email" v-bind="componentField" />
        </FormControl>
        <FormMessage />
      </FormItem>
    </FormField>

    <FormField name="student_id" v-slot="{ componentField }">
      <FormItem>
        <FormLabel>Étudiant</FormLabel>
        <FormControl>
          <Select v-bind="componentField" :disabled="studentsPending">
            <SelectTrigger class="w-full">
              <SelectValue :placeholder="selectPlaceholder" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup v-if="students && students.length > 0">
                <SelectLabel>Étudiants disponibles</SelectLabel>
                <SelectItem
                  v-for="student in students"
                  :key="student.id"
                  :value="student.id.toString()"
                >
                  {{ student.name }} - {{ student.firstname }}
                </SelectItem>
              </SelectGroup>
              <SelectGroup v-else-if="!studentsPending">
                <SelectLabel>Aucun étudiant trouvé</SelectLabel>
              </SelectGroup>
            </SelectContent>
          </Select>
        </FormControl>
        <FormMessage />
      </FormItem>
    </FormField>

    <FormField name="password" v-slot="{ componentField }">
      <FormItem>
        <FormLabel>Mot de passe</FormLabel>
        <FormControl>
          <Input type="password" v-bind="componentField" autocomplete="new-password" />
        </FormControl>
        <FormMessage />
      </FormItem>
    </FormField>

    <FormField name="password_confirmation" v-slot="{ componentField }">
      <FormItem>
        <FormLabel>Confirmation de mot de passe</FormLabel>
        <FormControl>
          <Input type="password" v-bind="componentField" autocomplete="new-password" />
        </FormControl>
        <FormMessage />
      </FormItem>
    </FormField>

    <Button variant="secondary" type="submit" :disabled="isPending">
      <template v-if="isPending">
        <Loader type="spinner" text="Chargement..." color="secondary" />
      </template>
      <template v-else>
        {{ props.user ? "Modifier" : "Créer" }}
      </template>
    </Button>
  </form>
</template>
