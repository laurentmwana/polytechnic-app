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
import { deleteCourse, getCollectionCourses } from "@/services/course";
import type { CourseModel } from "@/types/model";
import type { PaginatedResponse } from "@/types/paginate";
import type { StateActionModel } from "@/types/util";
import { Edit, Eye, MoreHorizontal, Trash2 } from "lucide-vue-next";
import { toast } from "vue-sonner";
import { watch, ref, onMounted } from "vue";

useHead({
  title: "Gestion des cours - Polytechnic Application",
});

definePageMeta({
  layout: "admin",
  middleware: ["admin", "verified"],
});

type ModelCollectionProps = PaginatedResponse<CourseModel[]>;

const auth = useAuth();
const router = useRouter();
const route = useRoute();

const numberPage = ref<number>(
  route.query.page ? parseInt(route.query.page as string, 10) : 1
);

const courses = ref<ModelCollectionProps | null>(null);
const isLoading = ref<boolean>(true);
const showModalDeleteCourseId = ref<number | null>(null);

const fetchCourses = async () => {
  try {
    isLoading.value = true;

    if (!auth.session.value?.accessToken) {
      throw new Error("Utilisateur non authentifié");
    }

    const response = await getCollectionCourses(
      auth.session.value.accessToken,
      numberPage.value
    );
    const data = await response.json();

    if (response.ok) {
      courses.value = data as ModelCollectionProps;
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
      description: "Impossible de charger les cours",
    });
  } finally {
    isLoading.value = false;
  }
};

const onPage = async (page: number) => {
  numberPage.value = page;
  await router.push({
    path: "/admin/course",
    query: { page: page.toString() },
  });
  await fetchCourses();
};

const onDeleteCourse = async (courseId: number) => {
  try {
    isLoading.value = true;

    if (!auth.session.value?.accessToken) {
      throw new Error("Utilisateur non authentifié");
    }

    const response = await deleteCourse(
      auth.session.value.accessToken,
      courseId
    );
    const data = await response.json();

    if (response.ok) {
      const state = data as StateActionModel;

      if (state.state) {
        toast.success("Suppression", {
          description: `Le cours #${courseId} a été supprimé`,
        });

        await fetchCourses();
        router.replace({ path: "/admin/course", query: { page: "1" } });
      } else {
        toast.error("Suppression échouée", {
          description: `Nous n'avons pas pu supprimer le cours #${courseId}`,
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
      description: `Impossible de supprimer le cours #${courseId}`,
    });
  } finally {
    showModalDeleteCourseId.value = null;
    isLoading.value = false;
  }
};

watch(
  () => route.query.page,
  (newPage) => {
    const pageNumber = newPage ? parseInt(newPage as string, 10) : 1;
    if (pageNumber !== numberPage.value) {
      numberPage.value = pageNumber;
      fetchCourses();
    }
  }
);

onMounted(() => {
  fetchCourses();
});
</script>

<template>
  <Card>
    <CardHeader>
      <div class="flex items-center gap-4 justify-between">
        <div>
          <CardTitle>Gestion des cours</CardTitle>
          <CardDescription>
            Gérez les cours de la faculté de polytechnique
          </CardDescription>
        </div>
        <Button asChild variant="outline" size="sm">
          <NuxtLink to="/admin/course/create" class="flex items-center gap-2">
            Créer
          </NuxtLink>
        </Button>
      </div>
    </CardHeader>
    <CardContent>
      <!-- Loader -->
      <LoaderContainer v-if="isLoading" />

      <!-- Aucun cours -->
      <div v-else-if="!courses?.data?.length" class="text-center py-8">
        <p class="text-muted-foreground">Aucun cours trouvé</p>
      </div>

      <!-- Table des cours -->
      <div v-else class="space-y-4">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nom</TableHead>
              <TableHead>Code</TableHead>
              <TableHead>Crédits</TableHead>
              <TableHead>Semestre</TableHead>
              <TableHead>Promotion</TableHead>
              <TableHead>Professeur</TableHead>
              <TableHead>Création</TableHead>
              <TableHead class="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow v-for="course in courses.data" :key="course.id">
              <TableCell class="font-medium">
                {{ excerpt(course.name, 30) }}
              </TableCell>

              <TableCell class="font-medium">
                {{ excerpt(course.code, 20) }}
              </TableCell>

              <TableCell>{{ course.credits }}</TableCell>
              <TableCell>{{ course.semester }}</TableCell>

              <TableCell>
                {{
                  excerpt(`${course.level.name}`)
                }}
              </TableCell>

              <TableCell>{{ excerpt(course.teacher.name, 30) }}</TableCell>

              <TableCell>
                <p class="text-sm text-muted-foreground">
                  {{ ago(course.created_at) }}
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
                        :to="`/admin/course/${course.id}`"
                        class="flex items-center gap-2"
                      >
                        <Eye class="mr-2 h-4 w-4" />
                        Voir
                      </NuxtLink>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <NuxtLink
                        :to="`/admin/course/${course.id}/edit`"
                        class="flex items-center gap-2"
                      >
                        <Edit class="mr-2 h-4 w-4" />
                        Modifier
                      </NuxtLink>
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      class="text-destructive"
                      @click="showModalDeleteCourseId = course.id"
                    >
                      <Trash2 class="mr-2 h-4 w-4" />
                      Supprimer
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>

                <ConfirmationDialog
                  :open="showModalDeleteCourseId === course.id"
                  variant="destructive"
                  title="Suppression du cours"
                  description="Cette action est irréversible. Le cours sera définitivement supprimé."
                  confirm-text="Supprimer"
                  cancel-text="Annuler"
                  :loading="isLoading"
                  @confirm="
                    async () => {
                      await onDeleteCourse(course.id);
                    }
                  "
                  @cancel="showModalDeleteCourseId = null"
                />
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>

        <!-- Pagination -->
        <Pagination v-if="courses" :onPage="onPage" :meta="courses" />
      </div>
    </CardContent>
  </Card>
</template>
