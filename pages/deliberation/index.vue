<template>
  <div class="container py-12">
    <div class="min-h-screen transition-colors duration-300">
      <div class="min-h-screen">
        <div>
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

          <!-- Filtres avec shadcn-vue -->
          <Card class="mb-6">
            <CardContent class="pt-2">
              <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div class="space-y-2 w-full">
                  <Label for="year-select">Année</Label>
                  <Select v-model="selectedYear">
                    <SelectTrigger id="year-select">
                      <SelectValue placeholder="Toutes les années" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Toutes les années</SelectItem>
                      <SelectItem
                        v-for="year in availableYears"
                        :key="year"
                        :value="year"
                      >
                        {{ year }}
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div class="space-y-2 w-full">
                  <Label for="level-select">Niveau</Label>
                  <Select v-model="selectedLevel">
                    <SelectTrigger id="level-select">
                      <SelectValue placeholder="Tous les niveaux" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Tous les niveaux</SelectItem>
                      <SelectItem
                        v-for="level in availableLevels"
                        :key="level"
                        :value="level"
                      >
                        {{ level }}
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div class="space-y-2 w-full">
                  <Label for="semester-select">Semestre</Label>
                  <Select v-model="selectedSemester">
                    <SelectTrigger id="semester-select">
                      <SelectValue placeholder="Tous les semestres" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Tous les semestres</SelectItem>
                      <SelectItem value="S1">Semestre 1</SelectItem>
                      <SelectItem value="S2">Semestre 2</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div class="flex items-end w-full">
                  <Button
                    @click="resetFilters"
                    variant="outline"
                    class="w-full"
                  >
                    <RotateCcwIcon class="w-4 h-4 mr-2" />
                    Réinitialiser
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <!-- Grille des délibérations -->
          <div
            v-if="!isPending && filteredDeliberations.length > 0"
            class="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6"
          >
            <Card
              v-for="deliberation in filteredDeliberations"
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
          <div
            v-else-if="isPending"
            class="flex justify-center items-center py-12"
          >
            <div class="flex items-center space-x-2">
              <div
                class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"
              ></div>
              <span class="text-muted-foreground"
                >Chargement des délibérations...</span
              >
            </div>
          </div>

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
            <Button @click="resetFilters" variant="outline">
              <RotateCcwIcon class="w-4 h-4 mr-2" />
              Réinitialiser les filtres
            </Button>
          </div>
        </div>
        <Pagination
          v-if="deliberations"
          :onPage="onPage"
          :meta="deliberations"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { DeliberationModel } from "@/types/model";
import { EyeIcon, FileTextIcon, RotateCcwIcon } from "lucide-vue-next";
import { computed, onMounted, ref } from "vue";
import { getCollectionDelibes } from "../../services/other";
import type { PaginatedResponse } from "../../types/paginate";

// État réactif
const selectedYear = ref<string>("all");
const selectedLevel = ref<string>("all");
const selectedSemester = ref<string>("all");
const isPending = ref<boolean>(true);
type DeliberationPaginateProps = PaginatedResponse<DeliberationModel[]>;
const deliberations = ref<DeliberationPaginateProps | null>(null);

const router = useRouter();
const route = useRoute();

const numberPage = ref<number>(
  route.query.page ? parseInt(route.query.page as string) : 1
);

// Propriétés calculées
const filteredDeliberations = computed(() => {
  return (deliberations.value ? deliberations.value.data : []).filter(
    (deliberation) => {
      const yearMatch =
        selectedYear.value === "all" ||
        !selectedYear.value ||
        deliberation.year?.name === selectedYear.value;
      const levelMatch =
        selectedLevel.value === "all" ||
        !selectedLevel.value ||
        deliberation.level?.name === selectedLevel.value;
      const semesterMatch =
        selectedSemester.value === "all" ||
        !selectedSemester.value ||
        deliberation.semester === selectedSemester.value;
      return yearMatch && levelMatch && semesterMatch;
    }
  );
});

const availableYears = computed(() => {
  const years = [
    ...new Set(
      (deliberations.value ? deliberations.value.data : [])
        .map((d) => d.year?.name)
        .filter(Boolean)
    ),
  ];
  return years.sort();
});

const availableLevels = computed(() => {
  const levels = [
    ...new Set(
      (deliberations.value ? deliberations.value.data : [])
        .map((d) => d.level?.name)
        .filter(Boolean)
    ),
  ];
  return levels.sort();
});

// Méthodes
const formatDate = (dateString: string | null) => {
  if (!dateString) return "N/A";
  const date = new Date(dateString);
  return date.toLocaleDateString("fr-FR", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const resetFilters = () => {
  selectedYear.value = "all";
  selectedLevel.value = "all";
  selectedSemester.value = "all";
};

const fetchDeliberations = async () => {
  try {
    isPending.value = true;
    const response = await getCollectionDelibes(numberPage.value);

    if (response.ok) {
      const data = await response.json();
      deliberations.value = data as DeliberationPaginateProps;
    } else {
      deliberations.value = null;
    }
  } catch (error) {
    console.error("Impossible de récupèrer les délibérations");
  } finally {
    isPending.value = false;
  }
};

const onPage = async (page: number) => {
  numberPage.value = page;
  await router.push(`/deliberation?page=${page}`);
  await fetchDeliberations();
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

onMounted(async () => {
  await fetchDeliberations();
});
</script>
