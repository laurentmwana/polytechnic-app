<script setup lang="ts">
import { verifiedEmail } from "@/services/auth";
import { toast } from "vue-sonner";

useHead({
  title: "Vérification - Polytechnic Application",
});

definePageMeta({
  layout: "auth",
  middleware: ["auth", "unverified"],
});

interface StateSendVerification {
  status: "already" | "verified";
}

const isPending = ref(true);

const router = useRouter();
const route = useRoute();
const auth = useAuth();

const userId = parseInt(route.params.id as string);
const hashToken = route.params.hash as string | null;
const expires = route.query.expires as string | null;
const signature = route.query.signature as string | null;

if (!userId || isNaN(userId)) {
  throw createError({
    statusCode: 400,
    statusMessage: "ID utilisateur invalide.",
  });
}
if (!hashToken || !expires || !signature) {
  throw createError({
    statusCode: 400,
    statusMessage: "Le lien de vérification est invalide ou incomplet.",
  });
}

const onVerifyEmail = async () => {
  try {
    if (!isPending.value) {
      isPending.value = true;
    }

    const token = auth.session.value?.accessToken;
    if (!token) {
      throw new Error("Utilisateur non authentifié.");
    }

    const response = await verifiedEmail(token, {
      id: userId,
      hash: hashToken,
      expires,
      signature,
    });
    const data = await response.json();

    if (response.ok) {
      const state = data as StateSendVerification;

      if (state.status === "already") {
        toast("Vérification", {
          description: "Votre adresse e-mail a déjà été vérifiée.",
        });
        await router.push("/");
      } else if (state.status === "verified") {
        toast.success("Adresse e-mail vérifiée", {
          description:
            "Votre adresse e-mail a bien été vérifiée. Merci de vous reconnecter pour que les modifications soient prises en compte.",
        });
        auth.logout();
        await router.push("/auth/login");
      } else {
        toast.success("Problème", {
          description:
            "Nous n'avons pas pu effectuer cette action, merci de réessayer",
        });
      }
    } else if (response.status === 401) {
      toast.warning("Session expirée", {
        description: "Votre session a expiré, merci de vous reconnecter.",
      });
      auth.logout();
    } else {
      toast.error("Erreur", {
        description:
          (data as { message?: string }).message ?? "Une erreur est survenue.",
      });
    }
  } catch (error) {
    toast.error("Erreur", {
      description: "La vérification de l'e-mail a échoué, veuillez réessayer.",
    });
  } finally {
    isPending.value = false;
  }
};

onMounted(onVerifyEmail);
</script>

<template>
  <Card>
    <CardHeader class="text-center">
      <CardTitle>Vérification en cours</CardTitle>
      <CardDescription>
        Nous vérifions votre adresse e-mail. Merci de patienter un instant.
      </CardDescription>
    </CardHeader>
    <CardContent>
      <div v-if="isPending" class="text-center text-gray-600 italic text-sm">
        Chargement en cours...
      </div>
      <div
        v-else-if="redirecting"
        class="text-center text-green-600 font-semibold text-sm"
      >
        Redirection en cours, merci de patienter...
      </div>
    </CardContent>
  </Card>
</template>
