<script setup lang="ts">
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useAuth } from "@/composables/useAuth";
import { ago } from "@/lib/date-time";
import { getItemTeacher } from "@/services/teacher";
import type { TeacherModel } from "@/types/model";
import { Calendar, Mail, User, UserCheck } from "lucide-vue-next";
import { toast } from "vue-sonner";

useHead({
  title: "Détails du professeur - Polytechnic Application",
});

definePageMeta({
  layout: "admin",
  middleware: ["admin", "verified"],
});

interface ModelDataResponse {
  data: TeacherModel;
}

const auth = useAuth();
const route = useRoute();
const router = useRouter();

const teacher = ref<TeacherModel | null>(null);
const isLoading = ref<boolean>(true);

const teacherId = parseInt(route.params.id as string);

if (!teacherId || isNaN(teacherId)) {
  throw createError({
    statusCode: 400,
    statusMessage:
      "le ID de le professeur est requis et doit être un nombre valide",
  });
}

const fetchTeacher = async () => {
  try {
    isLoading.value = true;

    if (!auth.session.value?.accessToken) {
      throw new Error("utilisateur non authentifié");
    }

    const response = await getItemTeacher(
      auth.session.value.accessToken,
      teacherId
    );
    const data = await response.json();

    if (response.ok) {
      teacher.value = (data as ModelDataResponse).data;
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
      description: "Impossible de charger le professeur",
    });
  } finally {
    isLoading.value = false;
  }
};

onMounted(async () => {
  await fetchTeacher();
});
</script>

<template>
  <div class="space-y-6">
    <!-- Header avec bouton retour -->
    <GoBack back="/admin/teacher" />

    <!-- Loader -->
    <LoaderContainer v-if="isLoading" :isCard="true" />

    <!-- professeur non trouvé -->
    <Card v-else-if="!teacher">
      <CardContent class="text-center py-12">
        <User class="h-12 w-12 mx-auto text-muted-foreground mb-4" />
        <p class="text-lg font-medium mb-2">professeur non trouvé</p>
        <p class="text-muted-foreground">
          le professeur avec le ID {{ teacherId }} n'existe pas.
        </p>
      </CardContent>
    </Card>

    <!-- Détails de le professeur -->
    <div v-else class="grid gap-6 md:grid-cols-2">
      <!-- Informations principales -->
      <Card>
        <CardHeader>
          <CardTitle class="flex items-center gap-2">
            <User class="h-5 w-5" />
            Informations personnelles
          </CardTitle>
          <CardDescription>
            Détails de le professeur {{ teacher.name }} {{ teacher.firstname }}
          </CardDescription>
        </CardHeader>
        <CardContent class="space-y-4">
          <div class="grid gap-4">
            <div class="flex items-center gap-3">
              <User class="h-4 w-4 text-muted-foreground" />
              <div>
                <p class="text-sm font-medium">Nom complet</p>
                <p class="text-sm text-muted-foreground">
                  {{ teacher.name }} {{ teacher.firstname }}
                </p>
              </div>
            </div>

            <div class="flex items-center gap-3">
              <Mail class="h-4 w-4 text-muted-foreground" />
              <div>
                <p class="text-sm font-medium">Télpéhone</p>
                <p class="text-sm text-muted-foreground">{{ teacher.phone }}</p>
              </div>
            </div>

            <div class="flex items-center gap-3">
              <UserCheck class="h-4 w-4 text-muted-foreground" />
              <div>
                <p class="text-sm font-medium">Genre</p>
                <p class="text-sm text-muted-foreground">
                  {{ teacher.gender }}
                </p>
              </div>
            </div>

            <div class="flex items-center gap-3">
              <UserCheck class="h-4 w-4 text-muted-foreground" />
              <div>
                <p class="text-sm font-medium">Département</p>
                <p class="text-sm text-muted-foreground">
                  {{ teacher.department.name }}
                </p>
              </div>
            </div>

            <div class="flex items-center gap-3">
              <Calendar class="h-4 w-4 text-muted-foreground" />
              <div>
                <p class="text-sm font-medium">Créé le</p>
                <p class="text-sm text-muted-foreground">
                  {{ ago(teacher.created_at) }}
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  </div>
</template>
