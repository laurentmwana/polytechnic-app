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
import type { OptionModel } from "@/types/model";
import type { PaginatedResponse } from "@/types/paginate";
import type { StateActionModel } from "@/types/util";
import { Edit, Eye, MoreHorizontal, Trash2 } from "lucide-vue-next";
import { toast } from "vue-sonner";

useHead({
  title: "Gestion des options - Polytechnic Application",
});

definePageMeta({
  layout: "admin",
  middleware: ["admin"],
});

type ModelCollectionProps = PaginatedResponse<OptionModel[]>;

const auth = useAuth();
const router = useRouter();
const route = useRoute();

const numberPage = ref<number>(
  route.query.page ? parseInt(route.query.page as string) : 1
);

const options = ref<ModelCollectionProps | null>(null);
const isLoading = ref<boolean>(true);
const showModalDeleteOptionId = ref<number | null>(null);

const fetchOptions = async () => {
  try {
    isLoading.value = true;

    if (!auth.session.value?.accessToken) {
      throw new Error("utilisateur non authentifié");
    }

    const response = await getCollectionOptions(
      auth.session.value.accessToken,
      numberPage.value
    );
    const data = await response.json();

    if (response.ok) {
      options.value = data as ModelCollectionProps;
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
      description: "Impossible de charger les options",
    });
  } finally {
    isLoading.value = false;
  }
};

const onPage = async (page: number) => {
  numberPage.value = page;
  await router.push(`/admin/option?page=${page}`);
  await fetchOptions();
};

const onDeleteOption = async (optionId: number) => {
  try {
    isLoading.value = true;

    if (!auth.session.value?.accessToken) {
      throw new Error("Utilisateur non authentifié");
    }

    const response = await deleteOption(
      auth.session.value.accessToken,
      optionId
    );
    const data = await response.json();

    if (response.ok) {
      const state = data as StateActionModel;

      if (state) {
        toast("Suppression", {
          description: `Le options #${optionId} a été supprimé`,
        });

        router.replace("/admin/option?page=1");

        await fetchOptions();
      } else {
        toast.error("Suppression échouée", {
          description: `Nous n'avons pas pu modifier supprimer  le options #${optionId}`,
        });
      }
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
      description: `Impossible de changer le statut de le options #${optionId}`,
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
      fetchOptions();
    }
  }
);

onMounted(async () => {
  await fetchOptions();
});
</script>

<template>
  <Card>
    <CardHeader>
      <div class="flex items-center gap-4 justify-between">
        <div>
          <CardTitle>Gestion des options</CardTitle>
          <CardDescription>
            Gérez les options de la faculté de polytechinique
          </CardDescription>
        </div>
        <Button asChild variant="outline" size="sm">
          <NuxtLink to="/admin/option/create" class="flex items-center gap-2">
            Créer
          </NuxtLink>
        </Button>
      </div>
    </CardHeader>
    <CardContent>
      <!-- Loader -->
      <LoaderContainer v-if="isLoading" />

      <!-- Aucun options -->
      <div v-else-if="!options?.data?.length" class="text-center py-8">
        <p class="text-muted-foreground">Aucune options trouvée</p>
      </div>

      <!-- Table des options -->
      <div v-else class="space-y-4">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nom</TableHead>
              <TableHead>Alias</TableHead>
              <TableHead>Département</TableHead>
              <TableHead>Promotions</TableHead>
              <TableHead>Création</TableHead>
              <TableHead class="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow v-for="option in options.data" :key="option.id">
              <TableCell class="font-medium">
                {{ excerpt(option.name, 30) }}
              </TableCell>

              <TableCell class="font-medium">
                {{ excerpt(option.alias, 20) }}
              </TableCell>

              <TableCell>
                <TextLink :href="`/admin/department/${option.department.id}`">
                  {{ excerpt(option.department.name, 30) }}
                </TextLink>
              </TableCell>

              <TableCell>
                <Badge variant="outline">
                  {{ option.levels.length }}
                </Badge>
              </TableCell>

              <TableCell>
                <p class="text-sm text-muted-foreground">
                  {{ ago(option.created_at) }}
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
                        :to="`/admin/option/${option.id}`"
                        class="flex items-center gap-2"
                      >
                        <Eye class="mr-2 h-4 w-4" />
                        Voir
                      </NuxtLink>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <NuxtLink
                        :to="`/admin/option/${option.id}/edit`"
                        class="flex items-center gap-2"
                      >
                        <Edit class="mr-2 h-4 w-4" />
                        Modifier
                      </NuxtLink>
                    </DropdownMenuItem>

                    <DropdownMenuItem
                      class="text-destructive"
                      @click="showModalDeleteOptionId = option.id"
                    >
                      <Trash2 class="mr-2 h-4 w-4" />
                      Supprimer
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
                <ConfirmationDialog
                  :open="
                    showModalDeleteOptionId !== null &&
                    showModalDeleteOptionId === option.id
                  "
                  variant="destructive"
                  title="Suppression compte de le options"
                  description="Cette action est irréversible. L'élément sera définitivement supprimé de nos serveurs."
                  confirm-text="Supprimer"
                  cancel-text="Annuler"
                  :loading="isLoading"
                  @confirm="
                    async () => {
                      await onDeleteOption(option.id);
                    }
                  "
                  @cancel="showModalDeleteOptionId = null"
                />
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>

        <!-- Pagination -->
        <Pagination v-if="options" :onPage="onPage" :meta="options" />
      </div>
    </CardContent>
  </Card>
</template>
