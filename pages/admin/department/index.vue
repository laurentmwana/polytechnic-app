<script setup lang="ts">
import LoaderContainer from "@/components/LoaderContainer.vue";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
import { getCollectionDepartments } from "../../../services/department";

useHead({
  title: "Gestion des cours - Polytechnic Application",
});

definePageMeta({
  layout: "admin",
  middleware: ["admin"],
});

type ModelCollectionProps = PaginatedResponse<DepartmentModel[]>;

const auth = useAuth();
const router = useRouter();
const route = useRoute();

const numberPage = ref<number>(
  route.query.page ? parseInt(route.query.page as string) : 1
);

const departments = ref<ModelCollectionProps | null>(null);
const isLoading = ref<boolean>(true);
const showModalLockcourseId = ref<number | null>(null);
const showModalDeleteCourseId = ref<number | null>(null);

const fetchDepartments = async () => {
  try {
    isLoading.value = true;

    if (!auth.session.value?.accessToken) {
      throw new Error("utilisateur non authentifié");
    }

    const response = await getCollectionDepartments(
      auth.session.value.accessToken,
      numberPage.value
    );
    const data = await response.json();

    if (response.ok) {
      departments.value = data as ModelCollectionProps;
    } else if (response.status == 401) {
      toast.warning("Session", {
        description: "Votre session a expiré, merci de vous reconnecter",
      });
      auth.logout();
    } else {
      toast.error("Erreur", {
        description:
          (data as { message: string }).message || "Une erreur est survenue",
      });
    }
  } catch (error) {
    toast.error("Erreur", {
      description: "Impossible de charger les cours",
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

onMounted(async () => {
  await fetchDepartments();
});
</script>

<template>
  <Card>
    <CardHeader>
      <div class="flex items-center gap-4 justify-between">
        <div>
          <CardTitle>Gestion des départements</CardTitle>
          <CardDescription>
            Gérez les départments de la faculté de polytechinique
          </CardDescription>
        </div>
      </div>
    </CardHeader>
    <CardContent>
      <!-- Loader -->
      <LoaderContainer v-if="isLoading" />

      <!-- Aucun cours -->
      <div v-else-if="!departments?.data?.length" class="text-center py-8">
        <p class="text-muted-foreground">Aucun département trouvé</p>
      </div>

      <!-- Table des cours -->
      <div v-else class="space-y-4">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nom</TableHead>
              <TableHead>Alias</TableHead>
              <TableHead>Options</TableHead>
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
                  {{ department.options.length }}
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
                    <NuxtLink :href="`/admin/department/${department.id}/edit`">
                      <Pen :size="15" />
                    </NuxtLink>
                  </Button>
                  <Button size="sm" variant="secondary" :as-child="true">
                    <NuxtLink :href="`/admin/department/${department.id}`">
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
