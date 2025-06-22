<script setup lang="ts">
import { ref, watch, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { getCollectionLevels } from "@/services/other";
import type { LevelModel } from "@/types/model";
import type { PaginatedResponse } from "@/types/paginate";
import { toast } from "vue-sonner";
import { Eye } from "lucide-vue-next";

import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";

useHead({
  title: "Promotions - Polytechnic Application",
});

definePageMeta({
  layout: "default",
});

type LevelPaginateProps = PaginatedResponse<LevelModel[]>;

const isPending = ref(true);
const levels = ref<LevelPaginateProps>();
const router = useRouter();
const route = useRoute();

const numberPage = ref(
  route.query.page ? parseInt(route.query.page as string, 10) : 1
);

const fetchLevels = async () => {
  try {
    isPending.value = true;

    const response = await getCollectionLevels(numberPage.value);
    const data = await response.json();

    if (response.ok) {
      levels.value = data as LevelPaginateProps;
    } else {
      toast.error("Erreur", {
        description:
          (data as { message?: string }).message || "Une erreur est survenue.",
      });
    }
  } catch (error) {
    toast.error("Erreur", {
      description: "Impossible de récupérer les promotions.",
    });
  } finally {
    isPending.value = false;
  }
};

const onPage = async (page: number) => {
  numberPage.value = page;
  await router.push(`/level?page=${page}`);
  await fetchLevels();
};

watch(
  () => route.query.page,
  (newPage) => {
    const pageNumber = newPage ? parseInt(newPage as string, 10) : 1;
    if (pageNumber !== numberPage.value) {
      numberPage.value = pageNumber;
      fetchLevels();
    }
  }
);

onMounted(fetchLevels);
</script>

<template>
  <div class="container my-12">
    <div class="section-page-header mb-6">
      <h2 class="section-page-title">Promotions</h2>
    </div>

    <LoaderContainer :is-card="true" v-if="isPending" />

    <div v-else-if="levels && levels.data?.length > 0">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>#</TableHead>
            <TableHead>Nom</TableHead>
            <TableHead>Alias</TableHead>
            <TableHead>Département</TableHead>
            <TableHead class="text-end">Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow v-for="level in levels.data" :key="level.id">
            <TableCell>#{{ level.id }}</TableCell>
            <TableCell>{{ level.name }}</TableCell>
            <TableCell>{{ level.alias }}</TableCell>
            <TableCell>
              <TextLink
                v-if="level.department"
                :href="`/department/${level.department.id}`"
              >
                {{ level.department.name }}
              </TextLink>
              <p v-else>—</p>
            </TableCell>
            <TableCell>
              <div class="flex items-center justify-end">
                <Button variant="outline" size="sm" as-child>
                  <NuxtLink :to="`/level/${level.id}`">
                    <Eye :size="15" />
                  </NuxtLink>
                </Button>
              </div>
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>

      <Pagination :onPage="onPage" :meta="levels" class="mt-6" />
    </div>

    <div v-else class="text-center text-muted-foreground py-12">
      Aucune promotion trouvée.
    </div>
  </div>
</template>
