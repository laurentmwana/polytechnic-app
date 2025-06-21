<script setup lang="ts">
import { ref, watch, onMounted } from "vue";
import { useRouter, useRoute } from "vue-router";
import LoaderContainer from "@/components/LoaderContainer.vue";
import { Badge } from "@/components/ui/badge";
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
import { isStudentAccountDisable } from "@/lib/role";
import {
  deleteUser,
  getCollectionUsers,
  toggleDisableAccountUser,
} from "@/services/user";
import type { UserModel } from "@/types/model";
import type { PaginatedResponse } from "@/types/paginate";
import type { StateActionModel } from "@/types/util";

import {
  Edit,
  Eye,
  Lock,
  MoreHorizontal,
  Trash2,
  Unlock,
} from "lucide-vue-next";
import { toast } from "vue-sonner";

useHead({
  title: "Gestion des utilisateurs - Polytechnic Application",
});

definePageMeta({
  layout: "admin",
  middleware: ["admin", "verified"],
});

type UserCollectionProps = PaginatedResponse<UserModel[]>;

const auth = useAuth();
const router = useRouter();
const route = useRoute();

const numberPage = ref(
  route.query.page ? parseInt(route.query.page as string) : 1
);

const users = ref<UserCollectionProps | null>(null);
const isLoading = ref(false);
const showModalLockUserId = ref<number | null>(null);
const showModalDeleteUserId = ref<number | null>(null);

const fetchUsers = async () => {
  try {
    isLoading.value = true;

    if (!auth.session.value?.accessToken) {
      throw new Error("Utilisateur non authentifié");
    }

    const response = await getCollectionUsers(
      auth.session.value.accessToken,
      numberPage.value
    );
    const data = await response.json();

    if (response.ok) {
      users.value = data as UserCollectionProps;
    } else if (response.status === 401) {
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
  } catch {
    toast.error("Erreur", {
      description: "Impossible de charger les utilisateurs",
    });
  } finally {
    isLoading.value = false;
  }
};

const onPage = async (page: number) => {
  if (page === numberPage.value) return;
  numberPage.value = page;
  await router.push({ path: "/admin/user", query: { page: page.toString() } });
  await fetchUsers();
};

const onLockAndUnLock = async (userId: number) => {
  try {
    isLoading.value = true;

    if (!auth.session.value?.accessToken) {
      throw new Error("Utilisateur non authentifié");
    }

    const response = await toggleDisableAccountUser(
      auth.session.value.accessToken,
      userId
    );
    const data = await response.json();

    if (response.ok) {
      const state = data as StateActionModel;

      if (state) {
        toast.success("Modification effectuée", {
          description: `Le statut de l'utilisateur #${userId} a été modifié`,
        });

        await fetchUsers();
      } else {
        toast.error("Modification échouée", {
          description: `Nous n'avons pas pu modifier le statut de l'utilisateur #${userId}`,
        });
      }
    } else if (response.status === 401) {
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
  } catch {
    toast.error("Erreur", {
      description: `Impossible de changer le statut de l'utilisateur #${userId}`,
    });
  } finally {
    showModalLockUserId.value = null;
    isLoading.value = false;
  }
};

const onDeleteUser = async (userId: number) => {
  try {
    isLoading.value = true;

    if (!auth.session.value?.accessToken) {
      throw new Error("Utilisateur non authentifié");
    }

    const response = await deleteUser(auth.session.value.accessToken, userId);
    const data = await response.json();

    if (response.ok) {
      const state = data as StateActionModel;

      if (state) {
        toast.success("Suppression", {
          description: `L'utilisateur #${userId} a été supprimé`,
        });

        await fetchUsers();
      } else {
        toast.error("Suppression échouée", {
          description: `Nous n'avons pas pu supprimer l'utilisateur #${userId}`,
        });
      }
    } else if (response.status === 401) {
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
  } catch {
    toast.error("Erreur", {
      description: `Impossible de supprimer l'utilisateur #${userId}`,
    });
  } finally {
    showModalDeleteUserId.value = null;
    isLoading.value = false;
  }
};

watch(
  () => route.query.page,
  (newPage) => {
    const pageNumber = newPage ? parseInt(newPage as string) : 1;
    if (pageNumber !== numberPage.value) {
      numberPage.value = pageNumber;
      fetchUsers();
    }
  }
);

onMounted(() => {
  fetchUsers();
});
</script>

<template>
  <Card>
    <CardHeader>
      <div class="flex items-center gap-4 justify-between">
        <div>
          <CardTitle>Gestion des utilisateurs</CardTitle>
          <CardDescription
            >Gérez les utilisateurs de votre application</CardDescription
          >
        </div>
        <Button size="sm" asChild>
          <NuxtLink to="/admin/user/create">Créer</NuxtLink>
        </Button>
      </div>
    </CardHeader>
    <CardContent>
      <LoaderContainer v-if="isLoading" />

      <div v-else-if="!users?.data?.length" class="text-center py-8">
        <p class="text-muted-foreground">Aucun utilisateur trouvé</p>
      </div>

      <div v-else class="space-y-4">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nom</TableHead>
              <TableHead>E-mail</TableHead>
              <TableHead>Vérification e-mail</TableHead>
              <TableHead>Lier</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Création</TableHead>
              <TableHead class="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow v-for="user in users.data" :key="user.id">
              <TableCell class="font-medium">{{ user.name }}</TableCell>
              <TableCell class="font-medium">{{ user.email }}</TableCell>
              <TableCell>
                <Badge
                  :variant="user.isEmailVerified ? 'outline' : 'destructive'"
                >
                  {{ user.isEmailVerified ? "Oui" : "Non" }}
                </Badge>
              </TableCell>
              <TableCell>
                <Badge :variant="user.student ? 'outline' : 'destructive'">
                  {{ user.student ? "Oui" : "Non" }}
                </Badge>
              </TableCell>
              <TableCell>
                <Badge
                  :variant="
                    isStudentAccountDisable(user.roles)
                      ? 'destructive'
                      : 'outline'
                  "
                >
                  {{
                    isStudentAccountDisable(user.roles) ? "Bloqué" : "Débloqué"
                  }}
                </Badge>
              </TableCell>
              <TableCell>
                <p class="text-sm text-muted-foreground">
                  {{ ago(user.created_at) }}
                </p>
              </TableCell>
              <TableCell class="text-right">
                <DropdownMenu>
                  <DropdownMenuTrigger as-child>
                    <Button
                      variant="ghost"
                      size="sm"
                      aria-label="Ouvrir le menu"
                    >
                      <MoreHorizontal class="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>
                      <NuxtLink
                        :to="`/admin/user/${user.id}`"
                        class="flex items-center gap-2"
                      >
                        <Eye class="mr-2 h-4 w-4" />Voir
                      </NuxtLink>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <NuxtLink
                        :to="`/admin/user/${user.id}/edit`"
                        class="flex items-center gap-2"
                      >
                        <Edit class="mr-2 h-4 w-4" />Modifier
                      </NuxtLink>
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      class="flex items-center gap-2 cursor-pointer select-none"
                      @click="showModalLockUserId = user.id"
                    >
                      <template v-if="isStudentAccountDisable(user.roles)">
                        <Unlock class="mr-2 h-4 w-4" />
                        Débloquer le compte
                      </template>
                      <template v-else>
                        <Lock class="mr-2 h-4 w-4" />
                        Bloquer le compte
                      </template>
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      class="text-destructive flex items-center gap-2 cursor-pointer select-none"
                      @click="showModalDeleteUserId = user.id"
                    >
                      <Trash2 class="mr-2 h-4 w-4" />Supprimer
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>

                <!-- Dialogues de confirmation -->
                <ConfirmationDialog
                  :open="showModalLockUserId === user.id"
                  variant="destructive"
                  title="Modification du statut du compte utilisateur"
                  description="Cette action est irréversible. Le statut du compte sera modifié."
                  confirm-text="Changer le statut"
                  cancel-text="Annuler"
                  :loading="isLoading"
                  @confirm="() => onLockAndUnLock(user.id)"
                  @cancel="() => (showModalLockUserId = null)"
                />
                <ConfirmationDialog
                  :open="showModalDeleteUserId === user.id"
                  variant="destructive"
                  title="Suppression du compte utilisateur"
                  description="Cette action est irréversible. L'utilisateur sera définitivement supprimé."
                  confirm-text="Supprimer"
                  cancel-text="Annuler"
                  :loading="isLoading"
                  @confirm="() => onDeleteUser(user.id)"
                  @cancel="() => (showModalDeleteUserId = null)"
                />
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>

        <Pagination v-if="users" :onPage="onPage" :meta="users" />
      </div>
    </CardContent>
  </Card>
</template>
