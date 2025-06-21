<script setup lang="ts">
import LevelForm from "@/components/features/level/LevelForm.vue";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/composables/useAuth";
import type { SchemaLevelFormInfer } from "@/definitions/level";
import { editLevel, getItemLevel } from "@/services/level";
import type { LevelModel } from "@/types/model";
import type { StateActionModel, ValidatorErrorProps } from "@/types/util";
import { PencilLine } from "lucide-vue-next";
import { toast } from "vue-sonner";

useHead({
  title: "Édition d'une promotion - Polytechnic Application",
});

definePageMeta({
  layout: "admin",
  middleware: ["admin", "verified"],
});

interface ModelResponse {
  data: LevelModel;
}

const auth = useAuth();
const route = useRoute();
const router = useRouter();

const level = ref<LevelModel | null>(null);
const isLoading = ref(true);
const isEdit = ref(false);
const validator = ref<ValidatorErrorProps | null>(null);

const levelId = parseInt(route.params.id as string);

if (!levelId || isNaN(levelId)) {
  throw createError({
    statusCode: 400,
    statusMessage: "L'ID de la promotion est requis et doit être un nombre valide",
  });
}

const fetchLevel = async () => {
  try {
    isLoading.value = true;

    if (!auth.session.value?.accessToken) {
      throw new Error("Utilisateur non authentifié");
    }

    const response = await getItemLevel(auth.session.value.accessToken, levelId);
    const data = await response.json();

    if (response.ok) {
      level.value = (data as ModelResponse).data;
    } else if (response.status === 401) {
      toast.warning("Session expirée", {
        description: "Merci de vous reconnecter.",
      });
      auth.logout();
    } else {
      toast.error("Erreur", {
        description: (data as { message: string }).message || "Une erreur est survenue.",
      });
    }
  } catch {
    toast.error("Erreur", {
      description: "Impossible de charger les informations de la promotion.",
    });
  } finally {
    isLoading.value = false;
  }
};

const onSubmit = async (values: SchemaLevelFormInfer) => {
  try {
    isEdit.value = true;
    validator.value = null;

    if (!auth.session.value?.accessToken) {
      throw new Error("Utilisateur non authentifié");
    }

    const response = await editLevel(auth.session.value.accessToken, levelId, values);
    const data = await response.json();

    if (response.ok) {
      const state = (data as StateActionModel).state;

      if (state) {
        toast.success("Édition réussie", {
          description: `Les informations de la promotion #${levelId} ont été modifiées.`,
        });

        router.push("/admin/level");
      } else {
        toast.error("Échec de l'édition", {
          description: "Impossible de modifier la promotion. Veuillez réessayer.",
        });
      }
    } else if (response.status === 422) {
      validator.value = data as ValidatorErrorProps;
    } else if (response.status === 401) {
      toast.warning("Session expirée", {
        description: "Merci de vous reconnecter.",
      });
      auth.logout();
    } else {
      toast.error("Erreur", {
        description: (data as { message: string }).message || "Une erreur est survenue.",
      });
    }
  } catch {
    toast.error("Erreur critique", {
      description: `Impossible de modifier la promotion #${levelId}.`,
    });
  } finally {
    isEdit.value = false;
  }
};

onMounted(fetchLevel);
</script>

<template>
  <div class="space-y-6">
    <!-- Bouton retour -->
    <GoBack back="/admin/level" />

    <!-- Loader -->
    <LoaderContainer v-if="isLoading" :isCard="true" />

    <!-- Promotion non trouvée -->
    <Card v-else-if="!level">
      <CardContent class="text-center py-12">
        <PencilLine class="h-12 w-12 mx-auto text-muted-foreground mb-4" />
        <p class="text-lg font-medium mb-2">Promotion non trouvée</p>
        <p class="text-muted-foreground">
          La promotion avec l'ID {{ levelId }} n'existe pas.
        </p>
      </CardContent>
    </Card>

    <!-- Formulaire d'édition -->
    <div v-else class="w-full">
      <Card>
        <CardHeader>
          <CardTitle class="flex items-center gap-2">
            <PencilLine class="h-5 w-5" />
            Éditer la promotion #{{ level.id }}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div class="max-w-2xl space-y-5">
            <ValidatorError :validator="validator" />
            <LevelForm :level="level" :onSubmit="onSubmit" />
          </div>
        </CardContent>
      </Card>
    </div>
  </div>
</template>
