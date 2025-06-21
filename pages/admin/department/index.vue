<script setup lang="ts">
import { ref, watch, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useHead } from "#imports";

import LoaderContainer from "@/components/LoaderContainer.vue";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Pagination from "@/components/ui/pagination/Pagination.vue";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { useAuth } from "@/composables/useAuth";
import { ago } from "@/lib/date-time";
import { excerpt } from "@/lib/utils";
import type { DepartmentModel } from "@/types/model";
import type { PaginatedResponse } from "@/types/paginate";
import { Eye, Pen } from "lucide-vue-next";
import { toast } from "vue-sonner";
import { getCollectionDepartments } from "@/services/department";

useHead({
  title: "Gestion des départements - Polytechnic Application",
});

definePageMeta({
  layout: "admin",
  middleware: ["admin", "verified"],
});

type ModelCollectionProps = PaginatedResponse<DepartmentModel[]>;

const auth = useAuth();
const router = useRouter();
const route = useRoute();

const numberPage = ref<number>(
  route.query.page ? parseInt(route.query.page as string) : 1
);

const departments = ref<ModelCollectionProps | null>(null);
const isLoading = ref(true);

const fetchDepartments = async () => {
  try {
    isLoading.value = true;

    if (!auth.session.value?.accessToken) {
      throw new Error("Utilisateur non authentifié");
    }

    const response = await getCollectionDepartments(
      auth.session.value.accessToken,
      numberPage.value
    );

    const data = await response.json();

    if (response.ok) {
      departments.value = data as ModelCollectionProps;
    } else if (response.status === 401) {
      toast.warning("Session", {
        description: "Votre session a expiré, merci de vous reconnecter.",
      });
      auth.logout();
    } else {
      toast.error("Erreur", {
        description:
          (data as { message?: string }).message ??
          "Une erreur est survenue.",
      });
    }
  } catch {
    toast.error("Erreur", {
      description: "Impossible de charger les départements.",
    });
  } finally {
    isLoading.value = false;
  }
};

const onPage = async (page: number) => {
  numberPage.value = page;
  await router.push(`/admin/department?page=${page}`);
  await fetchDepartments();
};

watch(
  () => route.query.page,
  (newPage) => {
    const pageNumber = newPage ? parseInt(newPage as string) : 1;
    if (pageNumber !== numberPage.value) {
      numberPage.value = pageNumber;
      fetchDepartments();
    }
  }
);

onMounted(fetchDepartments);
</script>

<template>
  <Card>
    <CardHeader>
      <div class="flex items-center justify-between gap-4">
        <div>
          <CardTitle>Gestion des départements</CardTitle>
          <CardDescription>
            Gérez les départements de la faculté de polytechnique
          </CardDescription>
        </div>
      </div>
    </CardHeader>

    <CardContent>
      <!-- Loader -->
      <LoaderContainer v-if="isLoading" />

      <!-- Aucun département -->
      <div v-else-if="!departments?.data?.length" class="py-8 text-center">
        <p class="text-muted-foreground">Aucun département trouvé</p>
      </div>

      <!-- Table des départements -->
      <div v-else class="space-y-4">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nom</TableHead>
              <TableHead>Alias</TableHead>
              <TableHead>Promotions</TableHead>
              <TableHead>Création</TableHead>
              <TableHead class="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow
              v-for="department in departments.data"
              :key="department.id"
            >
              <TableCell class="font-medium">
                {{ excerpt(department.name, 30) }}
              </TableCell>

              <TableCell class="font-medium">
                {{ excerpt(department.alias, 20) }}
              </TableCell>

              <TableCell class="font-medium">
                <Badge variant="outline">
                  {{ department.levels.length }}
                </Badge>
              </TableCell>

              <TableCell>
                <p class="text-sm text-muted-foreground">
                  {{ ago(department.created_at) }}
                </p>
              </TableCell>

              <TableCell>
                <div class="flex items-center gap-4 lg:justify-end">
                  <Button size="sm" variant="outline" :as-child="true">
                    <NuxtLink :to="`/admin/department/${department.id}/edit`">
                      <Pen :size="15" />
                    </NuxtLink>
                  </Button>
                  <Button size="sm" variant="secondary" :as-child="true">
                    <NuxtLink :to="`/admin/department/${department.id}`">
                      <Eye :size="15" />
                    </NuxtLink>
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>

        <!-- Pagination -->
        <Pagination v-if="departments" :onPage="onPage" :meta="departments" />
      </div>
    </CardContent>
  </Card>
</template>
