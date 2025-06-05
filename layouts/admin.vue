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
        title: "Déprtement",
        url: "#",
      },
      {
        title: "Option",
        url: "#",
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
        url: "#",
      },
      {
        title: "Juries",
        url: "#",
      },
      {
        title: "Cours",
        url: "#",
      },
      {
        title: "Professeurs",
        url: "#",
      },
    ],
  },

  {
    title: "Publication",
    children: [
      {
        title: "Résultats",
        url: "#",
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
      <SidebarHeader>
        <h2 class="text-xl font-semibold text-center ps-2">Polytechnique</h2>
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
        class="flex sticky top-0 bg-background h-12 shrink-0 items-center justify-between gap-2 border-b px-4"
      >
        <div class="flex items-center gap-2">
          <SidebarTrigger class="-ml-1" />
          <Separator orientation="vertical" />
        </div>
        <AvatarAdmin />
      </header>
      <div class="flex flex-1 flex-col gap-4 p-4">
        <slot />
      </div>
    </SidebarInset>
  </SidebarProvider>
</template>
