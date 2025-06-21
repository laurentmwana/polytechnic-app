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
import {
  deleteDeliberation,
  getCollectionDeliberations,
} from "@/services/deliberation";
import type { DeliberationModel } from "@/types/model";
import type { PaginatedResponse } from "@/types/paginate";
import type { StateActionModel } from "@/types/util";
import { Edit, Eye, MoreHorizontal, Trash2 } from "lucide-vue-next";
import { toast } from "vue-sonner";

useHead({
  title: "Gestion des délibérations - Polytechnic Application",
});

definePageMeta({
  layout: "admin",
  middleware: ["admin", "verified"],
});

type ModelCollectionProps = PaginatedResponse<DeliberationModel[]>;

const auth = useAuth();
const router = useRouter();
const route = useRoute();

const numberPage = ref<number>(parseInt(route.query.page as string) || 1);
const deliberations = ref<ModelCollectionProps | null>(null);
const isLoading = ref<boolean>(true);
const showModalDeleteDelibeId = ref<number | null>(null);

const fetchDeliberations = async () => {
  try {
    isLoading.value = true;

    const token = auth.session.value?.accessToken;
    if (!token) throw new Error("Utilisateur non authentifié");

    const response = await getCollectionDeliberations(token, numberPage.value);
    const data = await response.json();

    if (response.ok) {
      deliberations.value = data as ModelCollectionProps;
    } else if (response.status === 401) {
      toast.warning("Session expirée", {
        description: "Veuillez vous reconnecter.",
      });
      auth.logout();
    } else {
      toast.error("Erreur", {
        description: (data as { message: string }).message || "Erreur inconnue.",
      });
    }
  } catch {
    toast.error("Erreur", {
      description: "Impossible de charger les délibérations.",
    });
  } finally {
    isLoading.value = false;
  }
};

const onPage = async (page: number) => {
  numberPage.value = page;
  await router.push(`/admin/deliberation?page=${page}`);
  await fetchDeliberations();
};

const onDeleteDelibe = async (delibId: number) => {
  try {
    isLoading.value = true;

    const token = auth.session.value?.accessToken;
    if (!token) throw new Error("Utilisateur non authentifié");

    const response = await deleteDeliberation(token, delibId);
    const data = await response.json();

    if (response.ok && (data as StateActionModel)) {
      toast("Suppression", {
        description: `La délibération #${delibId} a été supprimée.`,
      });
      await onPage(1);
    } else {
      toast.error("Échec de la suppression", {
        description: `La délibération #${delibId} n'a pas pu être supprimée.`,
      });
    }
  } catch {
    toast.error("Erreur", {
      description: `Erreur lors de la suppression de la délibération #${delibId}.`,
    });
  } finally {
    showModalDeleteDelibeId.value = null;
    isLoading.value = false;
  }
};

watch(
  () => route.query.page,
  (newPage) => {
    const pageNumber = parseInt(newPage as string) || 1;
    if (pageNumber !== numberPage.value) {
      numberPage.value = pageNumber;
      fetchDeliberations();
    }
  }
);

onMounted(fetchDeliberations);
</script>

<template>
  <Card>
    <CardHeader>
      <div class="flex items-center gap-4 justify-between">
        <div>
          <CardTitle>Gestion des délibérations</CardTitle>
          <CardDescription>
            Gérez les délibérations de la faculté de polytechnique
          </CardDescription>
        </div>
        <Button asChild variant="outline" size="sm">
          <NuxtLink to="/admin/deliberation/create" class="flex items-center gap-2">
            Créer
          </NuxtLink>
        </Button>
      </div>
    </CardHeader>
    <CardContent>
      <!-- Loader -->
      <LoaderContainer v-if="isLoading" />

      <!-- Aucune délibération -->
      <div v-else-if="!deliberations?.data?.length" class="text-center py-8">
        <p class="text-muted-foreground">Aucune délibération trouvée</p>
      </div>

      <!-- Table des délibérations -->
      <div v-else class="space-y-4">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Promotion</TableHead>
              <TableHead>Année</TableHead>
              <TableHead>Semestre</TableHead>
              <TableHead>Début</TableHead>
              <TableHead>Création</TableHead>
              <TableHead class="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow v-for="delibe in deliberations.data" :key="delibe.id">
              <TableCell class="font-medium">
                {{
                  excerpt(`${delibe.level.name} ${delibe.level.department.alias}`, 30)
                }}
              </TableCell>

              <TableCell class="font-medium">{{ delibe.year.name }}</TableCell>

              <TableCell class="font-medium">{{ delibe.semester }}</TableCell>

              <TableCell>{{ delibe.start_at }}</TableCell>

              <TableCell>
                <p class="text-sm text-muted-foreground">{{ ago(delibe.created_at) }}</p>
              </TableCell>

              <TableCell class="text-right">
                <DropdownMenu>
                  <DropdownMenuTrigger as-child>
                    <Button variant="ghost" size="sm">
                      <MoreHorizontal class="h-4 w-4" />
                      <span class="sr-only">Ouvrir le menu</span>
                    </Button>
                  </DropdownMenuTrigger>

                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>
                      <NuxtLink
                        :to="`/admin/deliberation/${delibe.id}`"
                        class="flex items-center gap-2"
                      >
                        <Eye class="mr-2 h-4 w-4" />
                        Voir
                      </NuxtLink>
                    </DropdownMenuItem>

                    <DropdownMenuItem>
                      <NuxtLink
                        :to="`/admin/deliberation/${delibe.id}/edit`"
                        class="flex items-center gap-2"
                      >
                        <Edit class="mr-2 h-4 w-4" />
                        Modifier
                      </NuxtLink>
                    </DropdownMenuItem>

                    <DropdownMenuItem
                      class="text-destructive"
                      @click="showModalDeleteDelibeId = delibe.id"
                    >
                      <Trash2 class="mr-2 h-4 w-4" />
                      Supprimer
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>

                <ConfirmationDialog
                  :open="showModalDeleteDelibeId === delibe.id"
                  variant="destructive"
                  title="Suppression"
                  description="Cette action est irréversible. L'élément sera définitivement supprimé de nos serveurs."
                  confirm-text="Supprimer"
                  cancel-text="Annuler"
                  :loading="isLoading"
                  @confirm="async () => await onDeleteDelibe(delibe.id)"
                  @cancel="showModalDeleteDelibeId = null"
                />
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>

        <!-- Pagination -->
        <Pagination v-if="deliberations" :onPage="onPage" :meta="deliberations" />
      </div>
    </CardContent>
  </Card>
</template>
