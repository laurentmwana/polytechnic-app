<script setup lang="ts">
import {
  SchemaTeacherForm,
  type SchemaTeacherFormInfer,
} from "@/definitions/teacher";
import { getRouteApi } from "@/lib/route";
import type { DepartmentModel, TeacherModel } from "@/types/model";
import { toTypedSchema } from "@vee-validate/zod";
import { useForm } from "vee-validate";
import { ref, computed } from "vue";
import { toast } from "vue-sonner";

const props = defineProps<{
  onSubmit: (values: SchemaTeacherFormInfer) => Promise<void>;
  teacher?: TeacherModel;
}>();

const { data: departments, pending: departmentsPending } = await useFetch<DepartmentModel[]>(
  getRouteApi("&department")
);

const isPending = ref(false);

const form = useForm({
  validationSchema: toTypedSchema(SchemaTeacherForm),
  initialValues: {
    name: props.teacher?.name ?? "",
    firstname: props.teacher?.firstname ?? "",
    gender: props.teacher?.gender ?? "",
    phone: props.teacher?.phone ?? "",
    department_id: props.teacher?.department?.id?.toString() ?? "",
  },
});

const selectPlaceholder = computed(() =>
  departmentsPending.value ? "Chargement..." : "Sélectionner un département"
);

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

    <!-- Postnom -->
    <FormField v-slot="{ componentField }" name="firstname">
      <FormItem>
        <FormLabel>Postnom</FormLabel>
        <FormControl>
          <Input type="text" v-bind="componentField" />
        </FormControl>
        <FormMessage />
      </FormItem>
    </FormField>

    <!-- Téléphone -->
    <FormField v-slot="{ componentField }" name="phone">
      <FormItem>
        <FormLabel>Téléphone</FormLabel>
        <FormControl>
          <Input type="text" v-bind="componentField" />
        </FormControl>
        <FormMessage />
      </FormItem>
    </FormField>

    <!-- Genre -->
    <FormField v-slot="{ componentField }" name="gender">
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

    <!-- Département -->
    <FormField v-slot="{ componentField }" name="department_id">
      <FormItem>
        <FormLabel>Département</FormLabel>
        <FormControl>
          <Select v-bind="componentField" :disabled="departmentsPending">
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
                  {{ department.name }} - [{{ department.alias }}]
                </SelectItem>
              </SelectGroup>
              <SelectGroup v-else-if="!departmentsPending">
                <SelectLabel>Aucun département trouvé</SelectLabel>
              </SelectGroup>
            </SelectContent>
          </Select>
        </FormControl>
        <FormMessage />
      </FormItem>
    </FormField>

    <!-- Submit -->
    <Button variant="secondary" type="submit" :disabled="isPending">
      <template v-if="isPending">
        <Loader type="spinner" text="Chargement..." color="secondary" />
      </template>
      <template v-else>
        {{ props.teacher ? "Modifier" : "Créer" }}
      </template>
    </Button>
  </form>
</template>
