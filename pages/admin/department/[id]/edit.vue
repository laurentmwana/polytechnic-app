<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useRoute, useRouter, useHead } from "#imports";

import DepartmentForm from "@/components/features/department/DepartmentForm.vue";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/composables/useAuth";
import type { SchemaDepartmentFormInfer } from "@/definitions/department";
import { editDepartment, getItemDepartment } from "@/services/department";
import type { DepartmentModel } from "@/types/model";
import type { StateActionModel, ValidatorErrorProps } from "@/types/util";
import { User } from "lucide-vue-next";
import { toast } from "vue-sonner";

useHead({
  title: "Édition d’un département - Polytechnic Application",
});

definePageMeta({
  layout: "admin",
  middleware: ["admin", "verified"],
});

interface ModelResponse {
  data: DepartmentModel;
}

const auth = useAuth();
const route = useRoute();
const router = useRouter();

const department = ref<DepartmentModel | null>(null);
const isLoading = ref(true);
const isEdit = ref(false);
const validator = ref<ValidatorErrorProps | null>(null);

// Récupération sécurisée de l'ID depuis l'URL
const departmentIdParam = route.params.id;
const departmentId = Number(departmentIdParam);

if (!departmentId || isNaN(departmentId)) {
  throw createError({
    statusCode: 400,
    statusMessage:
      "L’ID du département est requis et doit être un nombre valide",
  });
}

const fetchDepartment = async () => {
  try {
    isLoading.value = true;

    const token = auth.session.value?.accessToken;
    if (!token) throw new Error("Utilisateur non authentifié");

    const response = await getItemDepartment(token, departmentId);
    const data = await response.json();

    if (response.ok) {
      department.value = (data as ModelResponse).data;
    } else if (response.status === 401) {
      toast.warning("Session", {
        description: "Votre session a expiré, merci de vous reconnecter.",
      });
      auth.logout();
    } else {
      toast.error("Erreur", {
        description:
          (data as { message?: string }).message ?? "Une erreur est survenue.",
      });
    }
  } catch {
    toast.error("Erreur", {
      description: "Impossible de charger le département.",
    });
  } finally {
    isLoading.value = false;
  }
};

const onSubmit = async (values: SchemaDepartmentFormInfer) => {
  try {
    isEdit.value = true;
    validator.value = null;

    const token = auth.session.value?.accessToken;
    if (!token) throw new Error("Utilisateur non authentifié");

    const response = await editDepartment(token, departmentId, values);
    const data = await response.json();

    if (response.ok) {
      const state = (data as StateActionModel).state;

      if (state) {
        toast.success("Édition", {
          description: `Les informations du département #${departmentId} ont été modifiées.`,
        });
        router.push("/admin/department");
      } else {
        toast.error("Édition", {
          description: "Nous n’avons pas pu effectuer cette action.",
        });
      }
    } else if (response.status === 422) {
      validator.value = data as ValidatorErrorProps;
    } else if (response.status === 401) {
      toast.warning("Session", {
        description: "Votre session a expiré, merci de vous reconnecter.",
      });
      auth.logout();
    } else {
      toast.error("Erreur", {
        description:
          (data as { message?: string }).message ?? "Une erreur est survenue.",
      });
    }
  } catch {
    toast.error("Erreur", {
      description: `Impossible d’éditer le département #${departmentId}.`,
    });
  } finally {
    isEdit.value = false;
  }
};

onMounted(fetchDepartment);
</script>
<template>
  <div class="space-y-6">
    <!-- Header avec bouton retour -->
    <GoBack back="/admin/department" />

    <!-- Loader -->
    <LoaderContainer v-if="isLoading" :isCard="true" />

    <!-- Département non trouvé -->
    <Card v-else-if="!department">
      <CardContent class="text-center py-12">
        <User class="h-12 w-12 mx-auto text-muted-foreground mb-4" />
        <p class="text-lg font-medium mb-2">Département non trouvé</p>
        <p class="text-muted-foreground">
          Le département avec l’ID {{ departmentId }} n’existe pas.
        </p>
      </CardContent>
    </Card>

    <div v-else class="w-full">
      <Card>
        <CardHeader>
          <CardTitle class="flex items-center gap-2">
            Éditer le département #{{ department.id }}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div class="max-w-2xl space-y-5">
            <ValidatorError :validator="validator" />
            <DepartmentForm :department="department" :onSubmit="onSubmit" />
          </div>
        </CardContent>
      </Card>
    </div>
  </div>
</template>
