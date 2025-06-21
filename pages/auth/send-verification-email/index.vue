<script setup lang="ts">
import { toast } from "vue-sonner";
import { sendVerificationEmail } from "~/services/auth";

useHead({
  title: "Vérification e-mail - Polytechnic Application",
});

definePageMeta({
  layout: "auth",
  middleware: ["auth", "unverified"],
});

const isSend = ref(false);
const isPending = ref(false);
const auth = useAuth();
const router = useRouter();

interface StateSendVerification {
  status: "verification-link-already" | "verification-link-sent";
}

const onSendVerificationEmail = async () => {
  try {
    if (!isPending.value) {
      isPending.value = true;
    }

    const token = auth.session.value?.accessToken;
    if (!token) {
      throw new Error("Utilisateur non authentifié");
    }

    const response = await sendVerificationEmail(token);
    const data = await response.json();

    if (response.ok) {
      const state = data as StateSendVerification;

      if (state.status === "verification-link-already") {
        toast("Vérification", {
          description: "Votre adresse e-mail est déjà vérifiée",
        });
        await router.push("/");
      } else if (state.status === "verification-link-sent") {
        isSend.value = true;
      } else {
        toast.success("Problème", {
          description:
            "Nous n'avons pas pu effectuer cette action, merci de réessayer",
        });
      }
    } else if (response.status === 401) {
      toast.warning("Session", {
        description: "Votre session a expiré, merci de vous reconnecter",
      });
      auth.logout();
    } else {
      toast.error("Erreur", {
        description:
          (data as { message?: string }).message ?? "Une erreur est survenue",
      });
    }
  } catch (error) {
    toast.error("Erreur", {
      description:
        "Impossible d'envoyer l'e-mail de vérification, merci de réessayer.",
    });
  } finally {
    isPending.value = false;
  }
};
</script>

<template>
  <Card>
    <CardHeader class="text-center">
      <CardTitle>Vérification e-mail</CardTitle>
      <CardDescription>
        {{
          isSend
            ? "Un nouveau lien de vérification a été envoyé à l'adresse e-mail que vous avez fournie lors de l'inscription."
            : "Veuillez vérifier votre adresse e-mail en cliquant sur le lien que nous venons de vous envoyer."
        }}
      </CardDescription>
    </CardHeader>
    <CardFooter>
      <Button
        v-if="!isSend"
        @click="onSendVerificationEmail"
        class="w-full"
        :disabled="isPending"
      >
        {{ isPending ? "Vérification..." : "Vérifier l'adresse email" }}
      </Button>
    </CardFooter>
  </Card>
</template>
