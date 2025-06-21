<script setup lang="ts">
import LoaderContainer from "@/components/LoaderContainer.vue";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import ConfirmationDialog from "@/components/ui/dialog/ConfirmationDialog.vue";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
import { closeYear, getCollectionYears } from "@/services/year";
import type { YearModel } from "@/types/model";
import type { PaginatedResponse } from "@/types/paginate";
import type { StateActionModel } from "@/types/util";
import { Eye, MoreHorizontal, Trash2 } from "lucide-vue-next";
import { toast } from "vue-sonner";
import { ref, watch, onMounted } from "vue";

useHead({
  title: "Gestion des années académiques - Polytechnic Application",
});

definePageMeta({
  layout: "admin",
  middleware: ["admin", "verified"],
});

type ModelCollectionProps = PaginatedResponse<YearModel[]>;

const auth = useAuth();
const router = useRouter();
const route = useRoute();

const currentPage = ref<number>(route.query.page ? parseInt(route.query.page as string) : 1);

const years = ref<ModelCollectionProps | null>(null);
const isLoading = ref<boolean>(true);
const modalCloseYearId = ref<number | null>(null);

const fetchYears = async () => {
  try {
    isLoading.value = true;

    if (!auth.session.value?.accessToken) {
      throw new Error("Utilisateur non authentifié");
    }

    const response = await getCollectionYears(auth.session.value.accessToken, currentPage.value);
    const data = await response.json();

    if (response.ok) {
      years.value = data as ModelCollectionProps;
    } else if (response.status === 401) {
      toast.warning("Session", {
        description: "Votre session a expiré, merci de vous reconnecter",
      });
      auth.logout();
    } else {
      toast.error("Erreur", {
        description: (data as { message: string }).message || "Une erreur est survenue",
      });
    }
  } catch (error) {
    toast.error("Erreur", {
      description: "Impossible de charger les années académiques",
    });
  } finally {
    isLoading.value = false;
  }
};

const onPage = async (page: number) => {
  currentPage.value = page;
  await router.push(`/admin/year?page=${page}`);
  await fetchYears();
};

const onYearClose = async (yearId: number) => {
  try {
    isLoading.value = true;

    if (!auth.session.value?.accessToken) {
      throw new Error("Utilisateur non authentifié");
    }

    const response = await closeYear(auth.session.value.accessToken, yearId);
    const data = await response.json();

    if (response.ok) {
      const state = data as StateActionModel;

      if (state && state.state) {
        toast.success("Clôture", {
          description: `L'année académique #${yearId} a été clôturée.`,
        });

        await fetchYears();
      } else {
        toast.error("Échec de la clôture", {
          description: `Impossible de clôturer l'année académique #${yearId}.`,
        });
      }
    } else if (response.status === 401) {
      toast.warning("Session", {
        description: "Votre session a expiré, merci de vous reconnecter",
      });
      auth.logout();
    } else {
      toast.error("Erreur", {
        description: (data as { message: string }).message || "Une erreur est survenue",
      });
    }
  } catch (error) {
    toast.error("Erreur", {
      description: `Impossible de changer le statut de l'année académique #${yearId}.`,
    });
  } finally {
    isLoading.value = false;
    modalCloseYearId.value = null;
  }
};

watch(
  () => route.query.page,
  (newPage) => {
    const pageNumber = newPage ? parseInt(newPage as string) : 1;
    if (pageNumber !== currentPage.value) {
      currentPage.value = pageNumber;
      fetchYears();
    }
  }
);

onMounted(async () => {
  await fetchYears();
});
</script>

<template>
  <Card>
    <CardHeader>
      <CardTitle>Gestion des années académiques</CardTitle>
    </CardHeader>
    <CardContent>
      <!-- Loader -->
      <LoaderContainer v-if="isLoading" />

      <!-- Aucune année académique -->
      <div v-else-if="!years?.data?.length" class="text-center py-8">
        <p class="text-muted-foreground">Aucune année académique trouvée</p>
      </div>

      <!-- Table des années académiques -->
      <div v-else class="space-y-4">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>#</TableHead>
              <TableHead>Nom</TableHead>
              <TableHead>Début</TableHead>
              <TableHead>Fin</TableHead>
              <TableHead>Clôturée</TableHead>
              <TableHead>Création</TableHead>
              <TableHead class="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow v-for="year in years.data" :key="year.id">
              <TableCell class="font-medium">#{{ year.id }}</TableCell>

              <TableCell class="font-medium">
                {{ excerpt(year.name, 30) }}
              </TableCell>

              <TableCell class="font-medium">
                {{ year.start }}
              </TableCell>

              <TableCell class="font-medium">
                {{ year.end }}
              </TableCell>

              <TableCell>
                <Badge :variant="year.is_closed ? 'destructive' : 'outline'">
                  {{ year.is_closed ? "Oui" : "Non" }}
                </Badge>
              </TableCell>

              <TableCell>
                <p class="text-sm text-muted-foreground">
                  {{ ago(year.created_at) }}
                </p>
              </TableCell>
              <TableCell class="text-right">
                <DropdownMenu>
                  <DropdownMenuTrigger as-child>
                    <Button variant="ghost" size="sm" aria-label="Ouvrir le menu">
                      <MoreHorizontal class="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>
                      <NuxtLink
                        :to="`/admin/year-academic/${year.id}`"
                        class="flex items-center gap-2"
                      >
                        <Eye class="mr-2 h-4 w-4" />
                        Voir
                      </NuxtLink>
                    </DropdownMenuItem>

                    <DropdownMenuItem
                      v-if="!year.is_closed"
                      @click="modalCloseYearId = year.id"
                    >
                      <Trash2 class="mr-2 h-4 w-4" />
                      Clôturer
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>

                <ConfirmationDialog
                  v-if="!year.is_closed"
                  :open="modalCloseYearId === year.id"
                  variant="destructive"
                  title="Clôture de l'année académique"
                  description="Cette action est irréversible. L'année sera définitivement clôturée."
                  confirm-text="Clôturer"
                  cancel-text="Annuler"
                  :loading="isLoading"
                  @confirm="async () => { await onYearClose(year.id); }"
                  @cancel="modalCloseYearId = null"
                />
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>

        <!-- Pagination -->
        <Pagination v-if="years" :onPage="onPage" :meta="years" />
      </div>
    </CardContent>
  </Card>
</template>
