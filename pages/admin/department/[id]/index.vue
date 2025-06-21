<script setup lang="ts">
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/composables/useAuth";
import { ago } from "@/lib/date-time";
import { getItemDepartment } from "@/services/department";
import type { DepartmentModel } from "@/types/model";
import { CalendarDays, Tag, Landmark } from "lucide-vue-next";
import { toast } from "vue-sonner";

useHead({
  title: "Détails du département - Polytechnic Application",
});

definePageMeta({
  layout: "admin",
  middleware: ["admin", "verified"],
});

interface ModelDataResponse {
  data: DepartmentModel;
}

const auth = useAuth();
const route = useRoute();

const department = ref<DepartmentModel | null>(null);
const isLoading = ref(true);

const departmentId = parseInt(route.params.id as string);

if (!departmentId || isNaN(departmentId)) {
  throw createError({
    statusCode: 400,
    statusMessage:
      "L'ID du département est requis et doit être un nombre valide",
  });
}

const fetchDepartment = async () => {
  try {
    isLoading.value = true;

    if (!auth.session.value?.accessToken) {
      throw new Error("Utilisateur non authentifié");
    }

    const response = await getItemDepartment(
      auth.session.value.accessToken,
      departmentId
    );
    const data = await response.json();

    if (response.ok) {
      department.value = (data as ModelDataResponse).data;
    } else if (response.status === 401) {
      toast.warning("Session expirée", {
        description: "Merci de vous reconnecter",
      });
      auth.logout();
    } else {
      toast.error("Erreur", {
        description: (data as { message: string }).message || "Une erreur est survenue",
      });
    }
  } catch (error) {
    toast.error("Erreur", {
      description: "Impossible de charger le département",
    });
  } finally {
    isLoading.value = false;
  }
};

onMounted(fetchDepartment);
</script>
<template>
  <div class="space-y-6">
    <!-- Bouton retour -->
    <GoBack back="/admin/department" />

    <!-- Loader -->
    <LoaderContainer v-if="isLoading" :isCard="true" />

    <!-- Département non trouvé -->
    <Card v-else-if="!department">
      <CardContent class="text-center py-12">
        <Landmark class="h-12 w-12 mx-auto text-muted-foreground mb-4" />
        <p class="text-lg font-medium mb-2">Département non trouvé</p>
        <p class="text-muted-foreground">
          Le département avec l'ID {{ departmentId }} n'existe pas.
        </p>
      </CardContent>
    </Card>

    <!-- Détails du département -->
    <div v-else class="grid gap-6 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle class="flex items-center gap-2">
            <Landmark class="h-5 w-5 text-primary" />
            Informations du département
          </CardTitle>
        </CardHeader>
        <CardContent class="space-y-4">
          <div class="grid gap-4">
            <div class="flex items-center gap-3">
              <Tag class="h-4 w-4 text-muted-foreground" />
              <div>
                <p class="text-sm font-medium">Nom</p>
                <p class="text-sm text-muted-foreground">{{ department.name }}</p>
              </div>
            </div>

            <div class="flex items-center gap-3">
              <Tag class="h-4 w-4 text-muted-foreground" />
              <div>
                <p class="text-sm font-medium">Alias</p>
                <p class="text-sm text-muted-foreground">{{ department.alias }}</p>
              </div>
            </div>

            <div class="flex items-center gap-3">
              <CalendarDays class="h-4 w-4 text-muted-foreground" />
              <div>
                <p class="text-sm font-medium">Créé le</p>
                <p class="text-sm text-muted-foreground">{{ ago(department.created_at) }}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  </div>
</template>
