<script setup lang="ts">
import { defineProps, withDefaults } from "vue";

interface AppLogoIconProps {
  className?: string;
  height?: number;
  width?: number;
}

const props = withDefaults(defineProps<AppLogoIconProps>(), {
  className: "",
  width: 40,
  height: 40,
});
</script>

<template>
  <img
    :width="props.width"
    :height="props.height"
    :class="props.className"
    src="/images/logo.svg"
    alt="logo du site"
  />
</template>
