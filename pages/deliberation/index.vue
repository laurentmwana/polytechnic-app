<script setup lang="ts">
import type { DeliberationModel } from "@/types/model";
import { EyeIcon, FileTextIcon, RotateCcwIcon, Search } from "lucide-vue-next";
import { computed, onMounted, ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import { getCollectionDelibes } from "@/services/other";
import type { PaginatedResponse } from "@/types/paginate";
import { formatDate } from "~/lib/utils";

useHead({
  title: "Délibérations - Polytechnic Application",
});

definePageMeta({
  layout: "default",
});

const route = useRoute();
const router = useRouter();

const filters = ref([
  {
    title: "Semestre",
    label: "Par semestre",
    options: {
      all: "",
      s1: "Semestre 1",
      s2: "Semestre 2",
    },
  },
]);

const selectedSemester = ref<string>((route.query.semester as string) || "all");
const search = ref<string>((route.query.search as string) || "");
const numberPage = ref<number>(
  route.query.page ? parseInt(route.query.page as string) : 1
);
const isPending = ref<boolean>(true);
const deliberations = ref<PaginatedResponse<DeliberationModel[]> | null>(null);

const fetchDeliberations = async () => {
  try {
    isPending.value = true;
    const response = await getCollectionDelibes(numberPage.value, selectedSemester.value !== "all" ? selectedSemester.value : undefined, search.value || undefined);
    if (response.ok) {
      const data = await response.json();
      deliberations.value = data;
    } else {
      deliberations.value = null;
    }
  } catch {
    console.error("Erreur lors de la récupération des données");
  } finally {
    isPending.value = false;
  }
};

const updateQuery = async () => {
  await router.push({
    path: "/deliberation",
    query: {
      page: numberPage.value,
      semester: selectedSemester.value !== "all" ? selectedSemester.value : undefined,
      search: search.value || undefined,
    },
  });
  await fetchDeliberations();
};

const onPage = async (page: number) => {
  numberPage.value = page;
  await updateQuery();
};

const resetFilters = async () => {
  selectedSemester.value = "all";
  search.value = "";
  numberPage.value = 1;
  await router.push({ path: "/deliberation" });
  await fetchDeliberations();
};

const onSearchChange = async () => {
  numberPage.value = 1;
  await updateQuery();
};

const onFilterChange = async (value: string) => {
  selectedSemester.value = value;
  numberPage.value = 1;
  await updateQuery();
};

watch(
  () => route.query.page,
  (newPage) => {
    const pageNumber = newPage ? parseInt(newPage as string) : 1;
    if (pageNumber !== numberPage.value) {
      numberPage.value = pageNumber;
      fetchDeliberations();
    }
  }
);

onMounted(fetchDeliberations);
</script>

<template>
  <div class="container py-12">
    <div class="min-h-screen transition-colors duration-300">
      <div class="min-h-screen">
        <!-- Header -->
        <div class="mb-8 flex justify-between items-center">
          <div>
            <h1 class="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Délibérations
            </h1>
            <p class="text-gray-600 dark:text-gray-300">
              Gestion des délibérations par année et niveau
            </p>
          </div>
        </div>

        <!-- Filtres -->
        <div class="flex gap-3 justify-between flex-wrap mb-4">
          <div class="w-full md:w-56">
            <div class="flex gap-2">
              <Input
                placeholder="Recherche..."
                v-model="search"
                @keyup.enter="onSearchChange"
              />
              <Button
                :disabled="!search"
                variant="outline"
                @click="onSearchChange"
              >
                <Search :size="15" />
              </Button>
            </div>
          </div>
          <Select
            @update:modelValue="onFilterChange"
            :modelValue="selectedSemester"
          >
            <SelectTrigger class="w-full md:w-56">
              <SelectValue
                :placeholder="filters[0].label"
                :value="selectedSemester"
              />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup v-for="filter in filters" :key="filter.title">
                <SelectLabel>{{ filter.label }}</SelectLabel>
                <SelectItem
                  v-for="(value, key) in filter.options"
                  :key="key"
                  :value="key"
                >
                  {{ value || 'Tous' }}
                </SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>

        <!-- Résumé des filtres actifs -->
        <div
          v-if="selectedSemester !== 'all' || search"
          class="flex justify-between items-center text-sm bg-muted px-4 py-2 border rounded mb-6"
        >
          <div>
            Résultats
            <span v-if="search"
              >pour la recherche "<strong>{{ search }}</strong
              >"</span
            >
            <span v-if="selectedSemester !== 'all'"
              >, semestre "<strong>{{ selectedSemester }}</strong
              >"</span
            >
          </div>
          <Button variant="outline" size="sm" @click="resetFilters"
            >Tout afficher</Button
          >
        </div>

        <!-- Grille des délibérations -->
        <div
          v-if="!isPending && deliberations && deliberations.data.length > 0"
          class="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6"
        >
          <Card
            v-for="deliberation in deliberations.data"
            :key="deliberation.id"
            class="hover:shadow-md transition-shadow duration-200"
          >
            <CardHeader>
              <div class="flex justify-between items-start">
                <div>
                  <CardTitle class="text-lg">
                    {{ deliberation.year?.name || "N/A" }} -
                    {{ deliberation.level?.name || "N/A" }}
                  </CardTitle>
                  <div class="flex items-center space-x-2 mt-2">
                    <Badge variant="secondary">
                      {{ deliberation.semester }}
                    </Badge>
                    <span class="text-sm text-muted-foreground">
                      ID: {{ deliberation.id }}
                    </span>
                  </div>
                </div>
              </div>
            </CardHeader>

            <CardContent>
              <!-- Informations de date -->
              <div class="grid grid-cols-2 gap-4 text-sm mb-4">
                <div>
                  <span class="font-medium">Début:</span>
                  <p class="text-muted-foreground">
                    {{ formatDate(deliberation.start_at) }}
                  </p>
                </div>
                <div>
                  <span class="font-medium">Juries:</span>
                  <p class="text-muted-foreground">
                    {{ deliberation.juries?.length || 0 }}
                  </p>
                </div>
              </div>
            </CardContent>

            <CardFooter>
              <Button class="w-full" variant="outline" asChild>
                <NuxtLink :href="`/deliberation/${deliberation.id}`">
                  <EyeIcon class="w-4 h-4 mr-2" />
                  En savoir plus
                </NuxtLink>
              </Button>
            </CardFooter>
          </Card>
        </div>

        <!-- Loading state -->

        <LoaderContainer 
          v-else-if="isPending"
        />

        <!-- État vide -->
        <div v-else class="text-center py-12">
          <FileTextIcon
            class="mx-auto h-12 w-12 text-muted-foreground mb-4"
          />
          <h3 class="text-lg font-medium mb-2">
            Aucune délibération trouvée
          </h3>
          <p class="text-muted-foreground mb-4">
            Essayez de modifier vos filtres pour voir plus de résultats.
          </p>
        </div>

        <!-- Pagination -->
        <Pagination
          v-if="deliberations && !isPending"
          :onPage="onPage"
          :meta="deliberations"
        />
      </div>
    </div>
  </div>
</template>
