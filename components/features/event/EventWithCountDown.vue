<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import type { EventModel } from '@/types/model'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'

const props = defineProps<{
  eventData?: EventModel | null
}>()

let interval: ReturnType<typeof setInterval> | null = null
const countdown = ref('')

const updateCountdown = () => {
  if (!props.eventData) return

  const eventTime = new Date(props.eventData.start_at).getTime()
  const currentTime = Date.now()
  const diff = eventTime - currentTime

  if (diff <= 0) {
    countdown.value = 'En cours ou passé'
    if (interval) {
      clearInterval(interval)
      interval = null
    }
    return
  }

  const hours = Math.floor(diff / (1000 * 60 * 60))
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
  const seconds = Math.floor((diff % (1000 * 60)) / 1000)

  countdown.value = `${hours}h ${minutes}m ${seconds}s`
}

onMounted(() => {
  updateCountdown()
  interval = setInterval(() => {
    updateCountdown()
  }, 1000)
})

onUnmounted(() => {
  if (interval) clearInterval(interval)
})
</script>

<template>
  <div class="p-4 max-w-4xl mx-auto space-y-6">
    <!-- Countdown -->
    <Card class="bg-background text-foreground shadow-xl">
      <CardHeader>
        <CardTitle>Prochain événement</CardTitle>
        <CardDescription v-if="props.eventData">
          {{ props.eventData.title }} — commence dans :
        </CardDescription>
        <CardDescription v-else>
          Aucun événement à venir
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p v-if="props.eventData" class="text-2xl font-semibold text-primary">{{ countdown }}</p>
      </CardContent>
    </Card>

    <!-- Separator -->
    <Separator class="my-4" />
  </div>
</template>
