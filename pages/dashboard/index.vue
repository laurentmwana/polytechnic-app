<script setup lang="ts">
import { toast } from "vue-sonner";
import { getDashboard } from "../../services/other";

useHead({
  title: "Tableau de bord - Polytechnic Application",
});
definePageMeta({
  layout: "admin",
  middleware: ["admin"],
});

interface DashboardProps {
  departments: number;
  options: number;
  levels: number;
  teachers: number;
}

const router = useRouter();

const isPending = ref<boolean>(true);
const dashboard = ref<DashboardProps>({
  departments: 0,
  options: 0,
  levels: 0,
  teachers: 0,
});

const auth = useAuth();

const fetchDashboard = async () => {
  if (auth.isPending.value) {
    return;
  }

  if (!auth.session.value) {
    return;
  }

  try {
    isPending.value = true;
    const response = await getDashboard(auth.session.value.accessToken);
    if (response.ok) {
      dashboard.value = await response.json();
    }

    if (response.status === 401) {
      toast.error("Votre session a expiré");
      auth.logout();
    }
  } catch (error) {
    toast.error("Une erreur est survenue lors de la récupération des données");
  } finally {
    isPending.value = false;
  }
};

onMounted(async () => {
  await fetchDashboard();
});
</script>

<template>
  <div class="mb-3">
    <h2 class="text-xl font-semibold">Tableau de bord</h2>
  </div>
  <div v-if="isPending">
    <div class="grid grid-cols-1 lg:grid-cols-4 gap-4">
      <Card v-for="c in 4" :key="c">
        <CardHeader>
          <CardTitle>
            <Skeleton class="w-10 h-4 bg-gray-200 dark:bg-gray-800" />
          </CardTitle>
          <CardDescription>
            <Skeleton class="w-full h-6 bg-gray-200 dark:bg-gray-800" />
          </CardDescription>
        </CardHeader>
      </Card>
    </div>
  </div>
  <div v-else>
    <div class="grid grid-cols-1 lg:grid-cols-4 gap-4">
      <Card>
        <CardHeader>
          <CardTitle> {{ dashboard.departments }} </CardTitle>
          <CardDescription>
            {{ dashboard.departments === 1 ? "Département" : "Départements" }}
          </CardDescription>
        </CardHeader>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle> {{ dashboard.options }} </CardTitle>
          <CardDescription>
            {{ dashboard.options === 1 ? "Option" : "Options" }}
          </CardDescription>
        </CardHeader>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle> {{ dashboard.levels }} </CardTitle>
          <CardDescription>
            {{ dashboard.levels === 1 ? "Niveau" : "Niveaux" }}
          </CardDescription>
        </CardHeader>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle> {{ dashboard.teachers }} </CardTitle>
          <CardDescription>
            {{ dashboard.teachers === 1 ? "Professeur" : "Professeurs" }}
          </CardDescription>
        </CardHeader>
      </Card>
    </div>
  </div>
</template>
