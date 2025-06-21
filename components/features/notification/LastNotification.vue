<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Bell } from 'lucide-vue-next'
import { getLastNotifications } from '~/services/other'
import type { NotificationModel } from '~/types/model'
import { ago } from '~/lib/date-time'
import { excerpt, getInitials } from '~/lib/utils'

const auth = useAuth()
const route = useRoute()

const isPending = ref<boolean>(true)
const notifications = ref<NotificationModel[]>([])
const countUnReadNotifications = ref<number>(0)

const fetchLastNotification = async () => {
  try {
    isPending.value = true

    if (!auth.session.value?.accessToken) {
      throw new Error("utilisateur non authentifié")
    }

    const response = await getLastNotifications(auth.session.value.accessToken)
    const data = await response.json()

    if (response.ok) {
      const dataResponse  = (data as { data: NotificationModel[], unread: number })
      notifications.value = dataResponse.data
      countUnReadNotifications.value = dataResponse.unread
    }
  } catch (error) {
    console.error("Impossible de charger les notifications", error)
  } finally {
    isPending.value = false
  }
}

onMounted(fetchLastNotification)
</script>

<template>
  <div>
    <DropdownMenu v-if="auth.session.value">
      <DropdownMenuTrigger as-child>
        <Button variant="outline" size="icon" class="relative">
          <Bell :size="15" />
          <span v-if="countUnReadNotifications.value > 0" class="absolute top-1 right-1 flex h-2 w-2">
            <span
              class="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-65"
            ></span>
            <span
              class="relative inline-flex rounded-full h-1 w-1 bg-primary"
            ></span>
          </span>
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent class="w-[380px]">
        <DropdownMenuLabel>Notifications</DropdownMenuLabel>
        <DropdownMenuSeparator />

        <DropdownMenuGroup>
          <div v-if="isPending" class="p-4 text-sm text-muted-foreground">
            Chargement...
          </div>
          <div v-else-if="notifications.length === 0" class="p-4 text-sm text-muted-foreground">
            Aucune notification
          </div>
          <DropdownMenuItem
            v-for="notification in notifications"
            :key="notification.id"
            class="flex flex-col items-start gap-1 cursor-pointer"
            as-child
          >
          <NuxtLink class="w-full h-full block" :href="`/notification/${notification.id}`">
            <div v-if="notification.read_at">
              <div class="flex items-start gap-3 p-2">
                <span class="relative flex shrink-0 overflow-hidden rounded-full h-8 w-8 ">
                  <span class="flex h-full w-full items-center justify-center rounded-full bg-indigo-100 text-indigo-500">
                    {{ getInitials(notification.data.title) }}
                  </span>
                </span>
                <div class="flex-1 text-sm">
                  <p>
                    {{  excerpt(notification.data.title, 30)  }}
                  </p>
                  <p class="text-xs text-muted-foreground mt-1">
                  {{  ago(notification.created_at)  }}
                  </p>
                </div>
              </div>
            </div>
            <div v-else>
              <div class="flex items-start gap-3 p-2">
                <span class="relative flex shrink-0 overflow-hidden rounded-full h-8 w-8 ">
                  <span class="flex h-full w-full items-center justify-center rounded-full bg-indigo-100 text-indigo-500">
                    {{ getInitials(notification.data.title) }}
                  </span>
                </span>
                <div class="flex-1 text-sm">
                  <p>
                    {{  excerpt(notification.data.title, 30)  }}
                  </p>
                  <p class="text-xs text-muted-foreground mt-1">
                  {{  ago(notification.created_at)  }}
                  </p>
                </div>
                <div class="h-2 w-2 rounded-full bg-indigo-500"></div>
              </div>
            </div>
          </NuxtLink>
          </DropdownMenuItem>
        </DropdownMenuGroup>

        <DropdownMenuSeparator v-if="route.path !== '/notification'" />
        <DropdownMenuGroup v-if="route.path !== '/notification'">
          <DropdownMenuItem class="bg-primary text-center p-2 flex items-center justify-center uppercase cursor-pointer" as-child>
            <NuxtLink href="/notification">Voir tout</NuxtLink>
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  </div>
</template>
