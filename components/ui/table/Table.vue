<script setup lang="ts">
import type { HTMLAttributes } from 'vue'
import { cn } from '@/lib/utils'

const props = defineProps<{
  class?: HTMLAttributes['class']
}>()

const setDataLabels = () => {
  document.querySelectorAll("table[responsive-table]").forEach((table) => {
    const labels = Array.from(table.querySelectorAll("th")).map((th) =>
      th.textContent?.trim() ?? ""
    )
    table.querySelectorAll("tbody tr").forEach((tr) => {
      tr.querySelectorAll("td").forEach((td, index) => {
        td.setAttribute("data-label", labels[index % labels.length])
      })
    })
  })
}

onMounted(() => {
  setDataLabels()
})
</script>

<template>
  <div data-slot="table-container" class="relative w-full overflow-auto">
    <table  data-slot="table" :class="cn('w-full caption-bottom text-sm', props.class)" responsive-table>
      <slot />
    </table>
  </div>
</template>
