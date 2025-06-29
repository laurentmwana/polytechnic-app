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
  deleteActuality,
  getCollectionActualities,
} from "@/services/actuality";
import type { ActualityModel } from "@/types/model";
import type { PaginatedResponse } from "@/types/paginate";
import type { StateActionModel } from "@/types/util";
import { Edit, Eye, MoreHorizontal, Trash2 } from "lucide-vue-next";
import { toast } from "vue-sonner";
import { useRouter, useRoute } from "vue-router"; // Ajouté

useHead({
  title: "Gestion des actualités - Polytechnic Application",
});

definePageMeta({
  layout: "admin",
  middleware: ["admin", "verified"],
});

type ModelCollectionProps = PaginatedResponse<ActualityModel[]>;

const auth = useAuth();
const router = useRouter();
const route = useRoute();

const numberPage = ref<number>(parseInt(route.query.page as string) || 1);
const actualities = ref<ModelCollectionProps | null>(null);
const isLoading = ref<boolean>(true);
const showModalDeleteActualityId = ref<number | null>(null);

const fetchActualities = async () => {
  try {
    isLoading.value = true;

    const token = auth.session.value?.accessToken;
    if (!token) throw new Error("Utilisateur non authentifié");

    const response = await getCollectionActualities(token, numberPage.value);
    const data = await response.json();

    if (response.ok) {
      actualities.value = data as ModelCollectionProps;
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
      description: "Impossible de charger les actualités.",
    });
  } finally {
    isLoading.value = false;
  }
};

const onPage = async (page: number) => {
  numberPage.value = page;
  await router.push(`/admin/actuality?page=${page}`);
  await fetchActualities();
};

const onDeleteActuality = async (actualityId: number) => {
  try {
    isLoading.value = true;

    const token = auth.session.value?.accessToken;
    if (!token) throw new Error("Utilisateur non authentifié");

    const response = await deleteActuality(token, actualityId);
    const data = await response.json();

    if (response.ok && (data as StateActionModel)) {
      toast("Suppression", {
        description: `L'actualité #${actualityId} a été supprimée.`,
      });
      await onPage(1);
    } else {
      toast.error("Échec de la suppression", {
        description: `L'actualité #${actualityId} n'a pas pu être supprimée.`,
      });
    }
  } catch {
    toast.error("Erreur", {
      description: `Erreur lors de la suppression de l'actualité #${actualityId}.`,
    });
  } finally {
    showModalDeleteActualityId.value = null;
    isLoading.value = false;
  }
};

watch(
  () => route.query.page,
  (newPage) => {
    const pageNumber = parseInt(newPage as string) || 1;
    if (pageNumber !== numberPage.value) {
      numberPage.value = pageNumber;
      fetchActualities();
    }
  }
);

onMounted(fetchActualities);
</script>
<template>
  <Card>
    <CardHeader>
      <div class="flex items-center gap-4 justify-between">
        <div>
          <CardTitle>Gestion des actualités</CardTitle>
          <CardDescription>
            Gérez les actualités de la faculté de polytechnique
          </CardDescription>
        </div>
        <Button asChild variant="outline" size="sm">
          <NuxtLink to="/admin/actuality/create" class="flex items-center gap-2">
            Créer
          </NuxtLink>
        </Button>
      </div>
    </CardHeader>
    <CardContent>
      <!-- Loader -->
      <LoaderContainer v-if="isLoading" />

      <!-- Aucune actualité -->
      <div v-else-if="!actualities?.data?.length" class="text-center py-8">
        <p class="text-muted-foreground">Aucune actualité trouvée</p>
      </div>

      <!-- Table des actualités -->
      <div v-else class="space-y-4">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Titre</TableHead>
              <TableHead>Commentaires</TableHead>
              <TableHead>Création</TableHead>
              <TableHead class="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow v-for="actuality in actualities.data" :key="actuality.id">
              <TableCell class="font-medium">
                {{ excerpt(actuality.title, 30) }}
              </TableCell>

              <TableCell class="font-medium">
                <Badge variant="outline">
                  {{ actuality.comments.length }}
                </Badge>
              </TableCell>

              <TableCell>
                <p class="text-sm text-muted-foreground">
                  {{ ago(actuality.created_at) }}
                </p>
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
                        :to="`/admin/actuality/${actuality.id}`"
                        class="flex items-center gap-2"
                      >
                        <Eye class="mr-2 h-4 w-4" />
                        Voir
                      </NuxtLink>
                    </DropdownMenuItem>

                    <DropdownMenuItem>
                      <NuxtLink
                        :to="`/admin/actuality/${actuality.id}/edit`"
                        class="flex items-center gap-2"
                      >
                        <Edit class="mr-2 h-4 w-4" />
                        Modifier
                      </NuxtLink>
                    </DropdownMenuItem>

                    <DropdownMenuItem
                      class="text-destructive"
                      @click="showModalDeleteActualityId = actuality.id"
                    >
                      <Trash2 class="mr-2 h-4 w-4" />
                      Supprimer
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>

                <ConfirmationDialog
                  :open="showModalDeleteActualityId === actuality.id"
                  variant="destructive"
                  title="Suppression"
                  description="Cette action est irréversible. L'élément sera définitivement supprimé de nos serveurs."
                  confirm-text="Supprimer"
                  cancel-text="Annuler"
                  :loading="isLoading"
                  @confirm="async () => await onDeleteActuality(actuality.id)"
                  @cancel="showModalDeleteActualityId = null"
                />
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>

        <!-- Pagination -->
        <Pagination v-if="actualities" :onPage="onPage" :meta="actualities" />
      </div>
    </CardContent>
  </Card>
</template>
