<template>
  <div class="w-full">
    <!-- Zone de drop -->
    <div
      @drop="handleDrop"
      @dragover.prevent
      @dragenter.prevent="isDragOver = true"
      @dragleave="isDragOver = false"
      @dragover="isDragOver = true"
      :class="[
        'border-2 border-dashed rounded-lg p-8 text-center transition-colors duration-200',
        isDragOver ? 'border-primary bg-primary/5' : 'border-border',
        loading ? 'opacity-50 pointer-events-none' : 'cursor-pointer',
      ]"
    >
      <div class="flex flex-col items-center space-y-4">
        <UploadIcon class="w-12 h-12 text-muted-foreground" />

        <div>
          <p class="text-lg font-medium text-foreground mb-2">
            Glissez votre fichier Excel ici
          </p>
          <p class="text-sm text-muted-foreground mb-4">
            ou cliquez pour sélectionner
          </p>

          <input
            ref="fileInputRef"
            type="file"
            accept=".xlsx,.xls"
            @change="handleFileSelect"
            class="hidden"
          />

          <button
            @click="fileInputRef?.click()"
            :disabled="loading"
            class="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-9 px-4 py-2"
          >
            Choisir un fichier
          </button>
        </div>
      </div>
    </div>

    <!-- Fichier sélectionné -->
    <div
      v-if="selectedFile"
      class="mt-4 p-4 bg-muted/50 rounded-lg border border-border"
    >
      <div class="flex items-center justify-between">
        <div class="flex items-center space-x-3">
          <FileSpreadsheetIcon class="w-8 h-8 text-primary" />
          <div>
            <p class="font-medium text-foreground">{{ selectedFile.name }}</p>
            <p class="text-sm text-muted-foreground">
              {{ formatFileSize(selectedFile.size) }}
            </p>
          </div>
        </div>
        <button
          @click="removeFile"
          :disabled="loading"
          class="text-destructive hover:text-destructive/90 disabled:opacity-50 p-1 rounded-full hover:bg-muted"
        >
          <XIcon class="w-5 h-5" />
        </button>
      </div>
    </div>

    <!-- Messages d'erreur -->
    <div
      v-if="errorMessage"
      class="mt-4 p-3 bg-destructive/10 border border-destructive/20 rounded-md text-destructive flex items-center"
    >
      <AlertCircleIcon class="w-5 h-5 mr-2 flex-shrink-0" />
      <p class="text-sm">{{ errorMessage }}</p>
    </div>

    <!-- Message de succès -->
    <div
      v-if="successMessage"
      class="mt-4 p-3 bg-success/10 border border-success/20 rounded-md text-success flex items-center"
    >
      <CheckCircleIcon class="w-5 h-5 mr-2 flex-shrink-0" />
      <p class="text-sm">{{ successMessage }}</p>
    </div>

    <!-- Barre de progression -->
    <div v-if="loading && selectedFile" class="mt-4">
      <div class="flex items-center justify-between mb-2">
        <span class="text-sm text-muted-foreground"
          >Traitement en cours...</span
        >
      </div>
      <div class="w-full bg-muted rounded-full h-2">
        <div class="bg-primary h-2 rounded-full animate-pulse"></div>
      </div>
    </div>

    <!-- Bouton d'upload -->
    <button
      v-if="selectedFile && !loading"
      @click="handleUpload"
      class="w-full mt-6 inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-success text-success-foreground hover:bg-success/90 h-10 px-4 py-2"
    >
      Traiter le fichier
    </button>

    <!-- Bouton en cours de traitement -->
    <button
      v-if="loading && selectedFile"
      disabled
      class="w-full mt-6 inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-muted text-muted-foreground h-10 px-4 py-2"
    >
      <LoaderIcon class="animate-spin mr-2 h-4 w-4" />
      Traitement en cours...
    </button>
  </div>
</template>

<script setup lang="ts">
import {
  AlertCircleIcon,
  CheckCircleIcon,
  FileSpreadsheetIcon,
  LoaderIcon,
  UploadIcon,
  XIcon,
} from "lucide-vue-next";
import { defineEmits, defineProps, ref } from "vue";

// Props
const props = defineProps<{
  onFile: (file: File) => Promise<void>;
  loading?: boolean;
}>();

// Émissions
const emit = defineEmits<{
  (e: "file-selected", file: File): void;
  (e: "file-removed"): void;
  (e: "error", message: string): void;
}>();

// État réactif local
const selectedFile = ref<File | null>(null);
const isDragOver = ref(false);
const errorMessage = ref("");
const successMessage = ref("");
const fileInputRef = ref<HTMLInputElement | null>(null);

// Types de fichiers Excel acceptés
const acceptedTypes = [
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", // .xlsx
  "application/vnd.ms-excel", // .xls
];

// Validation du fichier
const validateFile = (file: File): string | null => {
  // Vérifier le type de fichier
  if (!acceptedTypes.includes(file.type)) {
    return "Veuillez sélectionner un fichier Excel (.xlsx ou .xls)";
  }

  // Vérifier la taille (max 10MB)
  const maxSize = 10 * 1024 * 1024; // 10MB
  if (file.size > maxSize) {
    return "Le fichier est trop volumineux (max 10MB)";
  }

  return null;
};

// Formatage de la taille du fichier
const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return "0 Bytes";

  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
};

// Effacer les messages
const clearMessages = (): void => {
  errorMessage.value = "";
  successMessage.value = "";
};

// Traitement du fichier
const processFile = (file: File): void => {
  clearMessages();

  const error = validateFile(file);
  if (error) {
    errorMessage.value = error;
    emit("error", error);
    return;
  }

  selectedFile.value = file;
  emit("file-selected", file);
};

// Gestion de la sélection de fichier
const handleFileSelect = (event: Event): void => {
  const input = event.target as HTMLInputElement;
  const file = input.files?.[0];
  if (file) {
    processFile(file);
  }
};

// Gestion du drag & drop
const handleDrop = (event: DragEvent): void => {
  event.preventDefault();
  isDragOver.value = false;

  const files = event.dataTransfer?.files;
  if (files && files.length > 0) {
    processFile(files[0]);
  }
};

// Suppression du fichier
const removeFile = (): void => {
  selectedFile.value = null;
  clearMessages();
  emit("file-removed");

  // Reset input file
  if (fileInputRef.value) {
    fileInputRef.value.value = "";
  }
};

// Gestion de l'upload - appelle la fonction du parent
const handleUpload = async (): Promise<void> => {
  if (!selectedFile.value) return;

  clearMessages();

  try {
    // Appeler la fonction onFile passée par le parent
    await props.onFile(selectedFile.value);

    successMessage.value = "Fichier traité avec succès !";

    // Reset après succès
    setTimeout(() => {
      removeFile();
    }, 2000);
  } catch (error) {
    console.error("Erreur lors du traitement:", error);
    const errorMsg =
      error instanceof Error
        ? error.message
        : "Erreur lors du traitement du fichier";
    errorMessage.value = errorMsg;
    emit("error", errorMsg);
  }
};
</script>
