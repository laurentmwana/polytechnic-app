<script setup lang="ts">
import { Calendar, Clock } from "lucide-vue-next";
</script>

<template>
  <div class="space-y-8">
    <Card>
      <CardHeader class="pb-3">
        <div class="flex items-center justify-between">
          <div>
            <div
              class="h-8 w-48 bg-gray-200 dark:bg-gray-700 rounded-md animate-pulse"
            ></div>

            <CardDescription class="mt-2 flex flex-wrap gap-2">
              <Badge
                variant="outline"
                class="bg-gray-200 dark:bg-gray-700 text-transparent animate-pulse"
              >
                Placeholder
              </Badge>
              <Badge
                variant="outline"
                class="bg-gray-200 dark:bg-gray-700 text-transparent animate-pulse"
              >
                Placeholder
              </Badge>
            </CardDescription>
          </div>
          <div class="flex gap-2">
            <div
              class="h-9 w-36 bg-gray-200 dark:bg-gray-700 rounded-md animate-pulse"
            ></div>
          </div>
        </div>
      </CardHeader>
      <CardContent class="space-y-6">
        <div>
          <div class="flex items-center gap-2 mb-3">
            <div
              class="h-5 w-5 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse"
            ></div>
            <div
              class="h-6 w-40 bg-gray-200 dark:bg-gray-700 rounded-md animate-pulse"
            ></div>
          </div>
          <div class="grid md:grid-cols-2 gap-4">
            <div class="border rounded-lg p-4">
              <div
                class="h-4 w-16 bg-gray-200 dark:bg-gray-700 rounded-md mb-1 animate-pulse"
              ></div>
              <div class="flex items-center gap-2">
                <Calendar class="h-4 w-4 text-gray-300 dark:text-gray-600" />
                <div
                  class="h-5 w-24 bg-gray-200 dark:bg-gray-700 rounded-md animate-pulse"
                ></div>
              </div>
            </div>
            <div class="border rounded-lg p-4">
              <div
                class="h-4 w-16 bg-gray-200 dark:bg-gray-700 rounded-md mb-1 animate-pulse"
              ></div>
              <div class="flex items-center gap-2">
                <Calendar class="h-4 w-4 text-gray-300 dark:text-gray-600" />
                <div
                  class="h-5 w-24 bg-gray-200 dark:bg-gray-700 rounded-md animate-pulse"
                ></div>
              </div>
            </div>
          </div>
        </div>

        <div>
          <div class="flex items-center gap-2 mb-3">
            <div
              class="h-5 w-5 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse"
            ></div>
            <div
              class="h-6 w-56 bg-gray-200 dark:bg-gray-700 rounded-md animate-pulse"
            ></div>
          </div>
          <div class="grid md:grid-cols-2 gap-4">
            <div class="border rounded-lg p-4">
              <div
                class="h-4 w-16 bg-gray-200 dark:bg-gray-700 rounded-md mb-1 animate-pulse"
              ></div>
              <div class="flex items-center gap-2">
                <div
                  class="h-4 w-4 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse"
                ></div>
                <div
                  class="h-5 w-28 bg-gray-200 dark:bg-gray-700 rounded-md animate-pulse"
                ></div>
              </div>
            </div>
            <div class="border rounded-lg p-4">
              <div
                class="h-4 w-32 bg-gray-200 dark:bg-gray-700 rounded-md mb-1 animate-pulse"
              ></div>
              <div class="flex items-center gap-2">
                <Clock class="h-4 w-4 text-gray-300 dark:text-gray-600" />
                <div
                  class="h-5 w-32 bg-gray-200 dark:bg-gray-700 rounded-md animate-pulse"
                ></div>
              </div>
            </div>
            <div class="border rounded-lg p-4">
              <div
                class="h-4 w-36 bg-gray-200 dark:bg-gray-700 rounded-md mb-1 animate-pulse"
              ></div>
              <div class="flex items-center gap-2">
                <Clock class="h-4 w-4 text-gray-300 dark:text-gray-600" />
                <div
                  class="h-5 w-32 bg-gray-200 dark:bg-gray-700 rounded-md animate-pulse"
                ></div>
              </div>
            </div>
            <div class="border rounded-lg p-4">
              <div
                class="h-4 w-24 bg-gray-200 dark:bg-gray-700 rounded-md mb-1 animate-pulse"
              ></div>
              <div
                class="h-5 w-16 bg-gray-200 dark:bg-gray-700 rounded-md animate-pulse"
              ></div>
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter class="border-t pt-6">
        <div
          class="h-4 w-full bg-gray-200 dark:bg-gray-700 rounded-md animate-pulse"
        ></div>
      </CardFooter>
    </Card>
  </div>
</template>
