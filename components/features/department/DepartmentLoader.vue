<script setup lang="ts">
const props = withDefaults(defineProps<{ count?: number }>(), {
  count: 6,
});
</script>

<template>
  <div
    class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 justify-center items-centers"
  >
    <Card class="border" v-for="c in props.count" :key="c">
      <CardHeader class="pb-2">
        <div class="flex items-start gap-3">
          <Skeleton class="h-10 w-10 rounded-md" />
          <div class="space-y-2">
            <Skeleton class="h-5 w-32" />
            <Skeleton class="h-4 w-48" />
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div class="flex flex-wrap gap-1.5 mb-2">
          <Skeleton class="h-5 w-16" />
          <Skeleton class="h-5 w-20" />
          <Skeleton class="h-5 w-14" />
        </div>
        <Skeleton class="h-4 w-32" />
      </CardContent>
      <CardFooter class="pt-0">
        <Skeleton class="h-8 w-full" />
      </CardFooter>
    </Card>
  </div>
</template>
