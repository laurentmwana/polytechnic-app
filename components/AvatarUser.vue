<script setup lang="ts">
import {
  BadgeDollarSign,
  FolderArchive,
  ListEnd,
  LogOut,
  User2,
} from "lucide-vue-next";
import { deleteUserLocal } from "~/services/session";
import { getInitials } from "../lib/utils";
import { Skeleton } from "./ui/skeleton";

const router = useRouter();
const auth = useAuth();

const onLogout = () => {
  deleteUserLocal();
  router.replace("/auth/login");
};
</script>

<template>
  <Skeleton v-if="auth.isPending.value" class="h-9 w-9 rounded-full" />
  <div v-else>
    <DropdownMenu v-if="auth.session.value && auth.isAuthenticated">
      <DropdownMenuTrigger asChild>
        <Button variant="outline" class="relative h-9 w-9 rounded-full p-0">
          <Avatar
            class="h-9 w-9 cursor-pointer transition-opacity hover:opacity-80"
          >
            <AvatarFallback class="bg-primary/10 text-primary">
              {{ getInitials(auth.session.value.name) }}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" class="w-64 p-2">
        <div class="flex items-center justify-start gap-3 p-2">
          <Avatar class="h-10 w-10">
            <AvatarFallback class="bg-primary/10 text-primary">
              {{ getInitials(auth.session.value.name) }}
            </AvatarFallback>
          </Avatar>
          <div class="flex flex-col space-y-0.5 leading-none">
            <p class="font-medium text-sm">{{ auth.session.value.name }}</p>
            <p class="text-xs text-muted-foreground">
              {{ auth.session.value.email }}
            </p>
          </div>
        </div>

        <DropdownMenuSeparator />

        <DropdownMenuItem
          class="flex cursor-pointer items-center gap-2 rounded-md p-2 hover:bg-accent"
          asChild
        >
          <NuxtLink href="/profile" class="flex items-center gap-2">
            <User2 class="h-4 w-4 text-muted-foreground" />
            <span>Mon profil</span>
          </NuxtLink>
        </DropdownMenuItem>
        <DropdownMenuItem v-if="auth.isAdmin.value" asChild>
          <NuxtLink
            href="/dashboard"
            class="flex cursor-pointer items-center gap-2 rounded-md p-2 hover:bg-accent"
          >
            <ListEnd class="h-4 w-4 text-muted-foreground" />
            <span>Tableau de bord</span>
          </NuxtLink>
        </DropdownMenuItem>

        <DropdownMenuItem v-if="auth.isStudent.value" asChild>
          <NuxtLink
            href="/folder"
            class="flex cursor-pointer items-center gap-2 rounded-md p-2 hover:bg-accent"
          >
            <FolderArchive class="h-4 w-4 text-muted-foreground" />
            <span>Mon dossier</span>
          </NuxtLink>
        </DropdownMenuItem>

        <DropdownMenuItem v-if="auth.isStudent.value" asChild>
          <NuxtLink
            href="/result"
            class="flex cursor-pointer items-center gap-2 rounded-md p-2 hover:bg-accent"
          >
            <ListEnd class="h-4 w-4 text-muted-foreground" />
            <span>Mes résultats</span>
          </NuxtLink>
        </DropdownMenuItem>

        <DropdownMenuItem v-if="auth.isStudent.value" asChild>
          <NuxtLink
            href="/paid"
            class="flex cursor-pointer items-center gap-2 rounded-md p-2 hover:bg-accent"
          >
            <BadgeDollarSign class="h-4 w-4 text-muted-foreground" />
            <span>Mes paiements</span>
          </NuxtLink>
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        <DropdownMenuItem
          :onclick="onLogout"
          class="flex cursor-pointer items-center gap-2 rounded-md p-2 text-destructive hover:bg-destructive/10"
        >
          <LogOut class="h-4 w-4" />
          <span> Déconnexion </span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
    <Button variant="secondary" size="sm" as-child v-else>
      <NuxtLink to="/auth/login">Se connecter</NuxtLink>
    </Button>
  </div>
</template>
