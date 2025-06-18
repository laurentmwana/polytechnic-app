<script setup>
</script>
<template>
  <div class="flex min-h-svh flex-col items-center justify-center gap-6 p-4">
    <div class="flex w-full max-w-md flex-col gap-6">
      <NuxtLink
        href="/"
        class="flex items-center gap-2 self-center font-medium"
      >
        <Logo
          :width="45"
          :height="45"
          class="flex tems-center justify-center"
        />
      </NuxtLink>
      <div class="flex flex-col gap-6">
        <slot />
      </div>
    </div>
  </div>
</template>
