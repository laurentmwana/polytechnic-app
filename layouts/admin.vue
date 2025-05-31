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
        url: "#",
      },
      {
        title: "Délibération",
        url: "#",
      },
    ],
  },

  {
    title: "Gestion",
    children: [
      {
        title: "Etudiant",
        url: "#",
      },
      {
        title: "Utilisateur",
        url: "/admin/user",
      },
    ],
  },
];
</script>

<template>
  <SidebarProvider>
    <Sidebar>
      <SidebarHeader />
      <SidebarContent>
        <SidebarGroup v-for="item in items">
          <SidebarGroupLabel>
            {{ item.title }}
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem v-for="c in item.children" :key="item.title">
                <SidebarMenuButton asChild>
                  <a :href="c.url">
                    <span>{{ c.title }}</span>
                  </a>
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
        class="flex sticky top-0 bg-background h-16 shrink-0 items-center gap-2 border-b px-4"
      >
        <SidebarTrigger class="-ml-1" />
        <Separator orientation="vertical" class="mr-2 h-4" />
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem class="hidden md:block">
              <BreadcrumbLink href="#">
                Building Your Application
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator class="hidden md:block" />
            <BreadcrumbItem>
              <BreadcrumbPage>Data Fetching</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        <c />
      </header>
      <div class="flex flex-1 flex-col gap-4 p-4">
        <div
          v-for="i in 24"
          :key="i"
          class="aspect-video h-12 w-full rounded-lg bg-muted/50"
        />
      </div>
    </SidebarInset>
  </SidebarProvider>
</template>
