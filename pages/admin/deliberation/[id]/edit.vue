<script setup lang="ts">
import DeliberationForm from "@/components/features/delibe/DeliberationForm.vue";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/composables/useAuth";
import type { SchemaDeliberationFormInfer } from "@/definitions/deliberation";
import { editDeliberation, getItemDeliberation } from "@/services/deliberation";
import type { DeliberationModel } from "@/types/model";
import type { StateActionModel, ValidatorErrorProps } from "@/types/util";
import { User } from "lucide-vue-next";
import { toast } from "vue-sonner";

useHead({
  title: "Edition d'une délibération - Polytechnic Application",
});

definePageMeta({
  layout: "admin",
  middleware: ["admin"],
});

interface ModelResponse {
  data: DeliberationModel;
}

const auth = useAuth();
const route = useRoute();
const router = useRouter();

const deliberation = ref<DeliberationModel | null>(null);
const isLoading = ref<boolean>(true);
const isEdit = ref<boolean>(false);
const validator = ref<ValidatorErrorProps | null>(null);

const delibeId = parseInt(route.params.id as string);

if (!delibeId || isNaN(delibeId)) {
  throw createError({
    statusCode: 400,
    statusMessage:
      "L'ID de la délibération est requis et doit être un nombre valide",
  });
}

const fetchDeliberation = async () => {
  try {
    isLoading.value = true;

    if (!auth.session.value?.accessToken) {
      throw new Error("utilisateur non authentifié");
    }

    const response = await getItemDeliberation(
      auth.session.value.accessToken,
      delibeId
    );
    const data = await response.json();

    if (response.ok) {
      deliberation.value = (data as ModelResponse).data;
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
      description: "Impossible de charger la délibération",
    });
  } finally {
    isLoading.value = false;
  }
};

const onSubmit = async (values: SchemaDeliberationFormInfer) => {
  try {
    isEdit.value = true;
    validator.value = null;

    if (!auth.session.value?.accessToken) {
      throw new Error("Utilisateur non authentifié");
    }

    const response = await editDeliberation(
      auth.session.value.accessToken,
      delibeId,
      values
    );
    const data = await response.json();

    if (response.ok) {
      const state = (data as StateActionModel).state;
      if (state) {
        toast.success("Edition", {
          description: `les informations de la délibération ${delibeId} ont été modifiées`,
        });

        router.push("/admin/deliberation");
      } else {
        toast.error("Edition", {
          description: `Nous n'avons pas pu effectuer cette action`,
        });
      }
    } else if (response.status === 422) {
      validator.value = data as ValidatorErrorProps;
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
      description: `Impossible d'editer la délibération #${delibeId}`,
    });
  } finally {
    isEdit.value = false;
  }
};

onMounted(async () => {
  await fetchDeliberation();
});
</script>

<template>
  <div class="space-y-6">
    <!-- Header avec bouton retour -->
    <GoBack back="/admin/deliberation" />

    <!-- Loader -->
    <LoaderContainer v-if="isLoading" :isCard="true" />

    <!-- Utilisateur non trouvé -->
    <Card v-else-if="!deliberation">
      <CardContent class="text-center py-12">
        <User class="h-12 w-12 mx-auto text-muted-foreground mb-4" />
        <p class="text-lg font-medium mb-2">Délibération non trouvée</p>
        <p class="text-muted-foreground">
          La délibération avec l'ID {{ delibeId }} n'existe pas.
        </p>
      </CardContent>
    </Card>

    <div v-else class="w-full">
      <Card>
        <CardHeader>
          <CardTitle class="flex items-center gap-2">
            Editer la délibération #{{ deliberation.id }}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div class="max-w-2xl space-y-5">
            <ValidatorError :validator="validator" />
            <DeliberationForm :delibe="deliberation" :onSubmit="onSubmit" />
          </div>
        </CardContent>
      </Card>
    </div>
  </div>
</template>
