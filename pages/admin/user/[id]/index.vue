<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import {
  Badge,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui"; // Si tu as un index qui exporte tout
import { useAuth } from "@/composables/useAuth";
import { ago } from "@/lib/date-time";
import { isStudentAccountDisable } from "@/lib/role";
import { getItemUsers } from "@/services/user";
import type { UserModel } from "@/types/model";
import {
  Calendar,
  Edit,
  Mail,
  Phone,
  Shield,
  User,
  UserCheck,
} from "lucide-vue-next";
import { toast } from "vue-sonner";
import LoaderContainer from "@/components/LoaderContainer.vue";
import GoBack from "@/components/GoBack.vue";

useHead({
  title: "Détails utilisateur - Polytechnic Application",
});

definePageMeta({
  layout: "admin",
  middleware: ["admin", "verified"],
});

interface ModelDataResponse {
  data: UserModel;
}

const auth = useAuth();
const route = useRoute();
const router = useRouter();

const user = ref<UserModel | null>(null);
const isLoading = ref(true);

const userId = Number(route.params.id);

if (!userId || isNaN(userId)) {
  throw createError({
    statusCode: 400,
    statusMessage:
      "L'ID de l'utilisateur est requis et doit être un nombre valide",
  });
}

const fetchUser = async () => {
  try {
    isLoading.value = true;

    if (!auth.session.value?.accessToken) {
      throw new Error("Utilisateur non authentifié");
    }

    const response = await getItemUsers(auth.session.value.accessToken, userId);
    const data = await response.json();

    if (response.ok) {
      user.value = (data as ModelDataResponse).data;
    } else if (response.status === 401) {
      toast.warning("Session", {
        description: "Votre session a expiré, merci de vous reconnecter",
      });
      auth.logout();
    } else {
      toast.error("Erreur", {
        description:
          (data as { message?: string }).message || "Une erreur est survenue",
      });
    }
  } catch {
    toast.error("Erreur", {
      description: "Impossible de charger l'utilisateur",
    });
  } finally {
    isLoading.value = false;
  }
};

const getRoleLabels = (roles: string[]) => {
  const roleMap: Record<string, string> = {
    admin: "Administrateur",
    student: "Étudiant",
    teacher: "Enseignant",
    staff: "Personnel",
  };

  return roles.map((role) => roleMap[role] || role);
};

onMounted(() => {
  fetchUser();
});
</script>

<template>
  <div class="space-y-6">
    <!-- Bouton retour -->
    <GoBack back="/admin/user" />

    <!-- Loader -->
    <LoaderContainer v-if="isLoading" :isCard="true" />

    <!-- Utilisateur non trouvé -->
    <Card v-else-if="!user">
      <CardContent class="text-center py-12">
        <User class="h-12 w-12 mx-auto text-muted-foreground mb-4" />
        <p class="text-lg font-medium mb-2">Utilisateur non trouvé</p>
        <p class="text-muted-foreground">
          L'utilisateur avec l'ID {{ userId }} n'existe pas.
        </p>
      </CardContent>
    </Card>

    <!-- Détails utilisateur -->
    <div v-else class="grid gap-6 md:grid-cols-2">
      <!-- Informations personnelles -->
      <Card>
        <CardHeader>
          <div class="flex items-center justify-between">
            <div>
              <CardTitle class="flex items-center gap-2">
                <User class="h-5 w-5" />
                Informations personnelles
              </CardTitle>
              <CardDescription>
                Détails de l'utilisateur {{ user.name }} {{ user.firstname }}
              </CardDescription>
            </div>
            <Button variant="outline" size="sm" @click="$router.push(`/admin/user/${userId}/edit`)">
              <Edit class="h-4 w-4 mr-2" />
              Modifier
            </Button>
          </div>
        </CardHeader>
        <CardContent class="space-y-4">
          <div class="grid gap-4">
            <div class="flex items-center gap-3">
              <User class="h-4 w-4 text-muted-foreground" />
              <div>
                <p class="text-sm font-medium">Nom complet</p>
                <p class="text-sm text-muted-foreground">
                  {{ user.name }} {{ user.firstname }}
                </p>
              </div>
            </div>

            <div class="flex items-center gap-3">
              <Mail class="h-4 w-4 text-muted-foreground" />
              <div>
                <p class="text-sm font-medium">Email</p>
                <p class="text-sm text-muted-foreground">{{ user.email }}</p>
              </div>
            </div>

            <div class="flex items-center gap-3">
              <UserCheck class="h-4 w-4 text-muted-foreground" />
              <div>
                <p class="text-sm font-medium">Genre</p>
                <p class="text-sm text-muted-foreground">{{ user.gender }}</p>
              </div>
            </div>

            <div class="flex items-center gap-3">
              <Calendar class="h-4 w-4 text-muted-foreground" />
              <div>
                <p class="text-sm font-medium">Créé le</p>
                <p class="text-sm text-muted-foreground">{{ ago(user.created_at) }}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <!-- Statut et rôles -->
      <Card>
        <CardHeader>
          <CardTitle class="flex items-center gap-2">
            <Shield class="h-5 w-5" />
            Statut et permissions
          </CardTitle>
          <CardDescription>Rôles et état du compte</CardDescription>
        </CardHeader>
        <CardContent class="space-y-4">
          <div>
            <p class="text-sm font-medium mb-2">Vérification email</p>
            <Badge :variant="user.isEmailVerified ? 'default' : 'destructive'">
              {{ user.isEmailVerified ? "Email vérifié" : "Email non vérifié" }}
            </Badge>
          </div>

          <div>
            <p class="text-sm font-medium mb-2">Statut du compte</p>
            <Badge
              :variant="
                isStudentAccountDisable(user.roles) ? 'destructive' : 'default'
              "
            >
              {{
                isStudentAccountDisable(user.roles)
                  ? "Compte bloqué"
                  : "Compte actif"
              }}
            </Badge>
          </div>

          <div>
            <p class="text-sm font-medium mb-2">Rôles</p>
            <div class="flex flex-wrap gap-2">
              <Badge
                v-for="role in getRoleLabels(user.roles)"
                :key="role"
                variant="outline"
              >
                {{ role }}
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      <!-- Informations étudiant si applicables -->
      <Card v-if="user.student" class="md:col-span-2">
        <CardHeader>
          <CardTitle class="flex items-center gap-2">
            <UserCheck class="h-5 w-5" />
            Informations étudiant
          </CardTitle>
          <CardDescription>Détails spécifiques à l'étudiant</CardDescription>
        </CardHeader>
        <CardContent>
          <div class="grid gap-4 md:grid-cols-2">
            <div class="flex items-center gap-3">
              <User class="h-4 w-4 text-muted-foreground" />
              <div>
                <p class="text-sm font-medium">Nom étudiant</p>
                <p class="text-sm text-muted-foreground">
                  {{ user.student.name }} {{ user.student.firstname }}
                </p>
              </div>
            </div>

            <div class="flex items-center gap-3">
              <Phone class="h-4 w-4 text-muted-foreground" />
              <div>
                <p class="text-sm font-medium">Téléphone</p>
                <p class="text-sm text-muted-foreground">
                  {{ user.student.phone || "Non renseigné" }}
                </p>
              </div>
            </div>

            <div class="flex items-center gap-3">
              <UserCheck class="h-4 w-4 text-muted-foreground" />
              <div>
                <p class="text-sm font-medium">Genre</p>
                <p class="text-sm text-muted-foreground">
                  {{ user.student.gender }}
                </p>
              </div>
            </div>

            <div class="flex items-center gap-3">
              <Calendar class="h-4 w-4 text-muted-foreground" />
              <div>
                <p class="text-sm font-medium">Matricule</p>
                <p class="text-sm text-muted-foreground">
                  {{ user.student.registration_token }}
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  </div>
</template>
