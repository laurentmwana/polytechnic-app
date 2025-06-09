<script setup lang="ts">
import {
  SchemaLevelForm,
  type SchemaLevelFormInfer,
} from "@/definitions/level";
import { getRouteApi } from "@/lib/route";
import type { LevelModel, OptionModel } from "@/types/model";
import { toTypedSchema } from "@vee-validate/zod";
import { useForm } from "vee-validate";
import { computed, ref } from "vue";
import { toast } from "vue-sonner";

const props = defineProps<{
  onSubmit: (values: SchemaLevelFormInfer) => Promise<void>;
  level?: LevelModel;
}>();

const { data: options, pending: optionPending } = await useFetch<OptionModel[]>(
  getRouteApi("&option")
);

const isPending = ref(false);

const formSchema = toTypedSchema(SchemaLevelForm);

const form = useForm({
  validationSchema: formSchema,
  initialValues: {
    name: props.level?.name ?? "",
    alias: props.level?.alias ?? "",
    programme: props.level?.programme ?? "",
    option_id: props.level?.option?.id?.toString() ?? "",
  },
});

const selectPlaceholder = computed(() => {
  if (optionPending.value) return "Chargement...";
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
    <FormField v-slot="{ componentField }" name="name">
      <FormItem>
        <FormLabel>Nom</FormLabel>
        <FormControl>
          <Input type="text" v-bind="componentField" />
        </FormControl>
        <FormMessage />
      </FormItem>
    </FormField>

    <FormField v-slot="{ componentField }" name="alias">
      <FormItem>
        <FormLabel>Alias</FormLabel>
        <FormControl>
          <Input type="text" v-bind="componentField" />
        </FormControl>
        <FormMessage />
      </FormItem>
    </FormField>

    <FormField v-slot="{ componentField }" name="option_id">
      <FormItem>
        <FormLabel>Option</FormLabel>
        <FormControl>
          <Select v-bind="componentField" :disabled="optionPending">
            <SelectTrigger class="w-full">
              <SelectValue :placeholder="selectPlaceholder" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup v-if="options && options.length > 0">
                <SelectLabel>Options disponibles</SelectLabel>
                <SelectItem
                  v-for="option in options"
                  :key="option.id"
                  :value="option.id.toString()"
                >
                  {{ option.name }}
                </SelectItem>
              </SelectGroup>
              <SelectGroup v-else-if="!optionPending">
                <SelectLabel>Aucune option trouvée</SelectLabel>
              </SelectGroup>
            </SelectContent>
          </Select>
        </FormControl>
        <FormMessage />
      </FormItem>
    </FormField>

    <FormField v-slot="{ componentField }" name="programme">
      <FormItem>
        <FormLabel>Programme</FormLabel>
        <FormControl>
          <Select v-bind="componentField">
            <SelectTrigger class="w-full">
              <SelectValue placeholder="Selectionner un système" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel> Programme </SelectLabel>
                <SelectItem value="nouveau système">
                  Licence Master Doctorat (LMD)
                </SelectItem>
                <SelectItem value="ancien système">
                  Graduat Licence Master Doctorat (GLMD)
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
        {{ props.level ? "Modifier" : "Créer" }}
      </template>
    </Button>
  </form>
</template>
