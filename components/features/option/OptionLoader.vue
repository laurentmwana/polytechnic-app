<script setup lang="ts">
const props = withDefaults(defineProps<{ count?: number }>(), {
  count: 6,
});
</script>
<template>
  <div
    class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 justify-center"
  >
    <Card class="w-full" v-for="c in props.count" :key="c">
      <CardHeader>
        <div class="flex justify-between items-center">
          <Skeleton class="h-6 w-3/4" />
          <Skeleton class="h-5 w-16 rounded-full" />
        </div>
        <Skeleton class="h-4 w-full mt-2" />
        <Skeleton class="h-4 w-2/3 mt-1" />
      </CardHeader>
      <CardContent>
        <div class="flex gap-2">
          <Skeleton class="h-6 w-20 rounded-full" />
          <Skeleton class="h-6 w-20 rounded-full" />
          <Skeleton class="h-6 w-20 rounded-full" />
        </div>
      </CardContent>
      <CardFooter class="flex justify-between">
        <Skeleton class="h-8 w-24" />
        <Skeleton class="h-8 w-24" />
      </CardFooter>
    </Card>
  </div>
</template>
