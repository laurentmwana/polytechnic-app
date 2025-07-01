<script setup lang="ts">
import { ref, onMounted } from "vue";
import { Download } from "lucide-vue-next";
import type { ResultModel } from "~/types/model";
import { getAllResults, downloadFileResult } from "~/services/other";
import type { PaginatedResponse } from "~/types/paginate";
import { toast } from "vue-sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { excerpt } from "~/lib/utils";
import { ago } from "~/lib/date-time";
import { useAuth } from "~/composables/useAuth";
import { useRouter } from "vue-router";

useHead({
  title: "Mes résultats - Polytechnic Application",
});
definePageMeta({
  layout: "default",
  middleware: ["student", "verified"],
});

type ResultsResponseType = PaginatedResponse<ResultModel[]>;

const results = ref<ResultsResponseType>();
const isModalOpen = ref(false);
const selectedResult = ref<ResultModel | null>(null);
const isPending = ref(true);
const auth = useAuth();
const router = useRouter();

const fetchResults = async () => {
  try {
    if (!isPending.value) {
      isPending.value = true;
    }

    const token = auth.session.value?.accessToken;
    if (!token) {
      throw new Error("Utilisateur non authentifié");
    }

    const response = await getAllResults(token);
    const data = await response.json();

    if (response.ok) {
      results.value = data as ResultsResponseType;
    } else if (response.status === 401) {
      auth.logout();
      toast.warning("Session expirée", {
        description: "Votre session a expiré. Veuillez vous reconnecter.",
      });
      router.push("/auth/login");
    } else {
      toast.error("Erreur", {
        description:
          (data as { message: string }).message || "Une erreur est survenue",
      });
    }
  } catch (error) {
    toast.error("Erreur", {
      description: `Impossible de récupérer vos résultats`,
    });
  } finally {
    isPending.value = false;
  }
};

const openModal = (result: ResultModel) => {
  selectedResult.value = result;
  isModalOpen.value = true;
};

const closeModal = () => {
  isModalOpen.value = false;
  selectedResult.value = null;
};

const downloadResult = async (id: number) => {
  try {
    if (!isPending.value) {
      isPending.value = true;
    }

    const token = auth.session?.value?.accessToken;
    if (!token) {
      throw new Error("Utilisateur non authentifié");
    }

    const response = await downloadFileResult(token, id);

    if (response.ok) {
      const blob = await response.blob();

      const disposition = response.headers.get("Content-Disposition");
      let filename = "resultat.pdf";
      if (disposition && disposition.includes("filename=")) {
        const match = disposition.match(/filename="?([^"]+)"?/);
        if (match && match[1]) {
          filename = match[1];
        }
      }

      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);

      toast.success("Téléchargement réussi", {
        description: `Le fichier ${filename} a été téléchargé avec succès.`,
      });
    } else if (response.status === 401) {
      auth.logout();
      toast.warning("Session expirée", {
        description: "Votre session a expiré. Veuillez vous reconnecter.",
      });
      router.push("/auth/login");
    } else {
      const data = await response.json();
      toast.error("Erreur", {
        description:
          (data as { message: string }).message || "Une erreur est survenue",
      });
    }
  } catch (error) {
    console.error("Erreur lors du téléchargement:", error);
    toast.error("Erreur", {
      description: "Impossible de télécharger le fichier.",
    });
  } finally {
    isPending.value = false;
  }
};

onMounted(fetchResults);
</script>
<template>
  <div class="container py-12">
    <div class="section-page-header">
      <h2 class="section-page-title">Résultats de l'étudiant</h2>
      <p class="text-gray-600 mt-2">
        Consultez tous vos résultats et téléchargez vos relevés
      </p>
    </div>

    <LoaderContainer v-if="isPending" />

    <!-- Résultats trouvés -->
    <div v-else-if="results && results.data.length > 0" class="rounded-lg shadow-sm border">
      <div class="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Délibération</TableHead>
              <TableHead>Éligible</TableHead>
              <TableHead>Frais académique</TableHead>
              <TableHead>Frais labo</TableHead>
              <TableHead>Enrôlement</TableHead>
              <TableHead>Date</TableHead>
              <TableHead class="text-end">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow
              v-for="result in results.data"
              :key="result.id"
              @click="openModal(result)"
              class="cursor-pointer"
            >
              <TableCell>
                {{
                  excerpt(
                    `${result.deliberation.level.name} ${result.deliberation.year.name} [${result.deliberation.semester}]`
                  ) || "Délibération #" + result.deliberation.id
                }}
              </TableCell>
              <TableCell>
                <Badge :variant="result.is_eligible ? 'default' : 'outline'">
                  {{ result.is_eligible ? "Oui" : "Non" }}
                </Badge>
              </TableCell>
              <TableCell>
                <Badge :variant="result.is_paid_academic ? 'default' : 'outline'">
                  {{ result.is_paid_academic ? "Oui" : "Non" }}
                </Badge>
              </TableCell>
              <TableCell>
                <Badge :variant="result.is_paid_labo ? 'default' : 'outline'">
                  {{ result.is_paid_labo ? "Oui" : "Non" }}
                </Badge>
              </TableCell>
              <TableCell>
                <Badge :variant="result.is_enrolled ? 'default' : 'outline'">
                  {{ result.is_enrolled ? "Oui" : "Non" }}
                </Badge>
              </TableCell>
              <TableCell>
                {{ ago(result.created_at) }}
              </TableCell>
              <TableCell>
                <div class="flex justify-end">
                  <AlertDialog>
                    <AlertDialogTrigger as-child>
                      <Button variant="outline" size="sm" @click.stop>
                        <Download :size="15" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>
                          Télécharger ce résultat ?
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                          Le téléchargement commencera immédiatement.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Annuler</AlertDialogCancel>
                        <AlertDialogAction @click="downloadResult(result.id)">
                          Continuer
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>
    </div>

    <!-- Aucun résultat trouvé -->
    <div v-else class="mt-8 text-center text-gray-500">
      <p>Aucun résultat disponible pour le moment.</p>
    </div>
  </div>
</template>

