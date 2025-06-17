<script setup lang="ts">
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import { Menu } from "lucide-vue-next";
import { computed, ref } from "vue";
import { useRoute } from "vue-router";
import { useAuth } from "../composables/useAuth";

const route = useRoute();
const open = ref(false);
const auth = useAuth();

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
      { label: "Filières", href: "/option" },
      { label: "Promotion", href: "/level" },
      { label: "Cours", href: "/course" },
      { label: "Année académique", href: "/year-academic" },
      { label: "Professeurs", href: "/teacher" },
      { label: "Délibération", href: "/deliberation" },
    ],
  },
  { label: "Contact", href: "/contact" },
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
  <nav
    class="bg-background/95 border-border sticky top-0 z-50 border-b backdrop-blur-sm"
  >
    <div class="mx-auto px-5 max-w-6xl">
      <div class="flex items-center justify-between py-4">
        <!-- Logo -->
        <NuxtLink to="/" class="flex items-center">
          <Logo
            :width="40"
            :height="40"
            class="flex items-center justify-center"
          />
        </NuxtLink>

        <!-- Desktop Menu with Dropdown Support -->
        <div class="hidden lg:block">
          <NavigationMenu>
            <NavigationMenuList>
              <NavigationMenuItem v-for="item in navItems" :key="item.label">
                <!-- Dropdown menu items -->
                <template v-if="item.children">
                  <NavigationMenuTrigger
                    :class="
                      cn(
                        'bg-bckground',
                        isActive(item.href) &&
                          'bg-accent text-accent-foreground font-semibold'
                      )
                    "
                  >
                    {{ item.label }}
                  </NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <ul class="grid w-[200px] gap-1 p-2">
                      <li v-for="child in item.children" :key="child.label">
                        <NavigationMenuLink as-child>
                          <NuxtLink
                            :to="child.href || '#'"
                            :class="
                              cn(
                                'block select-none rounded-md p-2 text-sm leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground',
                                isActive(child.href) &&
                                  'bg-accent text-accent-foreground font-semibold'
                              )
                            "
                          >
                            {{ child.label }}
                          </NuxtLink>
                        </NavigationMenuLink>
                      </li>
                    </ul>
                  </NavigationMenuContent>
                </template>
                <!-- Simple menu items -->
                <template v-else>
                  <NavigationMenuLink
                    as-child
                    :class="
                      cn(
                        navigationMenuTriggerStyle(),
                        isActive(item.href) &&
                          'bg-accent text-accent-foreground font-semibold'
                      )
                    "
                  >
                    <NuxtLink :to="item.href || '#'">
                      {{ item.label }}
                    </NuxtLink>
                  </NavigationMenuLink>
                </template>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
        </div>

        <!-- Right side items -->
        <div class="flex items-center space-x-4">
          <ThemeToggle />

          <AvatarUser />

          <!-- Mobile Menu Sheet -->
          <Sheet v-model:open="open">
            <SheetTrigger as-child class="lg:hidden">
              <Button variant="secondary" size="icon">
                <Menu :size="24" />
                <span class="sr-only">Menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent
              side="right"
              class="w-[300px] sm:w-[350px] overflow-y-auto"
            >
              <SheetHeader>
                <SheetTitle>Navigation</SheetTitle>
              </SheetHeader>
              <div class="mt-6 flex flex-col">
                <template v-for="item in navItems" :key="item.label">
                  <!-- Accordion for items with children in mobile -->
                  <Accordion v-if="item.children" type="single" collapsible>
                    <AccordionItem :value="item.label" class="border-none">
                      <AccordionTrigger
                        class="py-2.5 px-3 text-sm font-medium hover:bg-accent hover:text-accent-foreground hover:no-underline rounded-md"
                      >
                        {{ item.label }}
                      </AccordionTrigger>
                      <AccordionContent>
                        <div class="flex flex-col space-y-1 pl-4">
                          <NuxtLink
                            v-for="child in item.children"
                            :key="child.label"
                            :to="child.href || '#'"
                            @click="handleLinkClick"
                            :class="
                              cn(
                                'rounded-md px-3 py-2 text-sm font-medium transition-colors',
                                isActive(child.href)
                                  ? 'bg-accent text-accent-foreground font-semibold'
                                  : 'hover:bg-accent hover:text-accent-foreground'
                              )
                            "
                          >
                            {{ child.label }}
                          </NuxtLink>
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                  <!-- Simple links in mobile -->
                  <NuxtLink
                    v-else
                    :to="item.href || '#'"
                    @click="handleLinkClick"
                    :class="
                      cn(
                        'rounded-md px-3 py-2.5 text-sm font-medium transition-colors',
                        isActive(item.href)
                          ? 'bg-accent text-accent-foreground font-semibold'
                          : 'hover:bg-accent hover:text-accent-foreground'
                      )
                    "
                  >
                    {{ item.label }}
                  </NuxtLink>
                </template>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </div>
  </nav>
</template>
