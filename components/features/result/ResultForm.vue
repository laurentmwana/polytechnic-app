<script setup lang="ts">
import { ref, computed } from "vue";
import { useForm } from "vee-validate";
import { toTypedSchema } from "@vee-validate/zod";
import { toast } from "vue-sonner";
import { Upload, File, X, Check, Loader } from "lucide-vue-next";
import { SchemaResultForm, type SchemaResultFormInfer } from "~/definitions/result";
import { getRouteApi } from "@/lib/route";
import type { DeliberationModel, ResultModel } from "@/types/model";
import { useFetch } from "#app"; // Declare the useFetch variable

// Props
const props = defineProps<{
  onSubmit: (values: SchemaResultFormInfer) => Promise<void>;
  result?: ResultModel;
}>();

// Chargement des délibérations
const { data: deliberations, pending: delibesPending } = useFetch<{
  data: DeliberationModel[];
}>(getRouteApi("&delibe", { year: 'no-closed' }));

// Etat du formulaire
const isPending = ref(false);

// État du fichier personnalisé
const selectedFile = ref<File | null>(null);
const isDragOver = ref(false);
const fileError = ref<string>("");

// Schéma de validation
const formSchema = toTypedSchema(SchemaResultForm);

// Formulaire
const form = useForm<SchemaResultFormInfer>({
  validationSchema: formSchema,
  initialValues: {
    deliberation_id: props.result?.deliberation?.id?.toString() ?? "",
    file: null,
  },
});

// Placeholder
const selectPlaceholder = computed(() => {
  if (delibesPending.value) return "Chargement...";
  return "Sélectionner une délibération";
});

// Validation du fichier
const validateFile = (file: File): boolean => {
  const allowedTypes = [
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'application/vnd.ms-excel'
  ];
  
  const maxSize = 10 * 1024 * 1024; // 10MB
  
  if (!allowedTypes.includes(file.type)) {
    fileError.value = "Seuls les fichiers Excel (.xlsx, .xls) sont acceptés";
    return false;
  }
  
  if (file.size > maxSize) {
    fileError.value = "Le fichier ne doit pas dépasser 10MB";
    return false;
  }
  
  fileError.value = "";
  return true;
};

// Gestion du fichier
const handleFileSelect = (event: Event) => {
  const target = event.target as HTMLInputElement;
  const file = target.files?.[0];
  
  if (file && validateFile(file)) {
    selectedFile.value = file;
    form.setFieldValue('file', file);
  } else {
    selectedFile.value = null;
    form.setFieldValue('file', null);
  }
};

// Gestion du glisser-déposer
const handleDragOver = (event: DragEvent) => {
  event.preventDefault();
  isDragOver.value = true;
};

const handleDragLeave = (event: DragEvent) => {
  event.preventDefault();
  isDragOver.value = false;
};

const handleDrop = (event: DragEvent) => {
  event.preventDefault();
  isDragOver.value = false;
  
  const files = event.dataTransfer?.files;
  const file = files?.[0];
  
  if (file && validateFile(file)) {
    selectedFile.value = file;
    form.setFieldValue('file', file);
  } else {
    selectedFile.value = null;
    form.setFieldValue('file', null);
  }
};

// Supprimer le fichier
const removeFile = () => {
  selectedFile.value = null;
  form.setFieldValue('file', null);
  fileError.value = "";
};

// Formatage de la taille du fichier
const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

// Soumission
const handleSubmit = form.handleSubmit(async (values) => {
  isPending.value = true;
  try {
    await props.onSubmit(values);
    form.reset({
      file: null,
      deliberation_id: "",
    });
    selectedFile.value = null;
  } catch (error) {
    console.error("Erreur formulaire :", error);
  } finally {
    isPending.value = false;
  }
});
</script>

<template>
  <form @submit.prevent="handleSubmit" class="space-y-7">
    <!-- Champ fichier personnalisé avec shadcn-vue -->
    <FormField name="file" v-slot="{ componentField, field, meta }">
      <FormItem>
        <FormLabel>Fichier</FormLabel>
        <FormControl>
          <!-- Zone de drop personnalisée -->
          <div
            @dragover="handleDragOver"
            @dragleave="handleDragLeave"
            @drop="handleDrop"
            :class="[
              'relative border-2 border-dashed rounded-lg p-6 transition-all duration-200 cursor-pointer',
              isDragOver 
                ? 'border-primary bg-primary/5' 
                : selectedFile 
                  ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-950/20 dark:border-indigo-400' 
                  : 'border-muted-foreground/25 hover:border-muted-foreground/50',
              isPending && 'opacity-50 cursor-not-allowed'
            ]"
          >
            <!-- Input caché -->
            <input
              type="file"
              accept=".xlsx,.xls"
              :name="field.name"
              v-bind="componentField"
              @change="handleFileSelect"
              :disabled="isPending"
              class="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
            />
            
            <!-- Contenu de la zone de drop -->
            <div v-if="!selectedFile" class="text-center">
              <Upload class="mx-auto h-12 w-12 text-muted-foreground mb-4" />
              <div class="text-sm text-muted-foreground">
                <span class="font-medium text-primary hover:text-primary/80">
                  Cliquez pour sélectionner
                </span>
                ou glissez-déposez votre fichier
              </div>
              <p class="text-xs text-muted-foreground mt-2">
                Formats acceptés: .xlsx, .xls (max 10MB)
              </p>
            </div>
            
            <!-- Fichier sélectionné -->
            <div v-else class="flex items-center justify-between">
              <div class="flex items-center space-x-3">
                <div class="flex-shrink-0">
                  <File class="h-8 w-8 text-indigo-500 dark:text-indigo-400" />
                </div>
                <div class="flex-1 min-w-0">
                  <p class="text-sm font-medium text-foreground truncate">
                    {{ selectedFile.name }}
                  </p>
                  <p class="text-xs text-muted-foreground">
                    {{ formatFileSize(selectedFile.size) }}
                  </p>
                </div>
              </div>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                @click="removeFile"
                :disabled="isPending"
                class="flex-shrink-0 h-8 w-8 p-0 text-destructive hover:text-destructive/80"
              >
                <X class="h-4 w-4" />
              </Button>
            </div>
            
            <!-- Icône de validation -->
            <div v-if="selectedFile && !fileError" class="absolute top-2 right-2">
              <Check class="h-5 w-5 text-indigo-500 dark:text-indigo-400" />
            </div>
          </div>
        </FormControl>
        
        <!-- Message d'erreur personnalisé -->
        <div v-if="fileError" class="text-sm text-destructive">
          {{ fileError }}
        </div>
        <FormMessage />
      </FormItem>
    </FormField>

    <!-- Champ délibération (inchangé) -->
    <FormField name="deliberation_id" v-slot="{ componentField }">
      <FormItem>
        <FormLabel>Délibération</FormLabel>
        <FormControl>
          <Select
            v-bind="componentField"
            :disabled="delibesPending || isPending"
          >
            <SelectTrigger class="w-full">
              <SelectValue :placeholder="selectPlaceholder" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup v-if="deliberations?.data?.length">
                <SelectLabel>Délibérations disponibles</SelectLabel>
                <SelectItem
                  v-for="delibe in deliberations.data"
                  :key="delibe.id"
                  :value="delibe.id.toString()"
                >
                  {{ delibe.level.alias }}
                  {{
                    delibe.level.department ? delibe.level.department.alias : ""
                  }}
                  {{ delibe.year.name }} {{ delibe.semester }}
                </SelectItem>
              </SelectGroup>
              <SelectGroup v-else-if="!delibesPending">
                <SelectLabel>Aucune délibération trouvée</SelectLabel>
              </SelectGroup>
            </SelectContent>
          </Select>
        </FormControl>
        <FormMessage />
      </FormItem>
    </FormField>

    <!-- Bouton de soumission (inchangé) -->
    <Button
      variant="secondary"
      type="submit"
      :disabled="isPending || delibesPending"
    >
      <template v-if="isPending">
        <Loader type="spinner" text="Chargement..." color="secondary" />
      </template>
      <template v-else>
        {{ props.result ? "Modifier" : "Créer" }}
      </template>
    </Button>
  </form>
</template>