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
import { deleteStudent, getCollectionStudents } from "@/services/student";
import type { StudentModel } from "@/types/model";
import type { PaginatedResponse } from "@/types/paginate";
import type { StateActionModel } from "@/types/util";
import { Edit, Eye, File, MoreHorizontal, Plus, Trash2 } from "lucide-vue-next";
import { toast } from "vue-sonner";

useHead({
  title: "Gestion des étudiants - Polytechnic Application",
});

definePageMeta({
  layout: "admin",
  middleware: ["admin"],
});

type ModelCollectionProps = PaginatedResponse<StudentModel[]>;

const auth = useAuth();
const router = useRouter();
const route = useRoute();

const numberPage = ref<number>(
  route.query.page ? parseInt(route.query.page as string) : 1
);

const students = ref<ModelCollectionProps | null>(null);
const isLoading = ref<boolean>(true);
const showModalLockStudentId = ref<number | null>(null);
const showModalDeleteStudentId = ref<number | null>(null);

const fetchStudents = async () => {
  try {
    isLoading.value = true;

    if (!auth.session.value?.accessToken) {
      throw new Error("utilisateur non authentifié");
    }

    const response = await getCollectionStudents(
      auth.session.value.accessToken,
      numberPage.value
    );
    const data = await response.json();

    if (response.ok) {
      students.value = data as ModelCollectionProps;
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
      description: "Impossible de charger les étudiants",
    });
  } finally {
    isLoading.value = false;
  }
};

const onPage = async (page: number) => {
  numberPage.value = page;
  await router.push(`/admin/student?page=${page}`);
  await fetchStudents();
};

const onDeleteStudent = async (studentId: number) => {
  try {
    isLoading.value = true;

    if (!auth.session.value?.accessToken) {
      throw new Error("Utilisateur non authentifié");
    }

    const response = await deleteStudent(
      auth.session.value.accessToken,
      studentId
    );
    const data = await response.json();

    if (response.ok) {
      const state = data as StateActionModel;

      if (state) {
        toast("Suppression", {
          description: `L'étudiant #${studentId} a été supprimé`,
        });

        router.replace("/admin/user?page=1");

        await fetchStudents();
      } else {
        toast.error("Suppression échouée", {
          description: `Nous n'avons pas pu modifier supprimer  l'étudiant #${studentId}`,
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
      description: `Impossible de changer le statut de l'étudiant #${studentId}`,
    });
  } finally {
    showModalLockStudentId.value = null;
    isLoading.value = false;
  }
};

watch(
  () => route.query.page,
  (newPage) => {
    const pageNumber = newPage ? parseInt(newPage as string) : 1;
    if (pageNumber !== numberPage.value) {
      numberPage.value = pageNumber;
      fetchStudents();
    }
  }
);

onMounted(async () => {
  await fetchStudents();
});
</script>

<template>
  <Card>
    <CardHeader>
      <div class="flex items-center gap-4 justify-between">
        <div>
          <CardTitle>Gestion des étudiants</CardTitle>
          <CardDescription>
            Gérez les étudiants de la faculté de polytechinique
          </CardDescription>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger as-child>
            <Button size="sm"> Créer </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>
              <NuxtLink
                :to="`/admin/student/create/excel`"
                class="flex items-center gap-2"
              >
                <File class="mr-2 h-4 w-4" />
                Téléverser un fichier excell
              </NuxtLink>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <NuxtLink
                to="/admin/student/create"
                class="flex items-center gap-2"
              >
                <Plus class="mr-2 h-4 w-4" />
                Manuellement
              </NuxtLink>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </CardHeader>
    <CardContent>
      <!-- Loader -->
      <LoaderContainer v-if="isLoading" />

      <!-- Aucun étudiant -->
      <div v-else-if="!students?.data?.length" class="text-center py-8">
        <p class="text-muted-foreground">Aucun étudiant trouvé</p>
      </div>

      <!-- Table des étudiants -->
      <div v-else class="space-y-4">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nom</TableHead>
              <TableHead>Postnom</TableHead>
              <TableHead>Genre</TableHead>
              <TableHead>Promotion</TableHead>
              <TableHead>Compte</TableHead>
              <TableHead>Création</TableHead>
              <TableHead class="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow v-for="student in students.data" :key="student.id">
              <TableCell class="font-medium">
                {{ excerpt(student.name, 30) }}
              </TableCell>

              <TableCell class="font-medium">
                {{ excerpt(student.firstname, 30) }}
              </TableCell>

              <TableCell class="capilalize">
                {{ student.gender }}
              </TableCell>

              <TableCell>
                {{
                  excerpt(
                    `${student.actual_level.level.name} ${student.actual_level.level.option.alias}`
                  )
                }}
              </TableCell>

              <TableCell>
                <Badge
                  :variant="student.user === null ? 'destructive' : 'outline'"
                >
                  {{ student.user === null ? "Non" : "Oui" }}
                </Badge>
              </TableCell>

              <TableCell>
                <p class="text-sm text-muted-foreground">
                  {{ ago(student.created_at) }}
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
                        :to="`/admin/student/${student.id}`"
                        class="flex items-center gap-2"
                      >
                        <Eye class="mr-2 h-4 w-4" />
                        Voir
                      </NuxtLink>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <NuxtLink
                        :to="`/admin/student/${student.id}/edit`"
                        class="flex items-center gap-2"
                      >
                        <Edit class="mr-2 h-4 w-4" />
                        Modifier
                      </NuxtLink>
                    </DropdownMenuItem>

                    <DropdownMenuItem
                      class="text-destructive"
                      @click="showModalDeleteStudentId = student.id"
                    >
                      <Trash2 class="mr-2 h-4 w-4" />
                      Supprimer
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
                <ConfirmationDialog
                  :open="
                    showModalDeleteStudentId !== null &&
                    showModalDeleteStudentId === student.id
                  "
                  variant="destructive"
                  title="Suppression compte de l'étudiant"
                  description="Cette action est irréversible. L'élément sera définitivement supprimé de nos serveurs."
                  confirm-text="Supprimer"
                  cancel-text="Annuler"
                  :loading="isLoading"
                  @confirm="
                    async () => {
                      await onDeleteStudent(student.id);
                    }
                  "
                  @cancel="showModalDeleteStudentId = null"
                />
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>

        <!-- Pagination -->
        <Pagination v-if="students" :onPage="onPage" :meta="students" />
      </div>
    </CardContent>
  </Card>
</template>
