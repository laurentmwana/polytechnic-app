<script setup lang="ts">
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import { Menu, ChevronDown } from "lucide-vue-next";
import { computed, ref } from "vue";
import { useRoute } from "vue-router";

const route = useRoute();
const open = ref(false);

interface NavItem {
  label: string;
  href?: string;
  children?: NavItem[];
}

const navItems = computed<NavItem[]>(() => [
  { label: "Accueil", href: "/" },
  { label: "A propos", href: "/about" },
  {
    label: "Académique",
    children: [
      { label: "Départments", href: "/department" },
      { label: "Promotion", href: "/level" },
      { label: "Cours", href: "/course" },
      { label: "Année académique", href: "/year-academic" },
      { label: "Professeurs", href: "/teacher" },
    ],
  },
  { label: "Délibération", href: "/deliberation" },
  { label: "Evènements", href: "/event" },
]);

const isActive = (href?: string): boolean => {
  if (!href) return false;
  if (href === "/") {
    return route.path === "/";
  }
  return route.path.startsWith(href);
};

const handleLinkClick = (): void => {
  open.value = false;
};
</script>

<template>
  <nav class="backdrop-blur border-b h-16">
    <div class="container mx-auto">
      <div class="flex items-center justify-between py-4">
        <!-- Logo -->
        <NuxtLink href="/" class="flex items-center">
          <Logo
            :width="30"
            :height="30"
            class="flex items-center justify-center"
          />
        </NuxtLink>

        <!-- Desktop Menu -->
        <div class="hidden lg:flex items-center space-x-1">
          <template v-for="item in navItems" :key="item.label">
            <!-- Dropdown menu items -->
            <DropdownMenu v-if="item.children">
              <DropdownMenuTrigger as-child>
                <Button
                  variant="ghost"
                  class="flex items-center space-x-1"
                  :class="
                    cn(
                      isActive(item.href) &&
                        'bg-accent text-accent-foreground font-semibold'
                    )
                  "
                >
                  <span>{{ item.label }}</span>
                  <ChevronDown :size="16" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" class="w-48">
                <DropdownMenuItem
                  v-for="child in item.children"
                  :key="child.label"
                  as-child
                >
                  <NuxtLink
                    :href="child.href || '#'"
                    :class="
                      cn(
                        'w-full cursor-pointer',
                        isActive(child.href) &&
                          'bg-accent text-accent-foreground font-semibold'
                      )
                    "
                  >
                    {{ child.label }}
                  </NuxtLink>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <!-- Simple menu items -->
            <Button
              v-else
              variant="ghost"
              as-child
              :class="
                cn(
                  isActive(item.href) &&
                    'bg-accent text-accent-foreground font-semibold'
                )
              "
            >
              <NuxtLink :to="item.href || '#'">
                {{ item.label }}
              </NuxtLink>
            </Button>
          </template>
        </div>

        <!-- Right side items -->
        <div class="flex items-center space-x-4">
          <!-- Theme Toggle -->
          <ThemeToggle />

          <!-- Avatar User -->
          <AvatarUser />

          <!-- Mobile Menu Sheet -->
          <Sheet v-model:open="open">
            <SheetTrigger as-child class="lg:hidden">
              <Button variant="outline" size="icon">
                <Menu :size="20" />
                <span class="sr-only">Menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" class="w-[300px] sm:w-[350px]">
              <SheetHeader>
                <SheetTitle>Navigation</SheetTitle>
              </SheetHeader>
              <div class="mt-6 flex flex-col space-y-2">
                <template v-for="item in navItems" :key="item.label">
                  <!-- Items with children in mobile -->
                  <div v-if="item.children" class="space-y-2">
                    <div
                      class="font-medium text-sm text-muted-foreground px-3 py-2"
                    >
                      {{ item.label }}
                    </div>
                    <div class="pl-4 space-y-1">
                      <Button
                        v-for="child in item.children"
                        :key="child.label"
                        variant="ghost"
                        as-child
                        class="w-full justify-start"
                        :class="
                          cn(
                            isActive(child.href) &&
                              'bg-accent text-accent-foreground font-semibold'
                          )
                        "
                        @click="handleLinkClick"
                      >
                        <NuxtLink :to="child.href || '#'">
                          {{ child.label }}
                        </NuxtLink>
                      </Button>
                    </div>
                  </div>

                  <!-- Simple links in mobile -->
                  <Button
                    v-else
                    variant="ghost"
                    as-child
                    class="w-full justify-start"
                    :class="
                      cn(
                        isActive(item.href) &&
                          'bg-accent text-accent-foreground font-semibold'
                      )
                    "
                    @click="handleLinkClick"
                  >
                    <NuxtLink :to="item.href || '#'">
                      {{ item.label }}
                    </NuxtLink>
                  </Button>
                </template>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </div>
  </nav>
</template>
