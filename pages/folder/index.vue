<script setup lang="ts">
import type { FolderModel } from "@/types/model";
import { toast } from "vue-sonner";
import { getInitials } from "@/lib/utils";
import { getItemFolder } from "@/services/folder";
import { Phone, User } from "lucide-vue-next";

useHead({
  title: "Mon dossier - Polytechnic Application",
});
definePageMeta({
  layout: "default",
  middleware: ["student"],
});

type FolderResponseType = { data: FolderModel };

const isPending = ref<boolean>(true);
const folder = ref<FolderModel>();

const auth = useAuth();
const router = useRouter();

const fetchFolder = async () => {
  try {
    isPending.value = true;

    if (!auth.session.value?.accessToken) {
      throw new Error("utilisateur non authentifié");
    }

    const response = await getItemFolder(auth.session.value.accessToken);
    const data = await response.json();
    if (response.ok) {
      folder.value = (data as FolderResponseType).data;
    } else if (response.status === 401) {
      auth.logout();
      toast.warning("Session", {
        description: "Votre session a expirée",
      });
      await router.push("/auth/login");
    } else {
      toast.error("Erreur", {
        description:
          (data as { message: string }).message || "Une erreur est survenue",
      });
    }
  } catch (error) {
    toast.error("Erreur", {
      description: `Impossible de récupèrer votre dossier académique`,
    });
  } finally {
    isPending.value = false;
  }
};

onMounted(() => {
  fetchFolder();
});

const activeTab = ref("history");
</script>

<template>
  <div class="container my-12" v-if="isPending">
    <div class="section-page-header">
      <h2 class="section-page-title">Mon dossier</h2>
    </div>

    <LoaderContainer :is-card="true" />
  </div>

  <div class="container my-12" v-if="!folder && !isPending">
    <div class="section-page-header">
      <h2 class="section-page-title">Mon dossier</h2>
    </div>
    <p>Pas de dossier académique disponible</p>
  </div>

  <div class="container my-12" v-if="folder">
    <div class="section-page-header">
      <h2 class="section-page-title">Mon dossier</h2>
    </div>

    <div class="grid gap-6">
      <!-- En-tête du profil -->
      <Card>
        <CardHeader class="flex flex-row items-center gap-4">
          <Avatar class="h-16 w-16">
            <AvatarFallback
              class="text-lg bg-primary text-primary-foreground"
              >{{
                getInitials(`${folder.name} ${folder.firstname}`)
              }}</AvatarFallback
            >
          </Avatar>
          <div class="grid gap-1">
            <CardTitle class="text-2xl">
              {{ folder.firstname }} {{ folder.name }}
            </CardTitle>
            <CardDescription class="flex items-center gap-2">
              <User class="h-4 w-4" />
              ID: {{ folder.id }} |
              <Phone class="h-4 w-4 ml-2" />
              {{ folder.phone }}
            </CardDescription>
          </div>
          <Badge class="ml-auto">{{ folder.gender }}</Badge>
        </CardHeader>
      </Card>

      <!-- Niveau actuel -->
      <Card>
        <CardHeader>
          <CardTitle class="flex items-center gap-2">
            <GraduationCap class="h-5 w-5" />
            Promotion Actuelle
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div class="grid gap-4">
            <div class="flex items-center justify-between">
              <div>
                <p class="font-medium">
                  {{ folder.actual_level.level.name }} ({{
                    folder.actual_level.level.alias
                  }})
                </p>
                <p class="text-sm text-muted-foreground">
                  {{ folder.actual_level.level.programme }}
                </p>
              </div>
              <Badge variant="outline" class="flex items-center gap-1">
                <Calendar class="h-3 w-3" />
                {{ folder.actual_level.year.name }}
              </Badge>
            </div>
            <div>
              <p class="text-sm font-medium">Option:</p>
              <p class="text-sm">{{ folder.actual_level.level.option.name }}</p>
              <p class="text-xs text-muted-foreground">
                Alias: {{ folder.actual_level.level.option.alias }}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <!-- Onglets pour les autres informations -->
      <Tabs v-model="activeTab" class="w-full">
        <TabsList class="grid grid-cols-2">
          <TabsTrigger value="history">Historique des promotions</TabsTrigger>
          <TabsTrigger value="courses">Cours Suivis</TabsTrigger>
        </TabsList>

        <!-- Historique des niveaux -->
        <TabsContent value="history">
          <Card>
            <CardHeader>
              <CardTitle>Historique Académique</CardTitle>
              <CardDescription
                >Parcours académique de l'étudiant</CardDescription
              >
            </CardHeader>
            <CardContent>
              <div class="space-y-6">
                <div
                  v-for="(history, index) in folder.historic_levels"
                  :key="history.id"
                  class="space-y-2"
                >
                  <Separator v-if="index > 0" />
                  <div class="pt-2">
                    <div class="flex items-center justify-between">
                      <div class="flex items-center gap-2">
                        <Badge variant="outline">{{
                          history.level.alias
                        }}</Badge>
                        <span class="font-medium">{{
                          history.level.name
                        }}</span>
                      </div>
                      <Badge variant="secondary">{{ history.year.name }}</Badge>
                    </div>
                    <p class="text-sm text-muted-foreground mt-1">
                      {{ history.level.programme }}
                    </p>
                    <div class="mt-2">
                      <p class="text-sm">
                        <span class="font-medium">Option:</span>
                        {{ history.level.option.name }}
                      </p>
                      <p class="text-xs text-muted-foreground">
                        Alias: {{ history.level.option.alias }}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <!-- Cours suivis -->
        <TabsContent value="courses">
          <Card>
            <CardHeader>
              <CardTitle>Cours Suivis</CardTitle>
              <CardDescription
                >Année académique:
                {{
                  folder.course_followeds[0]?.year.name || "N/A"
                }}</CardDescription
              >
            </CardHeader>
            <CardContent>
              <div class="space-y-6">
                <div
                  v-for="(courseFollowed, index) in folder.course_followeds"
                  :key="index"
                  class="space-y-2"
                >
                  <Separator v-if="index > 0" />
                  <div class="pt-2">
                    <div class="flex items-center justify-between">
                      <div class="flex items-center gap-2">
                        <BookOpen class="h-4 w-4" />
                        <span class="font-medium">{{
                          courseFollowed.course.name
                        }}</span>
                      </div>
                      <Badge>{{ courseFollowed.course.credits }} crédits</Badge>
                    </div>
                    <p class="text-sm text-muted-foreground mt-1">
                      Code: {{ courseFollowed.course.code }}
                    </p>
                    <div class="mt-2 grid gap-1">
                      <p class="text-sm">
                        <span class="font-medium">Enseignant:</span>
                        {{ courseFollowed.course.teacher.firstname }}
                        {{ courseFollowed.course.teacher.name }}
                      </p>
                      <p class="text-xs text-muted-foreground">
                        Département:
                        {{ courseFollowed.course.teacher.department.name }} ({{
                          courseFollowed.course.teacher.department.alias
                        }})
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  </div>
</template>
