<script setup lang="ts">
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import LastNotification from "../components/features/notification/LastNotification.vue";

const route = useRoute();

const items = [
  {
    title: "Application",
    url: "#",
    children: [
      {
        title: "Tableau de bord",
        url: "/dashboard",
      },
    ],
  },
  {
    title: "Edifice",
    children: [
      {
        title: "Département",
        url: "/admin/department",
      },
    ],
  },

  {
    title: "Académique",
    children: [
      {
        title: "Année académique",
        url: "/admin/year-academic",
      },
      {
        title: "Délibération",
        url: "/admin/deliberation",
      },
      {
        title: "Juries",
        url: "/admin/jury",
      },
      {
        title: "Cours",
        url: "/admin/course",
      },
      {
        title: "Professeurs",
        url: "/admin/teacher",
      },
      {
        title: "Promotions",
        url: "/admin/level",
      },
    ],
  },


  {
    title: "Publication",
    children: [
      {
        title: "Evènement",
        url: "/admin/event",
      },
      {
        title: "Résultats",
        url: "/admin/result",
      },
    ],
  },

  {
    title: "Gestion",
    children: [
      {
        title: "Etudiant",
        url: "/admin/student",
      },
      {
        title: "Utilisateur",
        url: "/admin/user",
      },
    ],
  },
];

const isActive = (href?: string): boolean => {
  if (!href) return false;
  if (href === "/") {
    return route.path === "/";
  }
  return route.path.startsWith(href);
};
</script>

<template>
  <SidebarProvider>
    <Sidebar>
      <SidebarHeader class="flex flex-col gap-4">
        <h2 class="text-xl font-bold">Administration</h2>
        <Separator />
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup v-for="item in items">
          <SidebarGroupLabel>
            {{ item.title }}
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem v-for="c in item.children" :key="item.title">
                <SidebarMenuButton
                  :class="isActive(c.url) ? 'bg-accent' : ''"
                  asChild
                >
                  <NuxtLink :to="c.url">
                    <span>{{ c.title }}</span>
                  </NuxtLink>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter />
    </Sidebar>
    <SidebarInset>
      <header
        class="flex sticky top-0 bg-background z-50 border-border h-12 shrink-0 items-center justify-between gap-2 border-b px-4"
      >
        <div class="flex gap-3">
          <SidebarTrigger class="-ml-1" />
          <Separator orientation="vertical" />
        </div>
        <div class="flex items-center gap-4">
          <LastNotification />
          <AvatarAdmin />
        </div>
      </header>
      <div class="flex flex-1 flex-col gap-4 px-2 py-4 lg:p-4">
        <slot />
      </div>
    </SidebarInset>
  </SidebarProvider>
</template>
