<script setup lang="ts">
import { excerpt } from "@/lib/utils";
import type { DepartmentModel } from "@/types/model";
import { ChevronRight } from "lucide-vue-next";

interface DepartmentCardProps {
  department: DepartmentModel;
}

const props = defineProps<DepartmentCardProps>();
</script>

<template>
  <Card>
    <CardHeader class="pb-2">
      <CardTitle class="text-lg">{{
        excerpt(props.department.name, 80)
      }}</CardTitle>
    </CardHeader>
    <CardContent class="h-full">
      <div class="flex flex-wrap gap-3 mb-2">
        <Badge
          :key="level.id"
          variant="outline"
          class="text-xs"
          v-for="level in props.department.levels.slice(0, 3)"
        >
          {{ excerpt(level.name, 45) }}
        </Badge>

        <Badge
          variant="outline"
          class="text-xs"
          v-if="props.department.levels.length > 3"
        >
          +{{ props.department.levels.length - 3 }}
        </Badge>
      </div>
      <p class="text-sm text-muted-foreground">
        <span class="font-medium">{{ props.department.levels.length }}</span>
        promotions disponibles
      </p>
    </CardContent>
    <CardFooter class="pt-0">
      <Button variant="secondary" size="sm" class="w-full" asChild>
        <NuxtLink :to="`/department/${department.id}`">
          En savoir plus
          <ChevronRight class="ml-1 h-4 w-4" />
        </NuxtLink>
      </Button>
    </CardFooter>
  </Card>
</template>
