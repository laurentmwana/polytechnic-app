<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useRoute } from "vue-router";
import { toast } from "vue-sonner";
import { ago } from "@/lib/date-time";
import { getShowActuality } from "@/services/other";
import type { ActualityModel } from "@/types/model";
import GoBack from "@/components/GoBack.vue";
import LoaderContainer from "@/components/LoaderContainer.vue";
import { getInitials } from "~/lib/utils";
import { MessageCircle } from "lucide-vue-next";
import CommentForm from "~/components/features/comment/CommentForm.vue";
import type { SchemaCommentFormInfer } from "~/definitions/actuality";
import { commentActuality } from '~/services/other.ts'

const route = useRoute();
const auth = useAuth()
const actualityId = parseInt(route.params.id as string, 10);

useHead({
  title: "Détails de l'actualité - Polytechnic Application",
});

definePageMeta({
  layout: "default",
});

const isPending = ref(true);
const actuality = ref<ActualityModel>();

const fetchActuality = async () => {
  try {
    isPending.value = true;
    const response = await getShowActuality(actualityId);
    const data = await response.json();

    if (response.ok) {
      actuality.value = (data as { data: ActualityModel }).data;
    } else {
      toast.error("Erreur", {
        description: (data as { message?: string }).message || "Une erreur est survenue.",
      });
    }
  } catch (error) {
    toast.error("Erreur", {
      description: "Impossible de récupérer les données de l'actualité.",
    });
  } finally {
    isPending.value = false;
  }
};

const onNewComment = async (values: SchemaCommentFormInfer) => {
  try {

    const token  = auth.session.value?.accessToken

    const response = await commentActuality(token, actualityId, values)
    if (response.ok) {
      toast.success("Succès", {
        description: "Commentaire ajouté avec succès.",
      });
    } else {
      toast.error("Problème", {
        description: "Une erreur est survenue, merci de réessayer.",
      });
    }

    await fetchActuality();
  } catch (error) {
    toast.error("Erreur", {
      description: "Impossible d'ajouter le commentaire.",
    });
  }
};

onMounted(fetchActuality);
</script>

<template>
  <div class="py-12">
    <div class="container space-y-8">
      <GoBack back="/actuality" />

    <div class="section-page-header">
      <h2 class="section-page-title">
          Actualité #{{ actualityId }}
      </h2>
       <p class="text-muted-foreground">
          Découvrez les détails et participez à la discussion
        </p>
    </div>

      <LoaderContainer v-if="isPending" :is-card="true" />

      <div v-else-if="actuality" class="space-y-8">
        <!-- Carte principale de l'actualité -->
        <Card class="shadow-lg">
          <CardContent class="p-8">
            <h2 class="text-2xl md:text-3xl font-bold mb-4">
              {{ actuality.title }}
            </h2>
            <p class="text-muted-foreground text-lg leading-relaxed mb-6">
              {{ actuality.description }}
            </p>
            <div class="flex items-center text-sm text-muted-foreground">
              <div class="w-2 h-2 bg-primary rounded-full mr-2"></div>
              Publié {{ ago(actuality.created_at) }}
            </div>
          </CardContent>
        </Card>

        <!-- Section commentaires -->

        <div class="space-y-8">
         <div>
           <h2 class="text-2xl font-semibold">
            {{ actuality.comments?.length || 0 }} commentaire{{ (actuality.comments?.length || 0) > 1 ? 's' : '' }}
          </h2>
          <Separator class="my-3" />
         </div>
       <!-- Formulaire d'ajout de commentaire -->
            <Card>
              <CardHeader>
                <CardTitle class="text-lg">
                  Ajouter un commentaire
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CommentForm :onSubmit="onNewComment" />
              </CardContent>
            </Card>

            <!-- Liste des commentaires -->
            <div v-if="actuality.comments && actuality.comments.length > 0" class="space-y-6">
              <Card 
                v-for="comment in actuality.comments" 
                :key="comment.id" 
                class="border-l-4 border-l-primary/30 hover:shadow-md transition-shadow"
              >
                <CardContent class="p-6">
                  <div class="flex items-start space-x-4">
                    <Avatar class="h-12 w-12">
                      <AvatarFallback class="text-lg">
                        {{ getInitials(comment.username) }}
                      </AvatarFallback>
                    </Avatar>
                    <div class="flex-1 min-w-0 space-y-2">
                      <div class="flex items-center space-x-3">
                        <h5 class="font-semibold">
                          {{ comment.username }}
                        </h5>
                        <span class="text-sm text-muted-foreground">
                          {{ ago(comment.created_at) }}
                        </span>
                        <Badge v-if="comment.created_at !== comment.updated_at" variant="secondary" class="text-xs">
                          modifié
                        </Badge>
                      </div>
                      <p class="text-muted-foreground leading-relaxed">
                        {{ comment.message }}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <!-- Message si aucun commentaire -->
            <div v-else class="text-center py-12">
              <MessageCircle class="h-16 w-16 text-muted-foreground/50 mx-auto mb-4" />
              <p class="text-muted-foreground text-lg font-medium mb-2">
                Aucun commentaire pour le moment
              </p>
              <p class="text-muted-foreground/70">
                Soyez le premier à partager votre avis !
              </p>
            </div>
        </div>
      </div>

      <!-- Message d'erreur -->
      <Card v-else class="shadow-lg">
        <CardContent class="p-12 text-center">
          <div class="text-muted-foreground/50 mb-4">
            <svg class="h-16 w-16 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <p class="text-muted-foreground text-lg mb-4">
            Impossible d'afficher cette actualité
          </p>
          <Button @click="fetchActuality" variant="outline">
            Réessayer
          </Button>
        </CardContent>
      </Card>
    </div>
  </div>
</template>