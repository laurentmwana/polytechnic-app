<script setup lang="ts">
import { defineProps, withDefaults } from "vue";
import { cn } from "../lib/utils";

interface TextLinkProps {
  className?: string;
  href?: string;
}

const props = withDefaults(defineProps<TextLinkProps>(), {
  className: "",
  href: "",
});
</script>

<template>
  <NuxtLink
    :href="props.href"
    :class="
      cn(
        'text-foreground underline decoration-neutral-300 underline-offset-4 transition-colors duration-300 ease-out hover:decoration-current! dark:decoration-neutral-500',
        props.className
      )
    "
  >
    <slot />
  </NuxtLink>
</template>
