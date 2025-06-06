<script setup lang="ts">
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/composables/useAuth";
import { ago } from "@/lib/date-time";
import { getItemOption } from "@/services/option";
import type { OptionModel } from "@/types/model";
import { Calendar, Mail, User, UserCheck } from "lucide-vue-next";
import { toast } from "vue-sonner";

useHead({
  title: "Détails option - Polytechnic Application",
});

definePageMeta({
  layout: "admin",
  middleware: ["admin"],
});

interface ModelDataResponse {
  data: OptionModel;
}

const auth = useAuth();
const route = useRoute();

const option = ref<OptionModel | null>(null);
const isLoading = ref<boolean>(true);

const optionId = parseInt(route.params.id as string);

if (!optionId || isNaN(optionId)) {
  throw createError({
    statusCode: 400,
    statusMessage: "L'ID de le option est requis et doit être un nombre valide",
  });
}

const fetchoption = async () => {
  try {
    isLoading.value = true;

    if (!auth.session.value?.accessToken) {
      throw new Error("utilisateur non authentifié");
    }

    const response = await getItemOption(
      auth.session.value.accessToken,
      optionId
    );
    const data = await response.json();

    if (response.ok) {
      option.value = (data as ModelDataResponse).data;
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
      description: "Impossible de charger le option",
    });
  } finally {
    isLoading.value = false;
  }
};

onMounted(async () => {
  await fetchoption();
});
</script>

<template>
  <div class="space-y-6">
    <!-- Header avec bouton retour -->
    <GoBack back="/admin/option" />

    <!-- Loader -->
    <LoaderContainer v-if="isLoading" :isCard="true" />

    <!-- option non trouvé -->
    <Card v-else-if="!option">
      <CardContent class="text-center py-12">
        <User class="h-12 w-12 mx-auto text-muted-foreground mb-4" />
        <p class="text-lg font-medium mb-2">option non trouvée</p>
        <p class="text-muted-foreground">
          L'option avec l'ID {{ optionId }} n'existe pas.
        </p>
      </CardContent>
    </Card>

    <!-- Détails de le option -->
    <div v-else class="grid gap-6 md:grid-cols-2">
      <!-- Informations principales -->
      <Card>
        <CardHeader>
          <CardTitle class="flex items-center gap-2">
            <User class="h-5 w-5" />
            Informations de l'option
          </CardTitle>
        </CardHeader>
        <CardContent class="space-y-4">
          <div class="grid gap-4">
            <div class="flex items-center gap-3">
              <User class="h-4 w-4 text-muted-foreground" />
              <div>
                <p class="text-sm font-medium">Nom de l'option</p>
                <p class="text-sm text-muted-foreground">
                  {{ option.name }}
                </p>
              </div>
            </div>

            <div class="flex items-center gap-3">
              <Mail class="h-4 w-4 text-muted-foreground" />
              <div>
                <p class="text-sm font-medium">Alias</p>
                <p class="text-sm text-muted-foreground">{{ option.alias }}</p>
              </div>
            </div>

            <div class="flex items-center gap-3">
              <Mail class="h-4 w-4 text-muted-foreground" />
              <div>
                <p class="text-sm font-medium">Départment</p>
                <p class="text-sm text-muted-foreground">
                  <TextLink :href="`/admin/department/${option.department.id}`">
                    {{ option.department.name }}
                  </TextLink>
                </p>
              </div>
            </div>

            <div class="flex items-center gap-3">
              <UserCheck class="h-4 w-4 text-muted-foreground" />
              <div>
                <p class="text-sm font-medium">Promotion</p>

                <Badge>
                  {{ option.levels.length }}
                </Badge>
              </div>
            </div>

            <div class="flex items-center gap-3">
              <Calendar class="h-4 w-4 text-muted-foreground" />
              <div>
                <p class="text-sm font-medium">Créé le</p>
                <p class="text-sm text-muted-foreground">
                  {{ ago(option.created_at) }}
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  </div>
</template>
