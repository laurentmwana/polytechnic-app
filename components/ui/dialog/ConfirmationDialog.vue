<script setup lang="ts">
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { AlertTriangle, CheckCircle, Info, XCircle } from "lucide-vue-next";
import { computed } from "vue";

interface Props {
  open?: boolean;
  title?: string;
  description?: string;
  confirmText?: string;
  cancelText?: string;
  variant?: "default" | "destructive" | "warning" | "info";
  loading?: boolean;
}

interface Emits {
  (e: "update:open", value: boolean): void;
  (e: "confirm"): void;
  (e: "cancel"): void;
}

const props = withDefaults(defineProps<Props>(), {
  open: false,
  title: "Êtes-vous sûr ?",
  description: "Cette action ne peut pas être annulée.",
  confirmText: "Confirmer",
  cancelText: "Annuler",
  variant: "default",
  loading: false,
});

const emit = defineEmits<Emits>();

const isOpen = computed({
  get: () => props.open,
  set: (value: boolean) => emit("update:open", value),
});

const handleConfirm = () => {
  emit("confirm");
};

const handleCancel = () => {
  emit("cancel");
  isOpen.value = false;
};

const getIcon = () => {
  switch (props.variant) {
    case "destructive":
      return XCircle;
    case "warning":
      return AlertTriangle;
    case "info":
      return Info;
    default:
      return CheckCircle;
  }
};

const getIconColor = () => {
  switch (props.variant) {
    case "destructive":
      return "text-destructive";
    case "warning":
      return "text-yellow-500";
    case "info":
      return "text-blue-500";
    default:
      return "text-green-500";
  }
};

const getConfirmButtonVariant = () => {
  switch (props.variant) {
    case "destructive":
      return "destructive";
    case "warning":
      return "destructive";
    default:
      return "default";
  }
};
</script>

<template>
  <Dialog v-model:open="isOpen">
    <DialogContent class="sm:max-w-[425px]">
      <DialogHeader>
        <div class="flex items-center gap-3">
          <component :is="getIcon()" :class="['h-6 w-6', getIconColor()]" />
          <DialogTitle>{{ title }}</DialogTitle>
        </div>
        <DialogDescription class="mt-2">
          {{ description }}
        </DialogDescription>
      </DialogHeader>

      <DialogFooter class="gap-2">
        <Button variant="outline" @click="handleCancel" :disabled="loading">
          {{ cancelText }}
        </Button>
        <Button
          :variant="getConfirmButtonVariant()"
          @click="handleConfirm"
          :disabled="loading"
        >
          <span v-if="loading" class="mr-2">
            <svg class="animate-spin h-4 w-4" viewBox="0 0 24 24">
              <circle
                class="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                stroke-width="4"
                fill="none"
              />
              <path
                class="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
          </span>
          {{ confirmText }}
        </Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
</template>
