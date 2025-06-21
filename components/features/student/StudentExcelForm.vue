<template>
  <div>
    <ExcelUploader
      :on-file="handleFileProcess"
      :loading="isProcessing"
      @file-selected="onFileSelected"
      @file-removed="onFileRemoved"
      @error="onError"
    />

    <!-- Affichage des résultats -->
    <div v-if="processedData" class="mt-8 p-4 bg-muted/20 rounded-lg">
      <h3 class="font-medium mb-2">Résultats du traitement</h3>
      <pre class="text-sm">{{ JSON.stringify(processedData, null, 2) }}</pre>
    </div>
  </div>
</template>

<script setup lang="ts">
import ExcelUploader from "@/components/ui/file/ExcelUploader.vue";
import { ref } from "vue";
import { toast } from "vue-sonner";

const props = defineProps<{
  onSubmit: (file: File) => Promise<void>;
}>();

const isProcessing = ref(false);
const processedData = ref<Record<string, any> | null>(null);

// Fonction de traitement du fichier
const handleFileProcess = async (file: File): Promise<void> => {
  isProcessing.value = true;

  try {
    await props.onSubmit(file);

    // Simuler des données traitées
    processedData.value = {
      fileName: file.name,
      fileSize: file.size,
      processedAt: new Date().toISOString(),
      rows: 150,
      columns: 8,
    };
  } catch (error) {
    console.error("Erreur lors du traitement du fichier :", error);
    toast.error("Erreur lors du traitement du fichier");
    throw error; // Relance pour que le composant enfant puisse l'afficher aussi
  } finally {
    isProcessing.value = false;
  }
};

// Gestionnaires d'événements
const onFileSelected = (file: File) => {
  console.log("Fichier sélectionné :", file.name);
  processedData.value = null; // Réinitialise les résultats précédents
};

const onFileRemoved = () => {
  console.log("Fichier supprimé");
  processedData.value = null;
};

const onError = (message: string) => {
  console.error("Erreur du composant ExcelUploader :", message);
  toast.error(message);
};
</script>
