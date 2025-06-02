<script setup lang="ts">
import { excerpt } from "@/lib/utils";
import type { OptionModel } from "@/types/model";

interface OptionCardProps {
  option: OptionModel;
}

const props = defineProps<OptionCardProps>();
</script>

<template>
  <Card>
    <CardHeader class="pb-2">
      <CardTitle class="text-lg">{{
        excerpt(props.option.name, 80)
      }}</CardTitle>
    </CardHeader>
    <CardContent class="h-full">
      <div class="flex flex-wrap gap-3 mb-2">
        <Badge
          :key="option.id"
          variant="outline"
          class="text-xs"
          v-for="level in props.option.levels.slice(0, 3)"
        >
          {{ excerpt(level.name + " " + `[level.alias]`, 45) }}
        </Badge>

        <Badge
          variant="outline"
          class="text-xs"
          v-if="props.option.levels.length > 3"
        >
          +{{ props.option.levels.length - 3 }}
        </Badge>
      </div>
      <p class="text-sm text-muted-foreground">
        <span class="font-medium">{{ props.option.levels.length }}</span>
        promotions disponibles
      </p>
    </CardContent>
    <CardFooter class="pt-0">
      <Button variant="outline" size="sm" class="w-full" asChild>
        <NuxtLink :to="`/option/${option.id}`">
          En savoir plus
          <ChevronRight class="ml-1 h-4 w-4" />
        </NuxtLink>
      </Button>
    </CardFooter>
  </Card>
</template>
