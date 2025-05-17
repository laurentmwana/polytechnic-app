'use client'

import { Bell, Clock } from 'lucide-react'

import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Skeleton } from '@/components/ui/skeleton'
import { useNotification } from '@/hooks/use-notification'
import { ago } from '@/lib/date-time'

export const NotificationButton = () => {
  const { notifications, isPending } = useNotification()

  if (isPending) {
    return <Skeleton className="h-9 w-9 rounded-md" />
  }

  if (notifications.length === 0) {
    return null
  }

  const notificationCount = notifications.length

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="relative h-9 w-9 rounded-full p-0 transition-colors hover:bg-muted"
          aria-label={`${notificationCount} notifications non lues`}
        >
          <Bell className="h-5 w-5" />
          {notificationCount > 0 && (
            <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-destructive text-[10px] font-medium text-destructive-foreground shadow-sm ring-1 ring-white dark:ring-background">
              {notificationCount}
            </span>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80 p-0">
        <div className="flex items-center justify-between p-3 border-b">
          <p className="font-medium">Notifications</p>
        </div>

        {notifications.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-6 text-center">
            <Bell className="h-10 w-10 text-muted-foreground/50 mb-2" />
            <p className="text-sm font-medium">Aucune notification</p>
            <p className="text-xs text-muted-foreground mt-1">
              Vous n&#39;avez pas de notifications pour le moment
            </p>
          </div>
        ) : (
          <div className="max-h-[300px] overflow-y-auto py-1">
            {notifications.map((notification) => (
              <DropdownMenuItem
                key={notification.id}
                className="flex cursor-pointer flex-col items-start gap-1 p-3 focus:bg-accent"
              >
                <div className="flex w-full items-start justify-between gap-2">
                  <p className="text-sm">{notification.title}</p>
                </div>
                <div className="flex items-center text-xs text-muted-foreground">
                  <Clock className="mr-1 h-3 w-3" />
                  {ago(notification.created_at)}
                </div>
              </DropdownMenuItem>
            ))}
          </div>
        )}

        <DropdownMenuSeparator />
        <DropdownMenuItem className="cursor-pointer justify-center p-3 text-center text-sm font-medium text-primary hover:bg-accent">
          Voir toutes les notifications
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
