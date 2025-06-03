<script setup lang="ts">
import { ago } from "@/lib/date-time";
import type { YearModel } from "@/types/model";
import {
  Calendar,
  CalendarDays,
  CheckCircle,
  Clock,
  Info,
  XCircle,
} from "lucide-vue-next";

interface YearDetailsProps {
  year: YearModel;
}

const props = defineProps<YearDetailsProps>();
</script>

<template>
  <div class="space-y-8">
    <Card>
      <CardHeader class="pb-3">
        <div class="flex items-center justify-between">
          <div>
            <CardTitle class="text-2xl font-bold">{{
              props.year.name
            }}</CardTitle>
            <div class="mt-2 flex flex-wrap gap-2">
              <Badge variant="outline">Année #{{ props.year.id }}</Badge>
              <Badge
                v-if="props.year.is_closed"
                variant="outline"
                class="bg-muted text-muted-foreground"
              >
                Fermée
              </Badge>

              <Badge
                v-else
                variant="outline"
                class="bg-primary/10 text-primary"
              >
                Active
              </Badge>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent class="space-y-6">
        <div>
          <h3 class="text-lg font-medium flex items-center gap-2 mb-3">
            <CalendarDays class="h-5 w-5 text-primary" />
            Période académique
          </h3>
          <div class="grid md:grid-cols-2 gap-4">
            <div class="border rounded-lg p-4">
              <h4 class="text-sm font-medium text-muted-foreground mb-1">
                Début
              </h4>
              <div class="flex items-center gap-2">
                <Calendar class="h-4 w-4 text-primary" />
                <p>{{ year.start }}</p>
              </div>
            </div>
            <div class="border rounded-lg p-4">
              <h4 class="text-sm font-medium text-muted-foreground mb-1">
                Fin
              </h4>
              <div class="flex items-center gap-2">
                <Calendar class="h-4 w-4 text-primary" />
                <p>{{ year.end }}</p>
              </div>
            </div>
          </div>
        </div>

        <div>
          <h3 class="text-lg font-medium flex items-center gap-2 mb-3">
            <Info class="h-5 w-5 text-primary" />
            Informations supplémentaires
          </h3>
          <div class="grid md:grid-cols-2 gap-4">
            <div class="border rounded-lg p-4">
              <h4 class="text-sm font-medium text-muted-foreground mb-1">
                Statut
              </h4>
              <div class="flex items-center gap-2" v-if="props.year.is_closed">
                <XCircle class="h-4 w-4 text-muted-foreground" />
                <p class="text-muted-foreground">Année fermée</p>
              </div>

              <div class="flex items-center gap-2" v-else>
                <CheckCircle class="h-4 w-4 text-primary" />
                <p>Année active</p>
              </div>
            </div>
            <div class="border rounded-lg p-4">
              <h4 class="text-sm font-medium text-muted-foreground mb-1">
                Date de création
              </h4>
              <div class="flex items-center gap-2">
                <Clock class="h-4 w-4 text-muted-foreground" />
                <p>{{ ago(year.created_at) }}</p>
              </div>
            </div>
            <div class="border rounded-lg p-4">
              <h4 class="text-sm font-medium text-muted-foreground mb-1">
                Dernière mise à jour
              </h4>
              <div class="flex items-center gap-2">
                <Clock class="h-4 w-4 text-muted-foreground" />
                <p>{{ ago(year.updated_at) }}</p>
              </div>
            </div>
            <div class="border rounded-lg p-4">
              <h4 class="text-sm font-medium text-muted-foreground mb-1">
                ID de l&#39;année
              </h4>
              <p>{{ year.id }}</p>
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter class="border-t pt-6">
        <p class="text-sm text-muted-foreground text-center">
          {{
            props.year.is_closed
              ? "Cette année académique est fermée et archivée."
              : "Cette année académique est actuellement active."
          }}
          Pour plus d&#39;informations, veuillez contacter
          l&lsquo;administration.
        </p>
      </CardFooter>
    </Card>
  </div>
</template>
