<template>
  <div>
    <!-- Zone de drop -->
    <div
      @drop="handleDrop"
      @dragover.prevent
      @dragenter.prevent
      @dragleave="isDragOver = false"
      @dragover="isDragOver = true"
      :class="[
        'border-2 border-dashed rounded-lg p-8 text-center transition-colors duration-200',
        isDragOver ? 'border-blue-400 bg-blue-50' : 'border-gray-300',
        isUploading ? 'opacity-50 pointer-events-none' : '',
      ]"
    >
      <div class="flex flex-col items-center space-y-4">
        <svg
          class="w-12 h-12 text-gray-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
          />
        </svg>

        <div>
          <p class="text-lg font-medium text-gray-700 mb-2">
            Glissez votre fichier Excel ici
          </p>
          <p class="text-sm text-gray-500 mb-4">ou cliquez pour sélectionner</p>

          <input
            ref="fileInput"
            type="file"
            accept=".xlsx,.xls"
            @change="handleFileSelect"
            class="hidden"
          />

          <Button
            size="sm"
            @click="$refs.fileInput.click()"
            :disabled="isUploading"
          >
            Choisir un fichier
          </Button>
        </div>
      </div>
    </div>

    <!-- Fichier sélectionné -->
    <div v-if="selectedFile" class="mt-4 p-4 bg-gray-50 rounded-lg">
      <div class="flex items-center justify-between">
        <div class="flex items-center space-x-3">
          <svg
            class="w-8 h-8 text-green-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
          <div>
            <p class="font-medium text-gray-800">{{ selectedFile.name }}</p>
            <p class="text-sm text-gray-500">
              {{ formatFileSize(selectedFile.size) }}
            </p>
          </div>
        </div>
        <button
          @click="removeFile"
          :disabled="isUploading"
          class="text-red-500 hover:text-red-700 disabled:opacity-50"
        >
          <svg
            class="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>
    </div>

    <!-- Messages d'erreur -->
    <div
      v-if="errorMessage"
      class="mt-4 p-3 bg-red-50 border border-red-200 rounded-md"
    >
      <div class="flex items-center">
        <svg
          class="w-5 h-5 text-red-400 mr-2"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        <p class="text-sm text-red-700">{{ errorMessage }}</p>
      </div>
    </div>

    <!-- Message de succès -->
    <div
      v-if="successMessage"
      class="mt-4 p-3 bg-green-50 border border-green-200 rounded-md"
    >
      <div class="flex items-center">
        <svg
          class="w-5 h-5 text-green-400 mr-2"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M5 13l4 4L19 7"
          />
        </svg>
        <p class="text-sm text-green-700">{{ successMessage }}</p>
      </div>
    </div>

    <!-- Barre de progression -->
    <div v-if="isUploading" class="mt-4">
      <div class="flex items-center justify-between mb-2">
        <span class="text-sm text-gray-600">Upload en cours...</span>
        <span class="text-sm text-gray-600">{{ uploadProgress }}%</span>
      </div>
      <div class="w-full bg-gray-200 rounded-full h-2">
        <div
          class="bg-blue-600 h-2 rounded-full transition-all duration-300"
          :style="{ width: uploadProgress + '%' }"
        ></div>
      </div>
    </div>

    <!-- Bouton d'upload -->
    <button
      v-if="selectedFile && !isUploading"
      @click="uploadFile"
      class="w-full mt-6 px-4 py-3 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors font-medium"
    >
      Uploader le fichier
    </button>

    <!-- Bouton d'upload en cours -->
    <button
      v-if="isUploading"
      disabled
      class="w-full mt-6 px-4 py-3 bg-gray-400 text-white rounded-md cursor-not-allowed font-medium flex items-center justify-center"
    >
      <svg
        class="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
        fill="none"
        viewBox="0 0 24 24"
      >
        <circle
          class="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          stroke-width="4"
        ></circle>
        <path
          class="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
        ></path>
      </svg>
      Upload en cours...
    </button>
  </div>
</template>

<script setup>
import { ref } from "vue";

// État réactif
const selectedFile = ref(null);
const isDragOver = ref(false);
const isUploading = ref(false);
const uploadProgress = ref(0);
const errorMessage = ref("");
const successMessage = ref("");

// Types de fichiers Excel acceptés
const acceptedTypes = [
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", // .xlsx
  "application/vnd.ms-excel", // .xls
];

// Émissions d'événements
const emit = defineEmits(["file-uploaded", "upload-error"]);

// Validation du fichier
const validateFile = (file) => {
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

// Gestion de la sélection de fichier
const handleFileSelect = (event) => {
  const file = event.target.files[0];
  if (file) {
    processFile(file);
  }
};

// Gestion du drag & drop
const handleDrop = (event) => {
  event.preventDefault();
  isDragOver.value = false;

  const files = event.dataTransfer.files;
  if (files.length > 0) {
    processFile(files[0]);
  }
};

// Traitement du fichier
const processFile = (file) => {
  clearMessages();

  const error = validateFile(file);
  if (error) {
    errorMessage.value = error;
    return;
  }

  selectedFile.value = file;
};

// Suppression du fichier
const removeFile = () => {
  selectedFile.value = null;
  clearMessages();
  // Reset input file
  const input = document.querySelector('input[type="file"]');
  if (input) input.value = "";
};

// Upload du fichier
const uploadFile = async () => {
  if (!selectedFile.value) return;

  isUploading.value = true;
  uploadProgress.value = 0;
  clearMessages();

  try {
    // Simulation de l'upload avec progression
    const formData = new FormData();
    formData.append("file", selectedFile.value);

    // Simulation de progression
    const progressInterval = setInterval(() => {
      if (uploadProgress.value < 90) {
        uploadProgress.value += Math.random() * 20;
      }
    }, 200);

    // Remplacez cette partie par votre logique d'upload réelle
    // Exemple avec fetch :
    /*
      const response = await fetch('/api/upload-excel', {
        method: 'POST',
        body: formData,
      })
      
      if (!response.ok) {
        throw new Error('Erreur lors de l\'upload')
      }
      
      const result = await response.json()
      */

    // Simulation d'un délai d'upload
    await new Promise((resolve) => setTimeout(resolve, 2000));

    clearInterval(progressInterval);
    uploadProgress.value = 100;

    // Simulation de succès
    successMessage.value = "Fichier uploadé avec succès !";

    // Émettre l'événement de succès
    emit("file-uploaded", {
      file: selectedFile.value,
      // result: result // données de réponse du serveur
    });

    // Reset après succès
    setTimeout(() => {
      removeFile();
      uploadProgress.value = 0;
    }, 2000);
  } catch (error) {
    console.error("Erreur upload:", error);
    errorMessage.value = "Erreur lors de l'upload du fichier";

    // Émettre l'événement d'erreur
    emit("upload-error", error);
  } finally {
    isUploading.value = false;
  }
};

// Formatage de la taille du fichier
const formatFileSize = (bytes) => {
  if (bytes === 0) return "0 Bytes";

  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
};

// Effacer les messages
const clearMessages = () => {
  errorMessage.value = "";
  successMessage.value = "";
};
</script>
