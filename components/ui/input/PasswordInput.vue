<script setup lang="ts">
import { ref, computed, watch } from "vue";
import { Eye, EyeOff, Check, X } from "lucide-vue-next";
import { cn } from "~/lib/utils";

interface Props {
  modelValue?: string;
  id?: string;
  name?: string;
  placeholder?: string;
  disabled?: boolean;
  required?: boolean;
  autocomplete?: string;
  error?: string;
  inputClass?: string;
  showStrengthIndicator?: boolean;
  showCriteria?: boolean;
}

interface Emits {
  (e: "update:modelValue", value: string): void;
  (e: "input", value: string): void;
  (e: "blur", event: FocusEvent): void;
  (e: "focus", event: FocusEvent): void;
  (e: "keydown", event: KeyboardEvent): void;
  (e: "strength-change", strength: number): void;
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: "",
  placeholder: "Entrez votre mot de passe",
  autocomplete: "current-password",
  showStrengthIndicator: false,
  showCriteria: false,
});

const emit = defineEmits<Emits>();

const inputRef = ref<HTMLInputElement>();
const showPassword = ref(false);

const inputValue = computed({
  get: () => props.modelValue,
  set: (value: string) => emit("update:modelValue", value),
});

// Calcul des critères de validation
const criteria = computed(() => ({
  length: inputValue.value.length >= 8,
  uppercase: /[A-Z]/.test(inputValue.value),
  lowercase: /[a-z]/.test(inputValue.value),
  number: /\d/.test(inputValue.value),
  special: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(inputValue.value),
}));

const passwordStrength = computed(() => {
  if (!inputValue.value) return 0;

  let score = 0;
  const checks = Object.values(criteria.value);
  score = checks.filter(Boolean).length;

  // Bonus pour la longueur
  if (inputValue.value.length >= 12) score += 1;
  if (inputValue.value.length >= 16) score += 1;

  return Math.min(score, 6);
});

const strengthPercentage = computed(() => {
  return (passwordStrength.value / 6) * 100;
});

const strengthText = computed(() => {
  const strength = passwordStrength.value;
  if (strength === 0) return "Très faible";
  if (strength <= 2) return "Faible";
  if (strength <= 3) return "Moyen";
  if (strength <= 4) return "Fort";
  if (strength <= 5) return "Très fort";
  return "Excellent";
});

const strengthBarClass = computed(() => {
  const strength = passwordStrength.value;
  if (strength === 0) return "bg-red-500";
  if (strength <= 2) return "bg-red-500";
  if (strength <= 3) return "bg-yellow-500";
  if (strength <= 4) return "bg-blue-500";
  if (strength <= 5) return "bg-green-500";
  return "bg-green-600";
});

const strengthTextClass = computed(() => {
  const strength = passwordStrength.value;
  if (strength === 0) return "text-red-600 dark:text-red-400";
  if (strength <= 2) return "text-red-600 dark:text-red-400";
  if (strength <= 3) return "text-yellow-600 dark:text-yellow-400";
  if (strength <= 4) return "text-blue-600 dark:text-blue-400";
  if (strength <= 5) return "text-green-600 dark:text-green-400";
  return "text-green-700 dark:text-green-300";
});

const togglePasswordVisibility = () => {
  showPassword.value = !showPassword.value;

  // Garder le focus sur l'input
  if (inputRef.value) {
    inputRef.value.focus();
  }
};

const handleInput = (event: Event) => {
  const target = event.target as HTMLInputElement;
  emit("input", target.value);
};

const handleBlur = (event: FocusEvent) => {
  emit("blur", event);
};

const handleFocus = (event: FocusEvent) => {
  emit("focus", event);
};

const handleKeydown = (event: KeyboardEvent) => {
  // Toggle visibility avec Ctrl/Cmd + Shift + H
  if ((event.ctrlKey || event.metaKey) && event.shiftKey && event.key === "H") {
    event.preventDefault();
    togglePasswordVisibility();
  }

  emit("keydown", event);
};

// Émettre les changements de force
watch(passwordStrength, (newStrength) => {
  emit("strength-change", newStrength);
});

// Méthodes exposées
defineExpose({
  focus: () => inputRef.value?.focus(),
  blur: () => inputRef.value?.blur(),
  select: () => inputRef.value?.select(),
});
</script>

<template>
  <div class="relative">
    <input
      :id="id"
      ref="inputRef"
      v-model="inputValue"
      :type="showPassword ? 'text' : 'password'"
      :placeholder="placeholder"
      :disabled="disabled"
      :required="required"
      :autocomplete="autocomplete"
      :name="name"
      :class="
        cn(
          'file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input flex h-9 w-full min-w-0 rounded-md border bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm',
          'focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]',
          'aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive',
          error ? 'border-destructive' : '',
          'pr-10', // Espace pour le bouton
          inputClass
        )
      "
      :aria-invalid="!!error"
      @input="handleInput"
      @blur="handleBlur"
      @focus="handleFocus"
      @keydown="handleKeydown"
      spellcheck="false"
      data-form-type="password"
      data-lpignore="true"
      autocapitalize="off"
      autocorrect="off"
    />

    <button
      type="button"
      :disabled="disabled"
      class="absolute inset-y-0 right-0 flex items-center pr-3 text-muted-foreground hover:text-foreground focus:outline-none focus:text-foreground disabled:cursor-not-allowed disabled:opacity-50 transition-colors"
      @click="togglePasswordVisibility"
      :aria-label="
        showPassword ? 'Masquer le mot de passe' : 'Afficher le mot de passe'
      "
    >
      <Eye v-if="showPassword" class="h-4 w-4" />
      <EyeOff v-else class="h-4 w-4" />
    </button>

    <!-- Message d'erreur -->
    <p v-if="error" class="mt-1 text-xs text-destructive">
      {{ error }}
    </p>

    <!-- Indicateur de force du mot de passe -->
    <div v-if="showStrengthIndicator && inputValue" class="mt-2">
      <div class="flex items-center space-x-2">
        <div class="flex-1 bg-muted rounded-full h-1">
          <div
            class="h-1 rounded-full transition-all duration-300"
            :class="strengthBarClass"
            :style="{ width: strengthPercentage + '%' }"
          ></div>
        </div>
        <span class="text-xs font-medium" :class="strengthTextClass">
          {{ strengthText }}
        </span>
      </div>

      <!-- Critères de validation -->
      <div v-if="showCriteria" class="mt-2 space-y-1">
        <div class="flex items-center space-x-2 text-xs">
          <Check v-if="criteria.length" class="h-3 w-3 text-green-500" />
          <X v-else class="h-3 w-3 text-muted-foreground" />
          <span
            :class="
              criteria.length
                ? 'text-green-600 dark:text-green-400'
                : 'text-muted-foreground'
            "
          >
            Au moins 8 caractères
          </span>
        </div>

        <div class="flex items-center space-x-2 text-xs">
          <Check v-if="criteria.uppercase" class="h-3 w-3 text-green-500" />
          <X v-else class="h-3 w-3 text-muted-foreground" />
          <span
            :class="
              criteria.uppercase
                ? 'text-green-600 dark:text-green-400'
                : 'text-muted-foreground'
            "
          >
            Une majuscule
          </span>
        </div>

        <div class="flex items-center space-x-2 text-xs">
          <Check v-if="criteria.lowercase" class="h-3 w-3 text-green-500" />
          <X v-else class="h-3 w-3 text-muted-foreground" />
          <span
            :class="
              criteria.lowercase
                ? 'text-green-600 dark:text-green-400'
                : 'text-muted-foreground'
            "
          >
            Une minuscule
          </span>
        </div>

        <div class="flex items-center space-x-2 text-xs">
          <Check v-if="criteria.number" class="h-3 w-3 text-green-500" />
          <X v-else class="h-3 w-3 text-muted-foreground" />
          <span
            :class="
              criteria.number
                ? 'text-green-600 dark:text-green-400'
                : 'text-muted-foreground'
            "
          >
            Un chiffre
          </span>
        </div>

        <div class="flex items-center space-x-2 text-xs">
          <Check v-if="criteria.special" class="h-3 w-3 text-green-500" />
          <X v-else class="h-3 w-3 text-muted-foreground" />
          <span
            :class="
              criteria.special
                ? 'text-green-600 dark:text-green-400'
                : 'text-muted-foreground'
            "
          >
            Un caractère spécial
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Désactiver les suggestions de mot de passe du navigateur */
input[type="password"]::-ms-reveal,
input[type="password"]::-ms-clear {
  display: none;
}

input[type="password"]::-webkit-credentials-auto-fill-button {
  display: none !important;
  visibility: hidden;
  pointer-events: none;
  position: absolute;
  right: 0;
}

/* Désactiver l'auto-fill styling */
input:-webkit-autofill,
input:-webkit-autofill:hover,
input:-webkit-autofill:focus,
input:-webkit-autofill:active {
  -webkit-box-shadow: 0 0 0 30px hsl(var(--background)) inset !important;
  -webkit-text-fill-color: hsl(var(--foreground)) !important;
}
</style>
