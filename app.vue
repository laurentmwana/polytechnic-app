<script>
import "vue-sonner/style.css";
</script>

<template>
  <div class="h-full">
    <NuxtLayout>
      <NuxtPage />
      <Toaster position="top-center" :expand="true" />
    </NuxtLayout>
  </div>
</template>

<!-- <style>
.page-enter-active,
.page-leave-active {
  transition: all 0.4s;
}
.page-enter-from,
.page-leave-to {
  opacity: 0;
  filter: blur(1rem);
}
</style> -->
