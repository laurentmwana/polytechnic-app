<script setup lang="ts">
import { ref, watch, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";

import ConfirmationDialog from "@/components/ui/dialog/ConfirmationDialog.vue";
import { ago } from "@/lib/date-time";
import { excerpt } from "@/lib/utils";
import { courseFollow, getCollectionCourses } from "@/services/other";
import type { CourseModel } from "@/types/model";
import type { PaginatedResponse } from "@/types/paginate";
import type { StateActionModel } from "@/types/util";
import { CheckCheck, Eye, Plus, Search } from "lucide-vue-next";
import { toast } from "vue-sonner";

useHead({
  title: "Les cours - Polytechnic Application",
});

definePageMeta({
  layout: "default",
});

const auth = useAuth();

type CoursePaginateProps = PaginatedResponse<CourseModel[]>;

const filters = ref([
  {
    title: "Semestre",
    label: "Par semestre",
    options: {
      all: "",
      s1: "Semestre 1",
      s2: "Semestre 2",
    },
  },
]);

const route = useRoute();
const router = useRouter();

const selectedSemester = ref<string | null>(
  (route.query.semester as string) || null
);
const search = ref<string>((route.query.search as string) || "");
const isPending = ref(true);
const courses = ref<CoursePaginateProps>();
const showModalFollowId = ref<number | null>(null);
const numberPage = ref(
  route.query.page ? parseInt(route.query.page as string, 10) : 1
);

const fetchCourses = async () => {
  try {
    if (!isPending.value) isPending.value = true;

    const response = await getCollectionCourses(
      numberPage.value,
      selectedSemester.value,
      search.value
    );
    const data = await response.json();

    if (response.ok) {
      courses.value = data as CoursePaginateProps;
    } else {
      toast.error("Erreur", {
        description:
          (data as { message?: string }).message || "Une erreur est survenue.",
      });
    }
  } catch (error) {
    toast.error("Erreur", {
      description: "Impossible de récupérer les cours.",
    });
  } finally {
    isPending.value = false;
  }
};

const updateQuery = async () => {
  await router.push({
    path: "/course",
    query: {
      page: numberPage.value,
      semester: selectedSemester.value ?? undefined,
      search: search.value || undefined,
    },
  });
  await fetchCourses();
};

const resetFilters = async () => {
  search.value = "";
  selectedSemester.value = null;
  numberPage.value = 1;

  await router.push({ path: "/course" });
  await fetchCourses();
};

const onPage = async (page: number) => {
  numberPage.value = page;
  await updateQuery();
};

const onFilterChange = async (value: string) => {
  selectedSemester.value = value;
  numberPage.value = 1;
  await updateQuery();
};

const onSearchChange = async () => {
  numberPage.value = 1;
  await updateQuery();
};

const onFollowCourse = async (courseId: number) => {
  try {
    if (!isPending.value) isPending.value = true;

    const token = auth.session.value?.accessToken;
    if (!token) throw new Error("Utilisateur non authentifié");

    const response = await courseFollow(token, courseId);
    const data = await response.json();

    if (response.ok) {
      const state = data as StateActionModel;

      toast("Suivre un cours", {
        description: state
          ? `Vous suivez maintenant le cours #${courseId}.`
          : `Vous ne suivez plus le cours #${courseId}.`,
      });

      await updateQuery();
    } else if (response.status === 401) {
      toast.warning("Session expirée", {
        description: "Merci de vous reconnecter.",
      });
      auth.logout();
    } else {
      toast.error("Erreur", {
        description:
          (data as { message?: string }).message || "Une erreur est survenue.",
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
    const pageNumber = newPage ? parseInt(newPage as string, 10) : 1;
    if (pageNumber !== numberPage.value) {
      numberPage.value = pageNumber;
      fetchCourses();
    }
  }
);

onMounted(fetchCourses);
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
    v-else-if="!courses || courses.data.length === 0"
  >
    <div class="section-page-header">
      <h2 class="section-page-title">Les cours</h2>
    </div>
    <!-- Résumé des filtres actifs -->
    <div
      v-if="selectedSemester || search"
      class="flex items-center justify-between p-3 bg-muted border text-sm rounded mb-4"
    >
      <div>
        Résultats
        <span v-if="search"
          >pour la recherche "<strong>{{ excerpt(search, 20) }}</strong
          >"</span
        >
        <span v-if="selectedSemester">
          {{ excerpt(search, 20) ? "et" : "filtrés" }} par "<strong>{{
            filters[0].options[selectedSemester]
          }}</strong
          >"
        </span>
      </div>
      <Button variant="outline" size="sm" @click="resetFilters"
        >Tout afficher</Button
      >
    </div>

    <p>Aucun cours trouvé.</p>
  </div>

  <div class="container my-12" v-else>
    <div class="section-page-header">
      <h2 class="section-page-title">Les cours</h2>
    </div>

    <!-- Filtres -->
    <div class="flex gap-3 justify-between flex-wrap mb-4">
      <div class="w-full md:w-56">
        <div class="flex gap-2">
          <Input
            placeholder="Recherche..."
            v-model="search"
            @keyup.enter="onSearchChange"
          />
          <Button :disable="!search"  variant="outline" @click="onSearchChange">
            <Search :size="15" />
          </Button>
        </div>
      </div>
      <Select
        @update:modelValue="onFilterChange"
        :modelValue="selectedSemester"
      >
        <SelectTrigger class="w-full md:w-56">
          <SelectValue
            :placeholder="filters[0].label"
            :value="selectedSemester"
          />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup v-for="filter in filters" :key="filter.title">
            <SelectLabel>{{ filter.label }}</SelectLabel>
            <SelectItem
              v-for="(value, key) in filter.options"
              :key="key"
              :value="key"
            >
              {{ value }}
            </SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>

    <!-- Résumé des filtres actifs -->
    <div
      v-if="selectedSemester || search"
      class="flex items-center justify-between px-2 py-3 bg-muted border text-sm rounded mb-4"
    >
      <div>
        Résultats
        <span v-if="search"
          >pour la recherche "<strong>{{ search }}</strong
          >"</span
        >
        <span v-if="selectedSemester">
          {{ search ? "et" : "filtrés" }} par "<strong>{{
            filters[0].options[selectedSemester]
          }}</strong
          >"
        </span>
      </div>
      <Button variant="outline" size="sm" @click="resetFilters"
        >Tout afficher</Button
      >
    </div>

    <!-- Table -->
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Nom</TableHead>
          <TableHead>Crédits</TableHead>
          <TableHead>Promotion</TableHead>
          <TableHead>Semestre</TableHead>
          <TableHead>Professeur</TableHead>
          <TableHead>Créé</TableHead>
          <TableHead class="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow v-for="course in courses.data" :key="course.id">
          <TableCell>{{ excerpt(course.name, 30) }}</TableCell>
          <TableCell>{{ course.credits }}</TableCell>
          <TableCell>{{ excerpt(course.level.name, 40) }}</TableCell>
          <TableCell>{{ course.semester }}</TableCell>
          <TableCell>{{
            excerpt(`${course.teacher.name} ${course.teacher.firstname}`, 40)
          }}</TableCell>
          <TableCell>{{ ago(course.created_at) }}</TableCell>
          <TableCell>
            <div class="flex items-center justify-end gap-4">
              <NuxtLink :href="`/course/${course.id}`">
                <Button size="sm" variant="secondary">
                  <Eye :size="15" />
                </Button>
              </NuxtLink>
              <Button
                v-if="auth.isAuthenticated.value && auth.isStudent.value"
                @click="showModalFollowId = course.id"
                size="sm"
              >
                <CheckCheck v-if="course.is_follow" :size="15" />
                <Plus v-else :size="15" />
              </Button>
              <ConfirmationDialog
                :open="showModalFollowId === course.id"
                variant="info"
                title="Suivre un cours"
                :description="`Voulez-vous vraiment suivre le cours #${course.id} ?`"
                confirm-text="Suivre"
                cancel-text="Annuler"
                :loading="isPending"
                @confirm="async () => await onFollowCourse(course.id)"
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
