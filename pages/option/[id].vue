<script setup lang="ts">
import { ago } from "@/lib/date-time";
import { getShowOption } from "@/services/other";
import type { OptionModel } from "@/types/model";
import { CalendarDays } from "lucide-vue-next";
import { toast } from "vue-sonner";

useHead({
  title: "En savoir plus sur une option - Polytechnic Application",
});
definePageMeta({
  layout: "default",
});

const route = useRoute();

const optionId = parseInt(route.params.id as string);

if (!optionId || isNaN(optionId)) {
  throw createError({
    statusCode: 400,
    statusMessage: "L'ID d'une option est requis et doit être un nombre valide",
  });
}

const isPending = ref<boolean>(true);
const option = ref<OptionModel>();

const fetchOption = async () => {
  try {
    isPending.value = true;

    const response = await getShowOption(optionId);
    const data = await response.json();

    if (response.ok) {
      option.value = (data as { data: OptionModel }).data;
    } else {
      toast.error("Erreur", {
        description:
          (data as { message: string }).message || "Une erreur est survenue",
      });
    }
  } catch (error) {
    toast.error("Erreur", {
      description: `Impossible de récupèrer les départments`,
    });
  } finally {
    isPending.value = false;
  }
};

onMounted(() => {
  fetchOption();
});
</script>

<template>
  <div class="container my-12">
    <GoBack back="/option" />
  </div>

  <div class="container my-12" v-if="isPending">
    <div class="section-page-header">
      <h2 class="section-page-title">
        En savoir plus sur le option #{{ optionId }}
      </h2>
    </div>

    <LoaderContainer :is-card="true" />
  </div>

  <div class="container my-12" v-if="option">
    <div class="section-page-header">
      <h2 class="section-page-title">
        En savoir plus sur l'option #{{ optionId }}
      </h2>
    </div>

    <div class="space-y-5">
      <Card class="border-t-2">
        <CardHeader>
          <CardTitle class="text-2xl md:text-3xl">
            {{ option.name }}
          </CardTitle>
          <CardDescription class="text-base">
            {{ option.alias }}
          </CardDescription>
        </CardHeader>
        <CardFooter
          class="border-t pt-4 text-sm text-muted-foreground flex flex-wrap gap-4"
        >
          <div class="flex items-center gap-1">
            <CalendarDays class="h-4 w-4" />
            <span>Créé : {{ ago(option.created_at) }}</span>
          </div>
          <div class="flex items-center gap-1">
            <CalendarDays class="h-4 w-4" />
            <span>Mis à jour : {{ ago(option.updated_at) }}</span>
          </div>
        </CardFooter>
      </Card>

      <div class="section-page-header">
        <h2 class="section-page-title">
          Les promotions associées à l' option #{{ optionId }}
        </h2>
      </div>
      <div>
        <Accordion
          type="single"
          collapsible
          class="grid gris-cols-1 md:grid-cols-2 gap-4 w-full"
        >
          <AccordionItem
            v-for="level in option.levels"
            class="mb-5 rounded-md border px-3 shadow-sm"
            :key="level.id"
            :value="level.id.toString()"
          >
            <AccordionTrigger class="text-base font-medium">
              {{ level.name }} {{ option.alias }}
            </AccordionTrigger>
            <AccordionContent
              >{{ level.name }} {{ option.name }} [{{
                level.programme
              }}]</AccordionContent
            >
          </AccordionItem>
        </Accordion>
      </div>
    </div>
  </div>
</template>
