<template>
  <div class="min-h-screen">
    <div>
      <!-- Contenu principal -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <!-- Colonne principale -->
        <div class="lg:col-span-2 space-y-6">
          <!-- Informations générales -->
          <Card>
            <CardHeader>
              <CardTitle class="flex items-center">
                <InfoIcon class="w-5 h-5 mr-2" />
                Informations générales
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div class="space-y-4">
                  <div>
                    <Label class="text-sm font-medium text-muted-foreground"
                      >Année académique</Label
                    >
                    <p class="text-lg font-semibold">
                      {{ deliberation?.year?.name || "N/A" }}
                    </p>
                  </div>
                  <div>
                    <Label class="text-sm font-medium text-muted-foreground"
                      >Niveau d'études</Label
                    >
                    <p class="text-lg font-semibold">
                      {{ deliberation?.level?.name || "N/A" }}
                    </p>
                  </div>
                  <div>
                    <Label class="text-sm font-medium text-muted-foreground"
                      >Semestre</Label
                    >
                    <Badge variant="secondary" class="text-sm">
                      {{ deliberation?.semester }}
                    </Badge>
                  </div>
                </div>
                <div class="space-y-4">
                  <div>
                    <Label class="text-sm font-medium text-muted-foreground"
                      >Date de début</Label
                    >
                    <p class="text-lg">
                      {{ formatDate(deliberation?.start_at) }}
                    </p>
                  </div>
                  <div>
                    <Label class="text-sm font-medium text-muted-foreground"
                      >Date de création</Label
                    >
                    <p class="text-lg">
                      {{ formatDate(deliberation?.created_at) }}
                    </p>
                  </div>
                  <div>
                    <Label class="text-sm font-medium text-muted-foreground"
                      >Jours restants</Label
                    >
                    <p class="text-lg font-semibold text-primary">
                      {{ getDaysUntilStart() }}
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <!-- Critères de délibération -->
          <Card>
            <CardHeader>
              <CardTitle class="flex items-center">
                <ClipboardListIcon class="w-5 h-5 mr-2" />
                Critères de délibération
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div class="bg-muted p-4 rounded-lg">
                <p class="text-sm leading-relaxed">
                  {{
                    deliberation?.criteria ||
                    "Aucun critère spécifié pour cette délibération."
                  }}
                </p>
              </div>
            </CardContent>
          </Card>

          <!-- Liste des Juries -->
          <Card>
            <CardHeader>
              <CardTitle class="flex items-center justify-between">
                <div class="flex items-center">
                  <UsersIcon class="w-5 h-5 mr-2" />
                  Composition du jury ({{ deliberation?.juries?.length || 0 }})
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div
                v-if="
                  deliberation?.juries && props.deliberation.juries.length > 0
                "
                class="space-y-4"
              >
                <div
                  v-for="(jury, index) in props.deliberation.juries"
                  :key="jury.id"
                  class="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <div class="flex items-center space-x-4">
                    <Avatar>
                      <AvatarFallback
                        class="bg-primary text-primary-foreground"
                      >
                        {{
                          getInitials(
                            jury.teacher?.firstname,
                            jury.teacher?.name
                          )
                        }}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h4 class="font-medium">
                        {{ jury.teacher?.firstname }} {{ jury.teacher?.name }}
                      </h4>
                      <p class="text-sm text-muted-foreground">
                        {{ jury.teacher?.phone || "Téléphone non disponible" }}
                      </p>
                      <div class="flex items-center space-x-2 mt-1">
                        <Badge variant="outline" class="text-xs">
                          Jury {{ index + 1 }}
                        </Badge>
                        <Badge variant="secondary" class="text-xs">
                          Actif
                        </Badge>
                      </div>
                    </div>
                  </div>
                  <div class="flex items-center space-x-2">
                    <Button variant="ghost" size="sm" as-child>
                      <NuxtLink :href="`/teacher/${jury.teacher.id}`">
                        <Eye class="w-4 h-4" />
                      </NuxtLink>
                    </Button>
                  </div>
                </div>
              </div>

              <div v-else class="text-center py-8">
                <UsersIcon
                  class="mx-auto h-12 w-12 text-muted-foreground mb-4"
                />
                <h4 class="text-lg font-medium mb-2">Aucun jury assigné</h4>
                <p class="text-muted-foreground mb-4">
                  Cette délibération n'a pas encore de Juries assignés.
                </p>
                <Button variant="outline">
                  <PlusIcon class="w-4 h-4 mr-2" />
                  Ajouter le premier jury
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        <!-- Sidebar -->
        <div class="space-y-6">
          <!-- Statistiques rapides -->
          <Card>
            <CardHeader>
              <CardTitle class="text-lg">Statistiques</CardTitle>
            </CardHeader>
            <CardContent class="space-y-4">
              <div class="flex items-center justify-between">
                <div class="flex items-center space-x-2">
                  <div class="w-3 h-3 bg-blue-500 rounded-full"></div>
                  <span class="text-sm">Juries assignés</span>
                </div>
                <span class="font-semibold">{{
                  deliberation?.juries?.length || 0
                }}</span>
              </div>
              <div class="flex items-center justify-between">
                <div class="flex items-center space-x-2">
                  <div class="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span class="text-sm">Juries actifs</span>
                </div>
                <span class="font-semibold">{{ getActiveJuries() }}</span>
              </div>
              <div class="flex items-center justify-between">
                <div class="flex items-center space-x-2">
                  <div class="w-3 h-3 bg-yellow-500 rounded-full"></div>
                  <span class="text-sm">Jours restants</span>
                </div>
                <span class="font-semibold">{{ getDaysUntilStart() }}</span>
              </div>
            </CardContent>
          </Card>

          <!-- Historique récent -->
          <Card>
            <CardHeader>
              <CardTitle class="text-lg">Activité récente</CardTitle>
            </CardHeader>
            <CardContent>
              <div class="space-y-3 text-sm">
                <div class="flex items-start space-x-2">
                  <div class="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                  <div>
                    <p class="font-medium">Délibération créée</p>
                    <p class="text-muted-foreground">
                      {{ formatDate(deliberation?.created_at) }}
                    </p>
                  </div>
                </div>
                <div class="flex items-start space-x-2">
                  <div class="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                  <div>
                    <p class="font-medium">Juries assignés</p>
                    <p class="text-muted-foreground">
                      {{ deliberation?.juries?.length || 0 }} membres
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { DeliberationModel } from "@/types/model";
import {
  Eye,
  ClipboardListIcon,
  EditIcon,
  InfoIcon,
  MoreVerticalIcon,
  PlusIcon,
  UsersIcon,
} from "lucide-vue-next";

const props = defineProps<{
  deliberation: DeliberationModel;
  isLoading: boolean;
}>();

// Méthodes
const formatDate = (dateString: string | null) => {
  if (!dateString) return "N/A";
  const date = new Date(dateString);
  return date.toLocaleDateString("fr-FR", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const getInitials = (firstName?: string, lastName?: string) => {
  if (!firstName && !lastName) return "??";
  const first = firstName ? firstName.charAt(0).toUpperCase() : "";
  const last = lastName ? lastName.charAt(0).toUpperCase() : "";
  return first + last;
};

const getActiveJuries = () => {
  return props.deliberation?.juries?.length || 0;
};

const getDaysUntilStart = () => {
  if (!props.deliberation?.start_at) return "N/A";
  const startDate = new Date(props.deliberation.start_at);
  const today = new Date();
  const diffTime = startDate.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays > 0 ? `${diffDays} jours` : "Commencé";
};

const getStatus = () => {
  if (!props.deliberation?.start_at) return "En attente";
  const startDate = new Date(props.deliberation.start_at);
  const today = new Date();
  return startDate > today ? "Programmé" : "En cours";
};

const getStatusVariant = () => {
  const status = getStatus();
  switch (status) {
    case "Programmé":
      return "secondary";
    case "En cours":
      return "default";
    default:
      return "outline";
  }
};
</script>
