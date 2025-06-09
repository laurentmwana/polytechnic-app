<script setup lang="ts">
import ConfirmationDialog from "@/components/ui/dialog/ConfirmationDialog.vue";
import { ago } from "@/lib/date-time";
import { excerpt } from "@/lib/utils";
import { courseFollow, getCollectionCourses } from "@/services/other";
import type { CourseModel } from "@/types/model";
import type { PaginatedResponse } from "@/types/paginate";
import type { StateActionModel } from "@/types/util";
import { CheckCheck, Eye, Plus } from "lucide-vue-next";
import { toast } from "vue-sonner";

useHead({
  title: "Les cours - Polytechnic Application",
});
definePageMeta({
  layout: "default",
});

type CoursePaginateProps = PaginatedResponse<CourseModel[]>;

const isPending = ref<boolean>(true);
const auth = useAuth();
const courses = ref<CoursePaginateProps>();
const showModalFollowId = ref<number | null>(null);
const router = useRouter();
const route = useRoute();

const numberPage = ref<number>(
  route.query.page ? parseInt(route.query.page as string) : 1
);

const fetchCourses = async () => {
  try {
    isPending.value = true;

    const response = await getCollectionCourses(numberPage.value);
    const data = await response.json();

    if (response.ok) {
      courses.value = data as CoursePaginateProps;
    } else {
      toast.error("Erreur", {
        description:
          (data as { message: string }).message || "Une erreur est survenue",
      });
    }
  } catch (error) {
    toast.error("Erreur", {
      description: `Impossible de récupèrer les professeurss`,
    });
  } finally {
    isPending.value = false;
  }
};

const onPage = async (page: number) => {
  numberPage.value = page;
  await router.push(`/teacher?page=${page}`);
  await fetchCourses();
};

const onFollowCourse = async (courseId: number) => {
  try {
    isPending.value = true;

    if (!auth.session.value?.accessToken) {
      throw new Error("Utilisateur non authentifié");
    }

    const response = await courseFollow(
      auth.session.value.accessToken,
      courseId
    );
    const data = await response.json();

    if (response.ok) {
      const state = data as StateActionModel;

      if (state) {
        toast("Suivre un cours", {
          description: `Vous avez follow le cours #${courseId}`,
        });

        router.replace("/course?page=1");

        await fetchCourses();
      } else {
        toast("Suppression échouée", {
          description: `Vous avez unfollow le cours #${courseId}`,
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
      description: "Impossible d'effectuer cette action, merci de réessayer.",
    });
  } finally {
    showModalFollowId.value = null;
    isPending.value = false;
  }
};

watch(
  () => route.query.page,
  (newPage) => {
    const pageNumber = newPage ? parseInt(newPage as string) : 1;
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
  <div class="container my-12" v-if="isPending">
    <div class="section-page-header">
      <h2 class="section-page-title">Les cours</h2>
    </div>

    <LoaderContainer :is-card="true" />
  </div>

  <div
    class="container my-12"
    v-else-if="(!courses || (courses && courses.data.length === 0)) && !isPending"
  >
    <div class="section-page-header">
      <h2 class="section-page-title">Les cours</h2>
    </div>
    <p>Pas de professeurs</p>
  </div>

  <div
    class="container my-12"
    v-else-if="courses && courses.data.length > 0 && !isPending"
  >
    <div class="section-page-header">
      <h2 class="section-page-title">Les cours</h2>
    </div>

    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Code</TableHead>
          <TableHead>Nom</TableHead>
          <TableHead>Crédits</TableHead>
          <TableHead>Promotion</TableHead>
          <TableHead>Professeur</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow v-for="course in courses.data" :key="course.id">
          <TableCell>
            {{ course.code }}
          </TableCell>
          <TableCell>
            {{ excerpt(course.name, 30) }}
          </TableCell>
          <TableCell>
            {{ course.credits }}
          </TableCell>
          <TableCell>
            {{ excerpt(`${course.level.name}  [${course.level.alias}]`, 40) }}
          </TableCell>
          <TableCell>
            {{
              excerpt(`${course.teacher.name}  ${course.teacher.firstname}`, 40)
            }}
          </TableCell>
          <TableCell>
            {{ ago(course.created_at) }}
          </TableCell>
          <TableCell>
            <div class="flex items-center justify-end gap-4">
              <Button size="sm" variant="secondary">
                <NuxtLink :href="`/course/${course.id}`">
                  <Eye :size="15" />
                </NuxtLink>
              </Button>
              <Button
                v-if="auth.isAuthenticated.value && auth.isStudent.value"
                @click="showModalFollowId = course.id"
                size="sm"
              >
                <CheckCheck v-if="course.is_follow" :size="15" />
                <Plus v-else :size="15" />
              </Button>
              <ConfirmationDialog
                :open="
                  showModalFollowId !== null && showModalFollowId === course.id
                "
                variant="info"
                title="Suivre un cours"
                :description="`Voulez-vous vraimment suivre le cours #${course.id}?`"
                confirm-text="Suivre"
                cancel-text="Annuler"
                :loading="isPending"
                @confirm="
                  async () => {
                    await onFollowCourse(course.id);
                  }
                "
                @cancel="showModalFollowId = null"
              />
            </div>
          </TableCell>
        </TableRow>
      </TableBody>
    </Table>

    <!-- Pagination -->
    <Pagination :onPage="onPage" :meta="courses" />
  </div>
</template>
