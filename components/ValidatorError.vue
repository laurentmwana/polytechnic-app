<script setup lang="ts">
import { defineProps } from "vue";
import type { ValidatorErrorProps } from "../types/util";

defineProps<{ validator: ValidatorErrorProps | null }>();
</script>
<template>
  <div v-if="validator">
    <Alert>
      <AlertTitle>
        {{ validator.message }}
      </AlertTitle>
      <AlertDescription>
        <ul class="list-disc list-inside space-y-1 text-sm text-red-600">
          <li
            v-for="(messages, field) in validator.errors"
            :key="field"
            class="font-medium"
          >
            {{ field }} : {{ messages[0] }}
          </li>
        </ul>
      </AlertDescription>
    </Alert>
  </div>
</template>
