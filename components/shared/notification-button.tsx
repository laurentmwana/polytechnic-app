"use client"

import { useState } from "react"
import { Bell, Clock, CheckCircle } from "lucide-react"
import { useSession } from "next-auth/react"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Skeleton } from "@/components/ui/skeleton"
import { cn } from "@/lib/utils"

type Notification = {
  id: string
  title: string
  time: string
  read: boolean
}

export const NotificationButton = () => {
  const { status } = useSession()

  const [notificationCount, setNotificationCount] = useState(3)
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: "1",
      title: "Nouvel événement ajouté",
      time: "Il y a 5 min",
      read: false,
    },
    {
      id: "2",
      title: "Rappel: Réunion à 14h",
      time: "Il y a 30 min",
      read: false,
    },
    {
      id: "3",
      title: "Mise à jour du système",
      time: "Il y a 2 heures",
      read: false,
    },
  ])

  // Afficher un skeleton loader pendant le chargement
  if (status === "loading") {
    return <Skeleton className="h-9 w-9 rounded-md" />
  }

  // Ne rien afficher si l'utilisateur n'est pas connecté
  if (status === "unauthenticated") {
    return null
  }

  const markAsRead = (id: string) => {
    setNotifications((prev) => prev.map((notif) => (notif.id === id ? { ...notif, read: true } : notif)))
    setNotificationCount((prev) => Math.max(0, prev - 1))
  }

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((notif) => ({ ...notif, read: true })))
    setNotificationCount(0)
  }

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
          {notificationCount > 0 && (
            <Button variant="ghost" size="sm" className="h-8 text-xs hover:bg-muted" onClick={markAllAsRead}>
              <CheckCircle className="mr-1 h-3 w-3" />
              Tout marquer comme lu
            </Button>
          )}
        </div>

        {notifications.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-6 text-center">
            <Bell className="h-10 w-10 text-muted-foreground/50 mb-2" />
            <p className="text-sm font-medium">Aucune notification</p>
            <p className="text-xs text-muted-foreground mt-1">Vous n'avez pas de notifications pour le moment</p>
          </div>
        ) : (
          <div className="max-h-[300px] overflow-y-auto py-1">
            {notifications.map((notification) => (
              <DropdownMenuItem
                key={notification.id}
                className={cn(
                  "flex cursor-pointer flex-col items-start gap-1 p-3 focus:bg-accent",
                  notification.read ? "opacity-70" : "",
                )}
                onClick={() => markAsRead(notification.id)}
              >
                <div className="flex w-full items-start justify-between gap-2">
                  <p className={cn("text-sm", !notification.read && "font-medium")}>{notification.title}</p>
                  {!notification.read && <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-destructive"></span>}
                </div>
                <div className="flex items-center text-xs text-muted-foreground">
                  <Clock className="mr-1 h-3 w-3" />
                  {notification.time}
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
