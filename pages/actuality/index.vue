<script setup lang="ts">
import { ref, watch, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useHead, definePageMeta, useAuth } from "#imports";

import ConfirmationDialog from "@/components/ui/dialog/ConfirmationDialog.vue";
import { ago } from "@/lib/date-time";
import { excerpt } from "@/lib/utils";
import { getCollectionActualities } from "@/services/other";
import type { ActualityModel } from "@/types/model";
import type { PaginatedResponse } from "@/types/paginate";
import { ArrowRight, Heart, MessageSquare, Search } from "lucide-vue-next";
import { toast } from "vue-sonner";

useHead({
  title: "Les actualités - Polytechnic Application",
});

definePageMeta({
  layout: "default",
});

const auth = useAuth();

type ActualityPaginateProps = PaginatedResponse<ActualityModel[]>;

const filters = ref([
  {
    title: "Organisation",
    label: "Trier par",
    options: {
      asc: "Ascendant",
      desc: "Descendant",
    },
  },
]);

const route = useRoute();
const router = useRouter();

const selectedOrder = ref<string | null>(
  (route.query.order as string) || null
);
const search = ref<string>((route.query.search as string) || "");
const isPending = ref(true);
const actualities = ref<ActualityPaginateProps>();
const showModalFollowId = ref<number | null>(null);
const numberPage = ref(
  route.query.page ? parseInt(route.query.page as string, 10) : 1
);

const fetchActualities = async () => {
  try {
    isPending.value = true;

    const response = await getCollectionActualities(
      numberPage.value,
      selectedOrder.value,
      search.value
    );
    const data = await response.json();

    if (response.ok) {
      actualities.value = data as ActualityPaginateProps;
    } else {
      toast.error("Erreur", {
        description:
          (data as { message?: string }).message || "Une erreur est survenue.",
      });
    }
  } catch (error) {
    toast.error("Erreur", {
      description: "Impossible de récupérer les actualités.",
    });
  } finally {
    isPending.value = false;
  }
};

const updateQuery = async () => {
  await router.push({
    path: "/actuality",
    query: {
      page: numberPage.value,
      order: selectedOrder.value ?? undefined,
      search: search.value || undefined,
    },
  });
  await fetchActualities();
};

const resetFilters = async () => {
  search.value = "";
  selectedOrder.value = null;
  numberPage.value = 1;

  await router.push({ path: "/actuality" });
  await fetchActualities();
};

const onPage = async (page: number) => {
  numberPage.value = page;
  await updateQuery();
};

const onFilterChange = async (value: string) => {
  selectedOrder.value = value;
  numberPage.value = 1;
  await updateQuery();
};

const onSearchChange = async () => {
  if (!search.value) return;
  numberPage.value = 1;
  await updateQuery();
};

watch(
  () => route.query.page,
  (newPage) => {
    const pageNumber = newPage ? parseInt(newPage as string, 10) : 1;
    if (pageNumber !== numberPage.value) {
      numberPage.value = pageNumber;
      fetchActualities();
    }
  }
);

onMounted(fetchActualities);
</script>

<template>
  <div class="container my-12" v-if="isPending">
    <div class="section-page-header">
      <h2 class="section-page-title">Actualités</h2>
    </div>
    <LoaderContainer :is-card="true" />
  </div>

  <div class="container my-12" v-else-if="!actualities || actualities.data.length === 0">
    <div class="section-page-header">
      <h2 class="section-page-title">Actualités</h2>
    </div>

    <div
      v-if="selectedOrder || search"
      class="flex items-center justify-between p-3 bg-muted border text-sm rounded mb-4"
    >
      <div>
        Résultats
        <span v-if="search">
          pour la recherche "<strong>{{ search }}</strong>"
        </span>
        <span v-if="selectedOrder">
          {{ search ? "et" : "filtrés" }} par
          "<strong>{{ filters[0].options[selectedOrder] }}</strong>"
        </span>
      </div>
      <Button variant="outline" size="sm" @click="resetFilters">
        Tout afficher
      </Button>
    </div>

    <p>Aucune actualité trouvée.</p>
  </div>

  <div class="container my-12" v-else>
    <div class="section-page-header">
      <h2 class="section-page-title">Les actualités</h2>
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
          <Button :disabled="!search" variant="outline" @click="onSearchChange">
            <Search :size="15" />
          </Button>
        </div>
      </div>

      <Select @update:modelValue="onFilterChange" :modelValue="selectedOrder">
        <SelectTrigger class="w-full md:w-56">
          <SelectValue :placeholder="filters[0].label" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup v-for="filter in filters" :key="filter.title">
            <SelectLabel>{{ filter.label }}</SelectLabel>
            <SelectItem
              v-for="(value, key) in filter.options"
              :key="key"
              :value="key"
            >
              {{ value }}
            </SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>

    <!-- Résumé des filtres actifs -->
    <div
      v-if="selectedOrder || search"
      class="flex items-center justify-between px-2 py-3 bg-muted border text-sm rounded mb-4"
    >
      <div>
        Résultats
        <span v-if="search">
          pour la recherche "<strong>{{ search }}</strong>"
        </span>
        <span v-if="selectedOrder">
          {{ search ? "et" : "filtrés" }} par
          "<strong>{{ filters[0].options[selectedOrder] }}</strong>"
        </span>
      </div>
      <Button variant="outline" size="sm" @click="resetFilters">
        Tout afficher
      </Button>
    </div>

    <!-- Liste des actualités -->
    <div class="grid gap-8">
      <Card v-for="actuality in actualities.data" :key="actuality.id">
        <CardContent>
          <!-- Tu peux mettre ici le résumé de l’actualité -->
          <p class="text-lg font-semibold mb-2">{{ excerpt(actuality.title, 100) }}</p>
          <p class="text-muted-foreground text-sm mb-6">
            {{ excerpt(actuality.description, 200) }}
          </p>
          <p class="text-xs text-muted-foreground">
            Publié {{ ago(actuality.created_at) }}
          </p>
        </CardContent>

        <CardFooter class="flex items-center justify-between gap-5">

          <div>
            <Badge variant="outline" size="sm">
              <span>
                {{ actuality.comments.length }}
              </span>
              <span>
                commentaire(s)
              </span>
            </Badge>
          </div>
          
          <Button variant="outline" size="sm" as-child>
            <NuxtLink :href="`/actuality/${actuality.id}`">
              <ArrowRight :size="15" />
            </NuxtLink>
          </Button>
        </CardFooter>
      </Card>
    </div>

    <!-- Pagination -->
    <Pagination :onPage="onPage" :meta="actualities" />
  </div>
</template>
