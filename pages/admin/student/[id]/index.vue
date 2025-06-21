<script setup lang="ts">
import { Badge } from "@/components/ui/badge";
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
import { getItemStudent } from "@/services/student";
import type { StudentModel } from "@/types/model";
import {
  Calendar,
  Mail,
  Phone,
  Send,
  Shield,
  User,
  UserCheck,
} from "lucide-vue-next";
import { toast } from "vue-sonner";

useHead({
  title: "Détails étudiant - Polytechnic Application",
});

definePageMeta({
  layout: "admin",
  middleware: ["admin", "verified"],
});

interface ModelDataResponse {
  data: StudentModel;
}

const auth = useAuth();
const route = useRoute();
const router = useRouter();

const student = ref<StudentModel | null>(null);
const isLoading = ref<boolean>(true);

const studentId = parseInt(route.params.id as string);

if (!studentId || isNaN(studentId)) {
  throw createError({
    statusCode: 400,
    statusMessage:
      "L'ID de l'étudiant est requis et doit être un nombre valide",
  });
}

const fetchStudent = async () => {
  try {
    isLoading.value = true;

    if (!auth.session.value?.accessToken) {
      throw new Error("utilisateur non authentifié");
    }

    const response = await getItemStudent(
      auth.session.value.accessToken,
      studentId
    );
    const data = await response.json();

    if (response.ok) {
      student.value = (data as ModelDataResponse).data;
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
      description: "Impossible de charger l'étudiant",
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
  fetchStudent();
});
</script>

<template>
  <div class="space-y-6">
    <!-- Header avec bouton retour -->
    <GoBack back="/admin/student" />

    <!-- Loader -->
    <LoaderContainer v-if="isLoading" :isCard="true" />

    <!-- étudiant non trouvé -->
    <Card v-else-if="!student">
      <CardContent class="text-center py-12">
        <User class="h-12 w-12 mx-auto text-muted-foreground mb-4" />
        <p class="text-lg font-medium mb-2">étudiant non trouvé</p>
        <p class="text-muted-foreground">
          L'étudiant avec l'ID {{ studentId }} n'existe pas.
        </p>
      </CardContent>
    </Card>

    <!-- Détails de l'étudiant -->
    <div v-else class="grid gap-6 md:grid-cols-2">
      <!-- Informations principales -->
      <Card>
        <CardHeader>
          <CardTitle class="flex items-center gap-2">
            <User class="h-5 w-5" />
            Informations personnelles
          </CardTitle>
          <CardDescription>
            Détails de l'étudiant {{ student.name }} {{ student.firstname }}
          </CardDescription>
        </CardHeader>
        <CardContent class="space-y-4">
          <div class="grid gap-4">
            <div class="flex items-center gap-3">
              <User class="h-4 w-4 text-muted-foreground" />
              <div>
                <p class="text-sm font-medium">Nom complet</p>
                <p class="text-sm text-muted-foreground">
                  {{ student.name }} {{ student.firstname }}
                </p>
              </div>
            </div>

            <div class="flex items-center gap-3">
              <Mail class="h-4 w-4 text-muted-foreground" />
              <div>
                <p class="text-sm font-medium">Télpéhone</p>
                <p class="text-sm text-muted-foreground">{{ student.phone }}</p>
              </div>
            </div>

            <div class="flex items-center gap-3">
              <UserCheck class="h-4 w-4 text-muted-foreground" />
              <div>
                <p class="text-sm font-medium">Genre</p>
                <p class="text-sm text-muted-foreground">
                  {{ student.gender }}
                </p>
              </div>
            </div>

            <div class="flex items-center gap-3">
              <UserCheck class="h-4 w-4 text-muted-foreground" />
              <div>
                <p class="text-sm font-medium">Matricule</p>
                <p class="text-sm text-muted-foreground">
                  {{ student.registration_token }}
                </p>
              </div>
            </div>

            <div class="flex items-center gap-3">
              <Calendar class="h-4 w-4 text-muted-foreground" />
              <div>
                <p class="text-sm font-medium">Créé le</p>
                <p class="text-sm text-muted-foreground">
                  {{ ago(student.created_at) }}
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <!-- Statut et rôles -->
      <Card v-if="student.user">
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
            <Badge
              :variant="
                student.user.isEmailVerified ? 'default' : 'destructive'
              "
            >
              {{
                student.user.isEmailVerified
                  ? "Email vérifié"
                  : "Email non vérifié"
              }}
            </Badge>
          </div>

          <div>
            <p class="text-sm font-medium mb-2">Statut du compte</p>
            <Badge
              :variant="
                isStudentAccountDisable(student.user.roles)
                  ? 'destructive'
                  : 'default'
              "
            >
              {{
                isStudentAccountDisable(student.user.roles)
                  ? "Compte bloqué"
                  : "Compte actif"
              }}
            </Badge>
          </div>

          <div>
            <p class="text-sm font-medium mb-2">Rôles</p>
            <div class="flex flex-wrap gap-2">
              <Badge
                v-for="role in getRoleLabels(student.user.roles)"
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
      <Card v-if="student.user" class="md:col-span-2">
        <CardHeader>
          <CardTitle class="flex items-center gap-2">
            <UserCheck class="h-5 w-5" />
            Informations du compte
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div class="grid gap-4 md:grid-cols-2">
            <div class="flex items-center gap-3">
              <User class="h-4 w-4 text-muted-foreground" />
              <div>
                <p class="text-sm font-medium">Nom d'utilisateur</p>
                <p class="text-sm text-muted-foreground">
                  {{ student.user.name }}
                </p>
              </div>
            </div>

            <div class="flex items-center gap-3">
              <Send class="h-4 w-4 text-muted-foreground" />
              <div>
                <p class="text-sm font-medium">Adresse e-mail</p>
                <p class="text-sm text-muted-foreground">
                  {{ student.user.email }}
                </p>
              </div>
            </div>

            <div class="flex items-center gap-3">
              <Phone class="h-4 w-4 text-muted-foreground" />
              <div>
                <p class="text-sm font-medium">Rôle</p>
                <p class="text-sm text-muted-foreground">
                  {{ student.user.roles.join(", ") || "Aucun rôle" }}
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
            Actions disponibles pour cet étudiant
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div class="flex flex-wrap gap-2">
            <Button variant="outline">
              <Edit class="h-4 w-4 mr-2" />
              Modifier l'étudiant
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
