<script setup lang="ts">
import { ArrowLeft } from "lucide-vue-next";

const props = defineProps<{ back: string }>();

const router = useRouter();

const goBack = () => {
  router.push(props.back);
};
</script>

<template>
  <div class="flex items-center gap-4 mb-8">
    <Button variant="outline" size="sm" @click="goBack">
      <ArrowLeft class="h-4 w-4 mr-2" />
      Retour en arrière
    </Button>
  </div>
</template>
