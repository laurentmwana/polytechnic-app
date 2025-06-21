<script setup lang="ts">
import JuryForm from "@/components/features/jury/JuryForm.vue";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/composables/useAuth";
import type { SchemaJuryFormInfer } from "@/definitions/jury";
import { editJury, getItemJury } from "@/services/jury";
import type { JuryModel } from "@/types/model";
import type { StateActionModel, ValidatorErrorProps } from "@/types/util";
import { User } from "lucide-vue-next";
import { toast } from "vue-sonner";

useHead({
  title: "Édition d'un jury - Polytechnic Application",
});

definePageMeta({
  layout: "admin",
  middleware: ["admin", "verified"],
});

interface ModelResponse {
  data: JuryModel;
}

const auth = useAuth();
const route = useRoute();
const router = useRouter();

const jury = ref<JuryModel | null>(null);
const isLoading = ref<boolean>(true);
const isEdit = ref<boolean>(false);
const validator = ref<ValidatorErrorProps | null>(null);

const juryId = parseInt(route.params.id as string);

if (!juryId || isNaN(juryId)) {
  throw createError({
    statusCode: 400,
    statusMessage: "L'ID du jury est requis et doit être un nombre valide",
  });
}

const fetchJury = async () => {
  try {
    isLoading.value = true;

    if (!auth.session.value?.accessToken) {
      throw new Error("Utilisateur non authentifié");
    }

    const response = await getItemJury(auth.session.value.accessToken, juryId);
    const data = await response.json();

    if (response.ok) {
      jury.value = (data as ModelResponse).data;
    } else if (response.status === 401) {
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
      description: "Impossible de charger le jury",
    });
  } finally {
    isLoading.value = false;
  }
};

const onSubmit = async (values: SchemaJuryFormInfer) => {
  try {
    isEdit.value = true;
    validator.value = null;

    if (!auth.session.value?.accessToken) {
      throw new Error("Utilisateur non authentifié");
    }

    const response = await editJury(
      auth.session.value.accessToken,
      juryId,
      values
    );
    const data = await response.json();

    if (response.ok) {
      const state = (data as StateActionModel).state;
      if (state) {
        toast.success("Édition", {
          description: `Les informations du jury #${juryId} ont été modifiées`,
        });

        router.push("/admin/jury");
      } else {
        toast.error("Édition", {
          description: `Nous n'avons pas pu effectuer cette action`,
        });
      }
    } else if (response.status === 422) {
      validator.value = data as ValidatorErrorProps;
    } else if (response.status === 401) {
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
      description: `Impossible d'éditer le jury #${juryId}`,
    });
  } finally {
    isEdit.value = false;
  }
};

onMounted(async () => {
  await fetchJury();
});
</script>

<template>
  <div class="space-y-6">
    <!-- Header avec bouton retour -->
    <GoBack back="/admin/jury" />

    <!-- Loader -->
    <LoaderContainer v-if="isLoading" :isCard="true" />

    <!-- Jury non trouvé -->
    <Card v-else-if="!jury">
      <CardContent class="text-center py-12">
        <User class="h-12 w-12 mx-auto text-muted-foreground mb-4" />
        <p class="text-lg font-medium mb-2">Jury non trouvé</p>
        <p class="text-muted-foreground">
          Le jury avec l'ID {{ juryId }} n'existe pas.
        </p>
      </CardContent>
    </Card>

    <div v-else class="w-full">
      <Card>
        <CardHeader>
          <CardTitle class="flex items-center gap-2">
            Éditer le jury #{{ jury.id }}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div class="max-w-2xl space-y-5">
            <ValidatorError :validator="validator" />
            <JuryForm :jury="jury" :onSubmit="onSubmit" />
          </div>
        </CardContent>
      </Card>
    </div>
  </div>
</template>
