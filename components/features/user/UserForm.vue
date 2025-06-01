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

// Correction: useFetch doit être dans un composable ou une fonction async
const { data: students, pending: studentsPending } = await useFetch<
  StudentModel[]
>(getRouteApi("&student"));

const isPending = ref(false);

const formSchema = toTypedSchema(SchemaUserForm);

const form = useForm({
  validationSchema: formSchema,
  initialValues: {
    name: props.user?.name ?? "",
    email: props.user?.email ?? "",
    // Correction: convertir en string pour le select
    student_id: props.user?.student?.id?.toString() ?? "",
    password: "",
    password_confirmation: "",
  },
});

// Computed pour le texte du placeholder du select
const selectPlaceholder = computed(() => {
  if (studentsPending.value) return "Chargement...";
  return "Sélectionner un étudiant";
});

const handleSubmit = form.handleSubmit(async (values) => {
  isPending.value = true;

  try {
    await props.onSubmit(values);

    form.resetField("password", {value: ""})
    form.resetField("password_confirmation", {value: ""})
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
        <FormLabel>Nom d'utilisateur</FormLabel>
        <FormControl>
          <Input type="text" v-bind="componentField" />
        </FormControl>
        <FormMessage />
      </FormItem>
    </FormField>

    <FormField v-slot="{ componentField }" name="email">
      <FormItem>
        <FormLabel>Adresse e-mail</FormLabel>
        <FormControl>
          <Input type="email" v-bind="componentField" />
        </FormControl>
        <FormMessage />
      </FormItem>
    </FormField>

    <FormField v-slot="{ componentField }" name="student_id">
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

    <FormField v-slot="{ componentField }" name="password">
      <FormItem>
        <FormLabel>Mot de passe</FormLabel>
        <FormControl>
          <Input type="password" v-bind="componentField" />
        </FormControl>
        <FormMessage />
      </FormItem>
    </FormField>

    <FormField v-slot="{ componentField }" name="password_confirmation">
      <FormItem>
        <FormLabel>Confirmation de mot de passe</FormLabel>
        <FormControl>
          <Input type="password" v-bind="componentField" />
        </FormControl>
        <FormMessage />
      </FormItem>
    </FormField>

    <Button variant="secondary" type="submit" :disabled="isPending">
      <template v-if="isPending">
        <Loader type="spinner" text="Chargement..." />
      </template>
      <template v-else>
        {{ props.user ? "Modifier" : "Créer" }}
      </template>
    </Button>
  </form>
</template>
