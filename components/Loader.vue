<template>
  <div class="flex items-center justify-center" :class="containerClass">
    <!-- Spinner Loader -->
    <div
      v-if="type === 'spinner'"
      class="animate-spin rounded-full border-solid border-t-transparent"
      :class="[sizeClasses, colorClasses]"
    ></div>

    <!-- Dots Loader -->
    <div v-else-if="type === 'dots'" class="flex space-x-1">
      <div
        v-for="i in 3"
        :key="i"
        class="rounded-full animate-pulse"
        :class="[dotSizeClasses, colorClasses]"
        :style="{ animationDelay: `${(i - 1) * 0.2}s` }"
      ></div>
    </div>

    <!-- Pulse Loader -->
    <div
      v-else-if="type === 'pulse'"
      class="rounded-full animate-ping"
      :class="[sizeClasses, colorClasses]"
    ></div>

    <!-- Bars Loader -->
    <div v-else-if="type === 'bars'" class="flex space-x-1">
      <div
        v-for="i in 4"
        :key="i"
        class="animate-pulse"
        :class="[barClasses, colorClasses]"
        :style="{ animationDelay: `${(i - 1) * 0.15}s` }"
      ></div>
    </div>

    <!-- Text (optionnel) -->
    <span v-if="text" class="ml-3 text-sm font-medium" :class="textColorClass">
      {{ text }}
    </span>
  </div>
</template>

<script setup>
import { computed } from "vue";

// Props
const props = defineProps({
  type: {
    type: String,
    default: "spinner",
    validator: (value) => ["spinner", "dots", "pulse", "bars"].includes(value),
  },
  size: {
    type: String,
    default: "sm",
    validator: (value) => ["sm", "md", "lg", "xl"].includes(value),
  },
  color: {
    type: String,
    default: "white",
    validator: (value) =>
      ["primary", "secondary", "success", "warning", "error", "white"].includes(
        value
      ),
  },
  text: {
    type: String,
    default: "",
  },
  fullScreen: {
    type: Boolean,
    default: false,
  },
});

// Classes calculées
const containerClass = computed(() => {
  return props.fullScreen ? "fixed inset-0 bg-white bg-opacity-80 z-50" : "";
});

const sizeClasses = computed(() => {
  const sizes = {
    sm: "w-4 h-4 border-2",
    md: "w-6 h-6 border-2",
    lg: "w-8 h-8 border-3",
    xl: "w-12 h-12 border-4",
  };
  return sizes[props.size];
});

const dotSizeClasses = computed(() => {
  const sizes = {
    sm: "w-1 h-1",
    md: "w-2 h-2",
    lg: "w-3 h-3",
    xl: "w-4 h-4",
  };
  return sizes[props.size];
});

const barClasses = computed(() => {
  const sizes = {
    sm: "w-1 h-3",
    md: "w-1 h-4",
    lg: "w-1.5 h-6",
    xl: "w-2 h-8",
  };
  return sizes[props.size];
});

const colorClasses = computed(() => {
  const colors = {
    primary: "border-orange-500 bg-orange-500",
    secondary: "border-gray-500 bg-gray-500",
    success: "border-green-500 bg-green-500",
    warning: "border-yellow-500 bg-yellow-500",
    error: "border-red-500 bg-red-500",
    white: "border  bg-accent dark:bg-gray-50",
  };
  return colors[props.color];
});

const textColorClass = computed(() => {
  const colors = {
    primary: "text-orange-600",
    secondary: "text-gray-600",
    success: "text-green-600",
    warning: "text-yellow-600",
    error: "text-red-600",
    white: "text-white",
  };
  return colors[props.color];
});
</script>

<style scoped>
@keyframes pulse {
  0%,
  100% {
    opacity: 1;
    transform: scale(1);
  }
  50% {
    opacity: 0.5;
    transform: scale(0.8);
  }
}

.animate-pulse {
  animation: pulse 1.5s ease-in-out infinite;
}

@keyframes ping {
  75%,
  100% {
    transform: scale(2);
    opacity: 0;
  }
}

.animate-ping {
  animation: ping 1s cubic-bezier(0, 0, 0.2, 1) infinite;
}
</style>
