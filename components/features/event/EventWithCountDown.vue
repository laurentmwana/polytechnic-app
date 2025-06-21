<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import type { EventModel } from '@/types/EventModel'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'

const props = defineProps<{
  events: EventModel[]
}>()

const now = ref(new Date())
const interval = ref<number | null>(null)

// Trier les événements par date de début
const sortedEvents = computed(() =>
  props.events.slice().sort((a, b) => new Date(a.start_at).getTime() - new Date(b.start_at).getTime())
)

// Prochain événement
const nextEvent = computed(() => sortedEvents.value.find(event => new Date(event.start_at) > now.value))

const countdown = ref('')
const updateCountdown = () => {
  if (!nextEvent.value) return

  const eventTime = new Date(nextEvent.value.start_at).getTime()
  const currentTime = new Date().getTime()
  const diff = eventTime - currentTime

  if (diff <= 0) {
    countdown.value = 'En cours ou passé'
    clearInterval(interval.value!)
    return
  }

  const hours = Math.floor(diff / (1000 * 60 * 60))
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
  const seconds = Math.floor((diff % (1000 * 60)) / 1000)

  countdown.value = `${hours}h ${minutes}m ${seconds}s`
}

onMounted(() => {
  updateCountdown()
  interval.value = setInterval(() => {
    now.value = new Date()
    updateCountdown()
  }, 1000)
})

onUnmounted(() => {
  if (interval.value) clearInterval(interval.value)
})
</script>

<template>
  <div class="p-4 max-w-4xl mx-auto space-y-6">
    <!-- Countdown -->
    <Card class="bg-background text-foreground shadow-xl">
      <CardHeader>
        <CardTitle>Prochain événement</CardTitle>
        <CardDescription v-if="nextEvent">
          {{ nextEvent.title }} — commence dans :
        </CardDescription>
        <CardDescription v-else>
          Aucun événement à venir
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p v-if="nextEvent" class="text-2xl font-semibold text-primary">{{ countdown }}</p>
      </CardContent>
    </Card>

    <!-- Separator -->
    <Separator class="my-4" />

    <!-- Liste des événements -->
    <div class="grid sm:grid-cols-2 gap-4">
      <Card
        v-for="event in sortedEvents"
        :key="event.id"
        class="bg-muted text-muted-foreground hover:bg-background hover:text-foreground transition-colors"
      >
        <CardHeader>
          <CardTitle class="text-lg font-bold">{{ event.title }}</CardTitle>
          <CardDescription class="text-sm">{{ new Date(event.start_at).toLocaleString() }}</CardDescription>
        </CardHeader>
        <CardContent>
          <p class="text-sm line-clamp-3">{{ event.description }}</p>
          <div class="flex flex-wrap mt-2 gap-2">
            <span
              v-for="tag in event.tags"
              :key="tag"
              class="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full"
            >
              {{ tag }}
            </span>
          </div>
        </CardContent>
      </Card>
    </div>
  </div>
</template>
