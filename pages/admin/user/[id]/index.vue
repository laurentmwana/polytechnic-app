<script setup lang="ts">
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useAuth } from "@/composables/useAuth";
import { ago } from "@/lib/date-time";
import { isStudentAccountDisable } from "@/lib/role";
import { deleteUserLocal } from "@/services/session";
import { getItemUsers } from "@/services/user"; // Supposons qu'il existe une fonction pour récupérer un utilisateur par ID
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

useHead({
  title: "Détails utilisateur - Polytechnic Application",
});

definePageMeta({
  layout: "admin",
  middleware: ["admin"],
});

interface UserResponse {
  data: UserModel;
}

const auth = useAuth();
const route = useRoute();
const router = useRouter();

const user = ref<UserModel | null>(null);
const isLoading = ref<boolean>(true);

const userId = parseInt(route.params.id as string);

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
      user.value = (data as UserResponse).data;
    } else if (response.status == 401) {
      deleteUserLocal();
      router.push("/auth/login");
      toast.warning("Session", {
        description: "Votre session a expirée, merci de vous reconnecter",
      });
    } else {
      toast.error("Erreur", {
        description:
          (data as { message: string }).message || "Une erreur est survenue",
      });
    }
  } catch (error) {
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
    <!-- Header avec bouton retour -->
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

    <!-- Détails de l'utilisateur -->
    <div v-else class="grid gap-6 md:grid-cols-2">
      <!-- Informations principales -->
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
            <Button variant="outline" size="sm">
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
                <p class="text-sm text-muted-foreground">
                  {{ user.gender }}
                </p>
              </div>
            </div>

            <div class="flex items-center gap-3">
              <Calendar class="h-4 w-4 text-muted-foreground" />
              <div>
                <p class="text-sm font-medium">Créé le</p>
                <p class="text-sm text-muted-foreground">
                  {{ ago(user.created_at) }}
                </p>
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
          <CardDescription> Rôles et état du compte </CardDescription>
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

      <!-- Informations étudiant (si applicable) -->
      <Card v-if="user.student" class="md:col-span-2">
        <CardHeader>
          <CardTitle class="flex items-center gap-2">
            <UserCheck class="h-5 w-5" />
            Informations étudiant
          </CardTitle>
          <CardDescription> Détails spécifiques à l'étudiant </CardDescription>
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

      <!-- Actions -->
      <!-- <Card class="md:col-span-2">
        <CardHeader>
          <CardTitle>Actions</CardTitle>
          <CardDescription>
            Actions disponibles pour cet utilisateur
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div class="flex flex-wrap gap-2">
            <Button variant="outline">
              <Edit class="h-4 w-4 mr-2" />
              Modifier l'utilisateur
            </Button>
            <Button
              :variant="
                isStudentAccountDisable(user.roles) ? 'default' : 'destructive'
              "
            >
              {{
                isStudentAccountDisable(user.roles) ? "Débloquer" : "Bloquer"
              }}
              le compte
            </Button>
            <Button variant="outline">
              <Mail class="h-4 w-4 mr-2" />
              Renvoyer email de vérification
            </Button>
          </div>
        </CardContent>
      </Card> -->
    </div>
  </div>
</template>
