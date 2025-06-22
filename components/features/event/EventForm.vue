<script setup lang="ts">
import {
  SchemaEventForm,
  type SchemaEventFormInfer,
} from "@/definitions/event";
import { getRouteApi } from "@/lib/route";
import type { EventModel, LevelModel, YearModel } from "@/types/model";
import { toTypedSchema } from "@vee-validate/zod";
import { useForm } from "vee-validate";
import { computed, ref } from "vue";
import { toast } from "vue-sonner";
import { TextareaMarkdown } from "~/components/ui/textarea";

const props = defineProps<{
  onSubmit: (values: SchemaEventFormInfer) => Promise<void>;
  event?: EventModel;
}>();

function formatDatetimeLocal(dateStr?: string): string {
  if (!dateStr) return "";
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) return "";
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  return `${year}-${month}-${day}T${hours}:${minutes}`;
}

const { data: levels, pending: levelPending } = await useFetch<LevelModel[]>(
  getRouteApi("&level")
);

const { data: years, pending: yearPending } = await useFetch<YearModel[]>(
  getRouteApi("&year")
);

const isPending = ref(false);

const formSchema = toTypedSchema(SchemaEventForm);

const form = useForm({
  validationSchema: formSchema,
  initialValues: {
    title: props.event?.title ?? "",
    content: props.event?.content ?? "",
    description: props.event?.description ?? "",
    start_at: formatDatetimeLocal(props.event?.start_at),
    level_id: props.event?.level?.id?.toString() ?? "",
    year_academic_id: props.event?.year?.id?.toString() ?? "",
    tags: props.event?.tags ?? [],
    url: props.event?.url ?? "",
  },
});

const selectLevelPlaceholder = computed(() =>
  levelPending.value ? "Chargement..." : "Sélectionner une promotion"
);

const selectYearPlaceholder = computed(() =>
  yearPending.value ? "Chargement..." : "Sélectionner une année académique"
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
    <!-- Titre -->
    <FormField v-slot="{ componentField }" name="title">
      <FormItem>
        <FormLabel>Titre</FormLabel>
        <FormControl>
          <Input type="text" v-bind="componentField" />
        </FormControl>
        <FormMessage />
      </FormItem>
    </FormField>

    <!-- description -->
    <FormField v-slot="{ componentField }" name="description">
      <FormItem>
        <FormLabel>Description</FormLabel>
        <FormControl>
          <Textarea v-bind="componentField" />
        </FormControl>
        <FormMessage />
      </FormItem>
    </FormField>

    <!-- Début -->
    <FormField v-slot="{ componentField }" name="start_at">
      <FormItem>
        <FormLabel>Date de début</FormLabel>
        <FormControl>
          <Input type="datetime-local" v-bind="componentField" />
        </FormControl>
        <FormMessage />
      </FormItem>
    </FormField>

    <!-- Promotion -->
    <FormField v-slot="{ componentField }" name="level_id">
      <FormItem>
        <FormLabel>Promotion</FormLabel>
        <FormControl>
          <Select v-bind="componentField" :disabled="levelPending">
            <SelectTrigger class="w-full">
              <SelectValue :placeholder="selectLevelPlaceholder" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup v-if="levels?.length">
                <SelectLabel>Promotions disponibles</SelectLabel>
                <SelectItem
                  v-for="level in levels"
                  :key="level.id"
                  :value="level.id.toString()"
                >
                  <template v-if="level.department">
                    {{ level.name }} [{{ level.department.alias }}]
                  </template>
                  <template v-else>
                    {{ level.name }}
                  </template>
                </SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </FormControl>
        <FormMessage />
      </FormItem>
    </FormField>

    <!-- Année académique -->
    <FormField v-slot="{ componentField }" name="year_academic_id">
      <FormItem>
        <FormLabel>Année académique</FormLabel>
        <FormControl>
          <Select v-bind="componentField" :disabled="yearPending">
            <SelectTrigger class="w-full">
              <SelectValue :placeholder="selectYearPlaceholder" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup v-if="years?.length">
                <SelectLabel>Années académiques</SelectLabel>
                <SelectItem
                  v-for="year in years"
                  :key="year.id"
                  :value="year.id.toString()"
                >
                  {{ year.name }} [{{ year.is_closed ? "Fermée" : "Ouverte" }}]
                </SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </FormControl>
        <FormMessage />
      </FormItem>
    </FormField>

    <!-- Tags -->
    <!-- Tags -->
    <FormField v-slot="{ componentField }" name="tags">
      <FormItem>
        <FormLabel>Tags</FormLabel>
        <FormControl>
          <TagsInput
            :model-value="componentField.modelValue"
            @update:model-value="componentField['onUpdate:modelValue']"
          >
            <TagsInputItem
              v-for="item in componentField.modelValue"
              :key="item"
              :value="item"
            >
              <TagsInputItemText />
              <TagsInputItemDelete />
            </TagsInputItem>

            <TagsInputInput placeholder="Ajouter un tag..." />
          </TagsInput>
        </FormControl>
        <FormMessage />
      </FormItem>
    </FormField>

    <!-- URL -->
    <FormField v-slot="{ componentField }" name="url">
      <FormItem>
        <FormLabel>Lien externe (facultatif)</FormLabel>
        <FormControl>
          <Input type="url" v-bind="componentField" />
        </FormControl>
        <FormMessage />
      </FormItem>
    </FormField>

    <!-- Contenu -->
    <FormField v-slot="{ componentField }" name="content">
      <FormItem>
        <FormLabel>Contenu</FormLabel>
        <FormControl>
          <TextareaMarkdown
            v-model="componentField.modelValue"
            :placeholder="'Écrivez votre contenu ici...'"
            @update:modelValue="componentField['onUpdate:modelValue']"
          />
        </FormControl>
        <FormMessage />
      </FormItem>
    </FormField>

    <!-- Bouton -->
    <Button variant="secondary" type="submit" :disabled="isPending">
      <template v-if="isPending">
        <Loader type="spinner" text="Enregistrement..." color="secondary" />
      </template>
      <template v-else>
        {{ props.event ? "Modifier l'évènement" : "Créer l'évènement" }}
      </template>
    </Button>
  </form>
</template>
