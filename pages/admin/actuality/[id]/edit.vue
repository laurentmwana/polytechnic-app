<script setup lang="ts">
import ActualityForm from "@/components/features/actuality/ActualityForm.vue";

import type { SchemaActualityFormInfer } from "@/definitions/actuality";
import {
  editActuality,
  getItemActuality,
} from "@/services/actuality";
import type { ActualityModel } from "@/types/model";
import type { StateActionModel, ValidatorErrorProps } from "@/types/util";
import { toast } from "vue-sonner";
import LoaderContainer from "@/components/LoaderContainer.vue";
import { FileText } from "lucide-vue-next";

useHead({
  title: "Édition d'une actualité - Polytechnic Application",
});

definePageMeta({
  layout: "admin",
  middleware: ["admin", "verified"],
});

interface ModelResponse {
  data: ActualityModel;
}

const auth = useAuth();
const route = useRoute();
const router = useRouter();

const actuality = ref<ActualityModel | null>(null);
const isLoading = ref(true);
const isEdit = ref(false);
const validator = ref<ValidatorErrorProps | null>(null);

const actualityId = parseInt(route.params.id as string);

if (!actualityId || isNaN(actualityId)) {
  throw createError({
    statusCode: 400,
    statusMessage: "L'ID de l'actualité est requis et doit être un nombre valide",
  });
}

const fetchActuality = async () => {
  try {
    isLoading.value = true;

    const token = auth.session.value?.accessToken;
    if (!token) throw new Error("Utilisateur non authentifié");

    const response = await getItemActuality(token, actualityId);
    const data = await response.json();

    if (response.ok) {
      actuality.value = (data as ModelResponse).data;
    } else if (response.status === 401) {
      toast.warning("Session expirée", {
        description: "Votre session a expiré, merci de vous reconnecter.",
      });
      auth.logout();
    } else {
      toast.error("Erreur", {
        description: (data as { message: string }).message || "Une erreur est survenue",
      });
    }
  } catch {
    toast.error("Erreur", {
      description: "Impossible de charger l'actualité.",
    });
  } finally {
    isLoading.value = false;
  }
};

const onSubmit = async (values: SchemaActualityFormInfer) => {
  try {
    isEdit.value = true;
    validator.value = null;

    const token = auth.session.value?.accessToken;
    if (!token) throw new Error("Utilisateur non authentifié");

    const response = await editActuality(token, actualityId, values);
    const data = await response.json();

    if (response.ok) {
      const state = (data as StateActionModel).state;
      if (state) {
        toast.success("Édition réussie", {
          description: `L'actualité #${actualityId} a été mise à jour.`,
        });
        await router.push("/admin/actuality");
      } else {
        toast.error("Édition échouée", {
          description: "Nous n'avons pas pu effectuer cette action.",
        });
      }
    } else if (response.status === 422) {
      validator.value = data as ValidatorErrorProps;
    } else if (response.status === 401) {
      toast.warning("Session expirée", {
        description: "Votre session a expiré, merci de vous reconnecter.",
      });
      auth.logout();
    } else {
      toast.error("Erreur", {
        description: (data as { message: string }).message || "Une erreur est survenue.",
      });
    }
  } catch {
    toast.error("Erreur", {
      description: `Impossible d'éditer l'actualité #${actualityId}.`,
    });
  } finally {
    isEdit.value = false;
  }
};

onMounted(fetchActuality);
</script>

<template>
  <div class="space-y-6">
    <GoBack back="/admin/actuality" />

    <LoaderContainer v-if="isLoading" :isCard="true" />

    <Card v-else-if="!actuality">
      <CardContent class="text-center py-12">
        <FileText class="h-12 w-12 mx-auto text-muted-foreground mb-4" />
        <p class="text-lg font-medium mb-2">Actualité non trouvée</p>
        <p class="text-muted-foreground">
          L'actualité avec l'ID {{ actualityId }} n'existe pas.
        </p>
      </CardContent>
    </Card>

    <div v-else class="w-full max-w-2xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle class="flex items-center gap-2">
            Éditer l'actualité #{{ actuality.id }}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div class="space-y-5">
            <ValidatorError :validator="validator" />
            <ActualityForm
              :onSubmit="onSubmit"
              :actuality="actuality"
              :loading="isEdit"
            />
          </div>
        </CardContent>
      </Card>
    </div>
  </div>
</template>
