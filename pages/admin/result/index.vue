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
import { deleteOption, getCollectionOptions } from "@/services/option";
import type { OptionModel, ResultModel } from "@/types/model";
import type { PaginatedResponse } from "@/types/paginate";
import type { StateActionModel } from "@/types/util";
import { Edit, Eye, MoreHorizontal, Trash2 } from "lucide-vue-next";
import { toast } from "vue-sonner";
import { deleteResult, getCollectionResults } from "~/services/result";

useHead({
  title: "Gestion des résultats - Polytechnic Application",
});

definePageMeta({
  layout: "admin",
  middleware: ["admin", "verified"],
});

type ModelCollectionProps = PaginatedResponse<ResultModel[]>;

const auth = useAuth();
const router = useRouter();
const route = useRoute();

const numberPage = ref<number>(
  route.query.page ? parseInt(route.query.page as string) : 1
);

const results = ref<ModelCollectionProps | null>(null);
const isLoading = ref<boolean>(true);
const showModalDeleteResultId = ref<number | null>(null);

const fetchResults = async () => {
  try {
    isLoading.value = true;

    if (!auth.session.value?.accessToken) {
      throw new Error("Utilisateur non authentifié");
    }

    const response = await getCollectionResults(
      auth.session.value.accessToken,
      numberPage.value
    );
    const data = await response.json();

    if (response.ok) {
      results.value = data as ModelCollectionProps;
    } else if (response.status === 401) {
      toast.warning("Session expirée", {
        description: "Votre session a expiré, veuillez vous reconnecter.",
      });
      auth.logout();
    } else {
      toast.error("Erreur", {
        description:
          (data as { message: string }).message || "Une erreur est survenue.",
      });
    }
  } catch (error) {
    toast.error("Erreur", {
      description: "Impossible de charger les résultats.",
    });
  } finally {
    isLoading.value = false;
  }
};

const onPage = async (page: number) => {
  numberPage.value = page;
  await router.push(`/admin/result?page=${page}`);
  await fetchResults();
};

const onDeleteResult = async (resultId: number) => {
  try {
    isLoading.value = true;

    if (!auth.session.value?.accessToken) {
      throw new Error("Utilisateur non authentifié");
    }

    const response = await deleteResult(
      auth.session.value.accessToken,
      resultId
    );
    const data = await response.json();

    if (response.ok) {
      const state = data as StateActionModel;

      if (state) {
        toast("Suppression réussie", {
          description: `Le résultat #${resultId} a été supprimé.`,
        });

        router.replace("/admin/result?page=1");
        await fetchResults();
      } else {
        toast.error("Échec de la suppression", {
          description: `Impossible de supprimer le résultat #${resultId}.`,
        });
      }
    } else if (response.status === 401) {
      toast.warning("Session expirée", {
        description: "Votre session a expiré, veuillez vous reconnecter.",
      });
      auth.logout();
    } else {
      toast.error("Erreur", {
        description:
          (data as { message: string }).message || "Une erreur est survenue.",
      });
    }
  } catch (error) {
    toast.error("Erreur", {
      description: `Impossible de supprimer le résultat #${resultId}.`,
    });
  } finally {
    isLoading.value = false;
  }
};

watch(
  () => route.query.page,
  (newPage) => {
    const pageNumber = newPage ? parseInt(newPage as string) : 1;
    if (pageNumber !== numberPage.value) {
      numberPage.value = pageNumber;
      fetchResults();
    }
  }
);

onMounted(async () => {
  await fetchResults();
});
</script>

<template>
  <Card>
    <CardHeader>
      <div class="flex items-center gap-4 justify-between">
        <div>
          <CardTitle>Gestion des résultats</CardTitle>
          <CardDescription>
            Gérez les résultats de délibération
          </CardDescription>
        </div>
        <Button asChild variant="outline" size="sm">
          <NuxtLink to="/admin/result/create" class="flex items-center gap-2">
            Créer
          </NuxtLink>
        </Button>
      </div>
    </CardHeader>
    <CardContent>
      <!-- Loader -->
      <LoaderContainer v-if="isLoading" />

      <div v-else-if="!results?.data?.length" class="text-center py-8">
        <p class="text-muted-foreground">Aucun résultat trouvé</p>
      </div>

      <!-- Table des résultats -->
      <div v-else class="space-y-4">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Étudiant</TableHead>
              <TableHead>Délibération</TableHead>
              <TableHead>Éligibilité</TableHead>
              <TableHead>Création</TableHead>
              <TableHead class="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow v-for="result in results.data" :key="result.id">
              <TableCell class="font-medium">
                {{
                  excerpt(
                    `${result.student.name} ${result.student.firstname}`,
                    30
                  )
                }}
              </TableCell>

              <TableCell class="font-medium">
                {{
                  excerpt(
                    `${result.deliberation.level.name} - ${result.deliberation.year.name}`,
                    30
                  )
                }}
              </TableCell>

              <TableCell>
                <Badge>
                  {{ result.is_eligible ? "Oui" : "Non" }}
                </Badge>
              </TableCell>

              <TableCell>
                <p class="text-sm text-muted-foreground">
                  {{ ago(result.created_at) }}
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
                    <DropdownMenuItem
                      class="text-destructive"
                      @click="showModalDeleteResultId = result.id"
                    >
                      <Trash2 class="mr-2 h-4 w-4" />
                      Supprimer
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
                <ConfirmationDialog
                  :open="
                    showModalDeleteResultId !== null &&
                    showModalDeleteResultId === result.id
                  "
                  variant="destructive"
                  title="Suppression du résultat"
                  description="Cette action est irréversible. L'élément sera définitivement supprimé de nos serveurs."
                  confirm-text="Supprimer"
                  cancel-text="Annuler"
                  :loading="isLoading"
                  @confirm="async () => { await onDeleteResult(result.id); }"
                  @cancel="showModalDeleteResultId = null"
                />
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>

        <Pagination v-if="results" :onPage="onPage" :meta="results" />
      </div>
    </CardContent>
  </Card>
</template>
