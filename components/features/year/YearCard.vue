<script setup lang="ts">
import { ago } from "@/lib/date-time";
import type { YearModel } from "@/types/model";
import {
  ArrowRight,
  Calendar,
  CheckCircle,
  Clock,
  XCircle,
} from "lucide-vue-next";

interface OptionCardProps {
  year: YearModel;
}

const props = defineProps<OptionCardProps>();
</script>

<template>
  <Card
    :class="`flex flex-col h-full ${
      props.year.is_closed ? 'border-muted bg-muted/20' : ''
    }`"
  >
    <CardHeader>
      <CardTitle class="flex items-center justify-between">
        <span class="truncate">{{ props.year.name }}</span>
        <Badge
          v-if="props.year.is_closed"
          variant="outline"
          class="bg-muted text-muted-foreground"
        >
          Fermée
        </Badge>
        <Badge v-else variant="outline" class="bg-primary/10 text-primary">
          Active
        </Badge>
      </CardTitle>
      <CardDescription class="flex items-center gap-2">
        <Calendar class="h-4 w-4" />
        <span>Année académique #{{ props.year.id }}</span>
      </CardDescription>
    </CardHeader>
    <CardContent class="flex-grow">
      <div class="space-y-4">
        <div>
          <h3 class="text-sm font-medium mb-1">Période</h3>
          <div class="flex items-center gap-2">
            <Badge variant="secondary">{{ props.year.name }}</Badge>
          </div>
        </div>

        <div>
          <h3 class="text-sm font-medium mb-1">Statut</h3>
          <div class="flex items-center gap-2">
            <template v-if="props.year.is_closed">
              <XCircle class="h-4 w-4 text-muted-foreground" />
              <span class="text-muted-foreground">Année fermée</span>
            </template>
            <template v-else>
              <CheckCircle class="h-4 w-4 text-primary" />
              <span>Année active</span>
            </template>
          </div>
        </div>

        <div class="text-sm text-muted-foreground">
          <div class="flex items-center gap-2">
            <Clock class="h-4 w-4" />
            <span>Mis à jour {{ ago(props.year.created_at) }}</span>
          </div>
        </div>
      </div>
    </CardContent>
    <CardFooter class="pt-2">
      <Button
        asChild
        :variant="props.year.is_closed ? 'destructive' : 'secondary'"
        class="w-full"
      >
        <NuxtLink :to="`/year-academic/${props.year.id}`">
          Voir les détails
          <ArrowRight class="ml-2 h-4 w-4" />
        </NuxtLink>
      </Button>
    </CardFooter>
  </Card>
</template>
