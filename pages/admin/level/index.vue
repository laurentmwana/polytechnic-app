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
import { deleteLevel, getCollectionLevels } from "@/services/level";
import type { LevelModel } from "@/types/model";
import type { PaginatedResponse } from "@/types/paginate";
import type { StateActionModel } from "@/types/util";
import { Edit, Eye, MoreHorizontal, Trash2 } from "lucide-vue-next";
import { toast } from "vue-sonner";

useHead({
  title: "Gestion des promotions - Polytechnic Application",
});

definePageMeta({
  layout: "admin",
  middleware: ["admin", "verified"],
});

type ModelCollectionProps = PaginatedResponse<LevelModel[]>;

const auth = useAuth();
const router = useRouter();
const route = useRoute();

const numberPage = ref(route.query.page ? parseInt(route.query.page as string) : 1);

const levels = ref<ModelCollectionProps | null>(null);
const isLoading = ref(true);
const showModalDeleteLevelId = ref<number | null>(null);

const fetchLevels = async () => {
  try {
    isLoading.value = true;

    if (!auth.session.value?.accessToken) {
      throw new Error("Utilisateur non authentifié");
    }

    const response = await getCollectionLevels(auth.session.value.accessToken, numberPage.value);
    const data = await response.json();

    if (response.ok) {
      levels.value = data as ModelCollectionProps;
    } else if (response.status === 401) {
      toast.warning("Session expirée", {
        description: "Merci de vous reconnecter",
      });
      auth.logout();
    } else {
      toast.error("Erreur", {
        description: (data as { message: string }).message || "Une erreur est survenue",
      });
    }
  } catch {
    toast.error("Erreur", {
      description: "Impossible de charger les promotions",
    });
  } finally {
    isLoading.value = false;
  }
};

const onPage = async (page: number) => {
  numberPage.value = page;
  await router.push(`/admin/level?page=${page}`);
  await fetchLevels();
};

const onDeleteLevel = async (levelId: number) => {
  try {
    isLoading.value = true;

    if (!auth.session.value?.accessToken) {
      throw new Error("Utilisateur non authentifié");
    }

    const response = await deleteLevel(auth.session.value.accessToken, levelId);
    const data = await response.json();

    if (response.ok) {
      const state = data as StateActionModel;
      if (state) {
        toast.success("Suppression", {
          description: `La promotion #${levelId} a été supprimée.`,
        });
        router.replace("/admin/level?page=1");
        await fetchLevels();
      } else {
        toast.error("Suppression échouée", {
          description: `Impossible de supprimer la promotion #${levelId}.`,
        });
      }
    } else if (response.status === 401) {
      toast.warning("Session expirée", {
        description: "Merci de vous reconnecter",
      });
      auth.logout();
    } else {
      toast.error("Erreur", {
        description: (data as { message: string }).message || "Une erreur est survenue",
      });
    }
  } catch {
    toast.error("Erreur", {
      description: `Impossible de supprimer la promotion #${levelId}`,
    });
  } finally {
    showModalDeleteLevelId.value = null;
    isLoading.value = false;
  }
};

watch(
  () => route.query.page,
  (newPage) => {
    const pageNumber = newPage ? parseInt(newPage as string) : 1;
    if (pageNumber !== numberPage.value) {
      numberPage.value = pageNumber;
      fetchLevels();
    }
  }
);

onMounted(fetchLevels);
</script>
<template>
  <Card>
    <CardHeader>
      <div class="flex items-center justify-between gap-4">
        <div>
          <CardTitle>Gestion des promotions</CardTitle>
          <CardDescription>
            Gérez les promotions de la faculté de polytechnique
          </CardDescription>
        </div>
        <Button asChild variant="outline" size="sm">
          <NuxtLink to="/admin/level/create" class="flex items-center gap-2">
            Créer
          </NuxtLink>
        </Button>
      </div>
    </CardHeader>

    <CardContent>
      <LoaderContainer v-if="isLoading" />

      <div v-else-if="!levels?.data?.length" class="text-center py-8">
        <p class="text-muted-foreground">Aucune promotion trouvée</p>
      </div>

      <div v-else class="space-y-4">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>#</TableHead>
              <TableHead>Nom</TableHead>
              <TableHead>Alias</TableHead>
              <TableHead>Création</TableHead>
              <TableHead class="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow v-for="level in levels.data" :key="level.id">
              <TableCell class="font-medium">#{{ level.id }}</TableCell>
              <TableCell class="font-medium">{{ excerpt(level.name, 30) }}</TableCell>
              <TableCell class="font-medium">{{ excerpt(level.alias, 20) }}</TableCell>
              <TableCell>
                <p class="text-sm text-muted-foreground">{{ ago(level.created_at) }}</p>
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
                      <NuxtLink :to="`/admin/level/${level.id}`" class="flex items-center gap-2">
                        <Eye class="h-4 w-4 mr-2" />
                        Voir
                      </NuxtLink>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <NuxtLink :to="`/admin/level/${level.id}/edit`" class="flex items-center gap-2">
                        <Edit class="h-4 w-4 mr-2" />
                        Modifier
                      </NuxtLink>
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      class="text-destructive"
                      @click="showModalDeleteLevelId = level.id"
                    >
                      <Trash2 class="h-4 w-4 mr-2" />
                      Supprimer
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>

                <ConfirmationDialog
                  :open="showModalDeleteLevelId === level.id"
                  variant="destructive"
                  title="Suppression de la promotion"
                  description="Cette action est irréversible. L'élément sera définitivement supprimé de nos serveurs."
                  confirm-text="Supprimer"
                  cancel-text="Annuler"
                  :loading="isLoading"
                  @confirm="() => onDeleteLevel(level.id)"
                  @cancel="showModalDeleteLevelId = null"
                />
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>

        <Pagination v-if="levels" :onPage="onPage" :meta="levels" />
      </div>
    </CardContent>
  </Card>
</template>
