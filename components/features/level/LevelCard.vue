<script setup lang="ts">
import { excerpt } from "@/lib/utils";
import type { LevelModel } from "@/types/model";
import { ChevronRight } from "lucide-vue-next";

interface LevelCardProps {
  level: LevelModel;
}

const props = defineProps<LevelCardProps>();
</script>

<template>
  <Card>
    <CardHeader class="pb-2">
      <CardTitle class="text-lg">{{ excerpt(props.level.name, 80) }}</CardTitle>
    </CardHeader>
    <CardContent class="h-full"> </CardContent>
    <CardFooter class="pt-0">
      <Button variant="outline" size="sm" class="w-full" asChild>
        <NuxtLink :to="`/level/${level.id}`">
          En savoir plus
          <ChevronRight class="ml-1 h-4 w-4" />
        </NuxtLink>
      </Button>
    </CardFooter>
  </Card>
</template>
