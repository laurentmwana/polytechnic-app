'use client'

import { useState } from 'react'
import { Bell, Clock } from 'lucide-react'

import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

type Notification = {
  id: string
  title: string
  time: string
  read: boolean
}

export const NotificationButton = () => {
  const [notificationCount, setNotificationCount] = useState(3)
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: '1',
      title: 'Nouvel événement ajouté',
      time: 'Il y a 5 min',
      read: false,
    },
    {
      id: '2',
      title: 'Rappel: Réunion à 14h',
      time: 'Il y a 30 min',
      read: false,
    },
    {
      id: '3',
      title: 'Mise à jour du système',
      time: 'Il y a 2 heures',
      read: false,
    },
  ])

  const markAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((notif) => (notif.id === id ? { ...notif, read: true } : notif))
    )
    setNotificationCount((prev) => Math.max(0, prev - 1))
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="relative">
          <Bell className="h-5 w-5" />
          {notificationCount > 0 && (
            <span className="absolute top-0 right-0 h-4 w-4 rounded-full bg-red-500 text-[10px] font-medium text-white flex items-center justify-center">
              {notificationCount}
            </span>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80">
        <div className="flex items-center justify-between p-2">
          <p className="font-medium">Notifications</p>
          <p className="text-xs text-muted-foreground">
            {notificationCount} non lues
          </p>
        </div>
        <DropdownMenuSeparator />

        {notifications.length === 0 ? (
          <div className="p-4 text-center text-sm text-muted-foreground">
            Aucune notification
          </div>
        ) : (
          <div className="max-h-[300px] overflow-y-auto space-y-2">
            {notifications.map((notification) => (
              <DropdownMenuItem
                key={notification.id}
                className={`flex flex-col items-start p-3  ${
                  notification.read ? 'opacity-70' : 'bg-muted/50'
                }`}
                onClick={() => markAsRead(notification.id)}
              >
                <div className="flex w-full justify-between">
                  <p className="font-medium">{notification.title}</p>
                  {!notification.read && (
                    <span className="h-2 w-2 rounded-full bg-red-500"></span>
                  )}
                </div>
                <div className="flex items-center text-xs text-muted-foreground mt-1">
                  <Clock className="mr-1 h-3 w-3" />
                  {notification.time}
                </div>
              </DropdownMenuItem>
            ))}
          </div>
        )}

        <DropdownMenuSeparator />
        <DropdownMenuItem className="p-2 justify-center font-medium text-sm cursor-pointer">
          Voir toutes les notifications
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
