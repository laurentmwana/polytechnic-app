<script setup lang="ts">
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { PaginatedResponse } from "@/types/paginate";
import { ChevronLeft, ChevronRight } from "lucide-vue-next";
import { computed } from "vue";

const props = defineProps<{
  meta: PaginatedResponse<object[]>;
  onPage: (page: number) => void;
  className?: string;
}>();

const getPageNumbers = computed(() => {
  const { current_page, last_page } = props.meta.meta;
  const pageNumbers = [];
  const maxPagesToShow = 5;

  if (last_page <= maxPagesToShow) {
    for (let i = 1; i <= last_page; i++) {
      pageNumbers.push(i);
    }
  } else {
    pageNumbers.push(1);

    let startPage = Math.max(2, current_page - 1);
    let endPage = Math.min(last_page - 1, current_page + 1);

    if (current_page <= 3) {
      endPage = Math.min(last_page - 1, 4);
    } else if (current_page >= last_page - 2) {
      startPage = Math.max(2, last_page - 3);
    }

    if (startPage > 2) {
      pageNumbers.push("...");
    }

    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(i);
    }

    if (endPage < last_page - 1) {
      pageNumbers.push("...");
    }

    if (last_page > 1) {
      pageNumbers.push(last_page);
    }
  }

  return pageNumbers;
});

const handlePreviousPage = () => {
  if (props.meta.meta.current_page > 1) {
    props.onPage(props.meta.meta.current_page - 1);
  }
};

const handleNextPage = () => {
  if (props.meta.meta.current_page < props.meta.meta.last_page) {
    props.onPage(props.meta.meta.current_page + 1);
  }
};

const canGoPrevious = computed(() => props.meta.meta.current_page > 1);
const canGoNext = computed(
  () => props.meta.meta.current_page < props.meta.meta.last_page
);

// Informations d'affichage
const displayInfo = computed(() => {
  const { from, to, total } = props.meta.meta;
  return {
    from: from || 0,
    to: to || 0,
    total: total || 0,
  };
});
</script>

<template>
  <div
    v-if="meta.meta.total > 0"
    :class="
      cn(
        'flex flex-col lg:flex-row-reverse lg:justify-between items-center gap-3 py-6',
        className
      )
    "
  >
    <!-- Navigation des pages -->
    <div class="flex items-center gap-1.5">
      <!-- Bouton précédent -->
      <Button
        variant="outline"
        size="sm"
        @click="handlePreviousPage"
        :disabled="!canGoPrevious"
        aria-label="Page précédente"
        class="h-9 w-9 rounded-md border-muted-foreground/20"
      >
        <ChevronLeft class="h-4 w-4" />
      </Button>

      <!-- Numéros de pages -->
      <div class="flex items-center gap-1.5">
        <template
          v-for="(page, index) in getPageNumbers"
          :key="`page-${index}`"
        >
          <span
            v-if="page === '...'"
            :key="`ellipsis-${index}`"
            class="flex h-9 w-9 items-center justify-center text-sm text-muted-foreground"
          >
            &#8230;
          </span>
          <Button
            v-else
            :variant="meta.meta.current_page === page ? 'default' : 'outline'"
            @click="onPage(page as number)"
            :class="
              cn(
                'h-9 w-9 rounded-md text-sm font-medium',
                meta.meta.current_page === page
                  ? 'shadow-sm'
                  : 'border-muted-foreground/20 hover:bg-muted'
              )
            "
            :aria-label="`Aller à la page ${page}`"
            :aria-current="meta.meta.current_page === page ? 'page' : undefined"
          >
            {{ page }}
          </Button>
        </template>
      </div>

      <!-- Bouton suivant -->
      <Button
        variant="outline"
        size="sm"
        @click="handleNextPage"
        :disabled="!canGoNext"
        aria-label="Page suivante"
        class="h-9 w-9 rounded-md border-muted-foreground/20"
      >
        <ChevronRight class="h-4 w-4" />
      </Button>
    </div>

    <!-- Informations d'affichage -->
    <div class="text-xs text-muted-foreground">
      Affichage de
      <span class="font-medium">{{ displayInfo.from }}</span> à
      <span class="font-medium">{{ displayInfo.to }}</span> sur
      <span class="font-medium">{{ displayInfo.total }}</span>
      {{ displayInfo.total > 1 ? "résultats" : "résultat" }}
    </div>
  </div>

  <!-- Message quand aucun résultat -->
  <div
    v-else-if="meta.meta.total === 0"
    class="flex items-center justify-center py-6"
  ></div>
</template>
