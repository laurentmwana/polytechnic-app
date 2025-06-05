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
import { deleteTeacher, getCollectionTeachers } from "@/services/teacher";
import type { TeacherModel } from "@/types/model";
import type { PaginatedResponse } from "@/types/paginate";
import type { StateActionModel } from "@/types/util";
import { Edit, Eye, MoreHorizontal, Trash2 } from "lucide-vue-next";
import { toast } from "vue-sonner";

useHead({
  title: "Gestion des professeurs - Polytechnic Application",
});

definePageMeta({
  layout: "admin",
  middleware: ["admin"],
});

type ModelCollectionProps = PaginatedResponse<TeacherModel[]>;

const auth = useAuth();
const router = useRouter();
const route = useRoute();

const numberPage = ref<number>(
  route.query.page ? parseInt(route.query.page as string) : 1
);

const teachers = ref<ModelCollectionProps | null>(null);
const isLoading = ref<boolean>(true);
const showModalLockteacherId = ref<number | null>(null);
const showModalDeleteTeacherId = ref<number | null>(null);

const fetchTeachers = async () => {
  try {
    isLoading.value = true;

    if (!auth.session.value?.accessToken) {
      throw new Error("utilisateur non authentifié");
    }

    const response = await getCollectionTeachers(
      auth.session.value.accessToken,
      numberPage.value
    );
    const data = await response.json();

    if (response.ok) {
      teachers.value = data as ModelCollectionProps;
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
      description: "Impossible de charger les professeurs",
    });
  } finally {
    isLoading.value = false;
  }
};

const onPage = async (page: number) => {
  numberPage.value = page;
  await router.push(`/admin/teacher?page=${page}`);
  await fetchTeachers();
};

const onDeleteTeacher = async (teacherId: number) => {
  try {
    isLoading.value = true;

    if (!auth.session.value?.accessToken) {
      throw new Error("Utilisateur non authentifié");
    }

    const response = await deleteTeacher(
      auth.session.value.accessToken,
      teacherId
    );
    const data = await response.json();

    if (response.ok) {
      const state = data as StateActionModel;

      if (state) {
        toast("Suppression", {
          description: `le professeur #${teacherId} a été supprimé`,
        });

        router.replace("/admin/teacher?page=1");

        await fetchTeachers();
      } else {
        toast.error("Suppression échouée", {
          description: `Nous n'avons pas pu modifier supprimer  le professeur #${teacherId}`,
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
      description: `Impossible de changer le statut de le professeur #${teacherId}`,
    });
  } finally {
    showModalLockteacherId.value = null;
    isLoading.value = false;
  }
};

watch(
  () => route.query.page,
  (newPage) => {
    const pageNumber = newPage ? parseInt(newPage as string) : 1;
    if (pageNumber !== numberPage.value) {
      numberPage.value = pageNumber;
      fetchTeachers();
    }
  }
);

onMounted(async () => {
  await fetchTeachers();
});
</script>

<template>
  <Card>
    <CardHeader>
      <div class="flex items-center gap-4 justify-between">
        <div>
          <CardTitle>Gestion des professeurs</CardTitle>
          <CardDescription>
            Gérez les professeurs de la faculté de polytechinique
          </CardDescription>
        </div>
        <Button size="sm" asChild>
          <NuxtLink to="/admin/teacher/create" class="flex items-center gap-2">
            Créer
          </NuxtLink>
        </Button>
      </div>
    </CardHeader>
    <CardContent>
      <!-- Loader -->
      <LoaderContainer v-if="isLoading" />

      <!-- Aucun professeur -->
      <div v-else-if="!teachers?.data?.length" class="text-center py-8">
        <p class="text-muted-foreground">Aucun professeur trouvé</p>
      </div>

      <!-- Table des professeurs -->
      <div v-else class="space-y-4">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nom</TableHead>
              <TableHead>Postnom</TableHead>
              <TableHead>Genre</TableHead>
              <TableHead>Départment</TableHead>
              <TableHead>Création</TableHead>
              <TableHead class="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow v-for="teacher in teachers.data" :key="teacher.id">
              <TableCell class="font-medium">
                {{ excerpt(teacher.name, 30) }}
              </TableCell>

              <TableCell class="font-medium">
                {{ excerpt(teacher.firstname, 30) }}
              </TableCell>

              <TableCell class="capilalize">
                {{ teacher.gender }}
              </TableCell>

              <TableCell>
                {{ excerpt(teacher.department.name, 70) }}
              </TableCell>

              <TableCell>
                <p class="text-sm text-muted-foreground">
                  {{ ago(teacher.created_at) }}
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
                        :to="`/admin/teacher/${teacher.id}`"
                        class="flex items-center gap-2"
                      >
                        <Eye class="mr-2 h-4 w-4" />
                        Voir
                      </NuxtLink>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <NuxtLink
                        :to="`/admin/teacher/${teacher.id}/edit`"
                        class="flex items-center gap-2"
                      >
                        <Edit class="mr-2 h-4 w-4" />
                        Modifier
                      </NuxtLink>
                    </DropdownMenuItem>

                    <DropdownMenuItem
                      class="text-destructive"
                      @click="showModalDeleteTeacherId = teacher.id"
                    >
                      <Trash2 class="mr-2 h-4 w-4" />
                      Supprimer
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
                <ConfirmationDialog
                  :open="
                    showModalDeleteTeacherId !== null &&
                    showModalDeleteTeacherId === teacher.id
                  "
                  variant="destructive"
                  title="Suppression compte de le professeur"
                  description="Cette action est irréversible. le élément sera définitivement supprimé de nos serveurs."
                  confirm-text="Supprimer"
                  cancel-text="Annuler"
                  :loading="isLoading"
                  @confirm="
                    async () => {
                      await onDeleteTeacher(teacher.id);
                    }
                  "
                  @cancel="showModalDeleteTeacherId = null"
                />
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>

        <!-- Pagination -->
        <Pagination v-if="teachers" :onPage="onPage" :meta="teachers" />
      </div>
    </CardContent>
  </Card>
</template>
