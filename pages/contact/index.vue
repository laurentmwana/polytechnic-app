<script setup lang="ts">
import ContactForm from "@/components/features/contact/ContactForm.vue";
import ContactInfo from "@/components/features/contact/ContactInfo.vue";
import type { SchemaContactFormInfer } from "@/definitions/other";
import { contactUs } from "@/services/other";
import { toast } from "vue-sonner";
import type { StateActionModel, ValidatorErrorProps } from "../../types/util";

const validator = ref<ValidatorErrorProps | null>(null);

const router = useRouter();

const isLoading = ref<boolean>(true);

const onSubmit = async (values: SchemaContactFormInfer) => {
  try {
    isLoading.value = true;
    validator.value = null;
    const response = await contactUs(values);
    const data = await response.json();

    if (response.ok) {
      const state = (data as StateActionModel).state;
      if (state) {
        toast.success("Message de contact", {
          description: `Message envoyé avec succès`,
        });

        router.push("/contact");
      } else {
        toast.error("Message de contact", {
          description: `Nous n'avons pas pu effectuer cette action`,
        });
      }
    } else if (response.status === 422) {
      validator.value = data as ValidatorErrorProps;
    } else {
      toast.error("Erreur", {
        description:
          (data as { message: string }).message || "Une erreur est survenue",
      });
    }
  } catch (error) {
    toast.error("Erreur", {
      description: `Impossible d'effectuer cette action`,
    });
  }
};
</script>

<template>
  <div class="container my-12">
    <div class="section-page-header">
      <h2 class="section-page-title">Nous contacter</h2>
    </div>

    <div class="grid grid-cols-1 gap-6 lg:grid-cols-3">
      <div class="lg:col-span-1 w-full">
        <ContactInfo />
      </div>
      <div class="lg:col-span-2 w-full space-y-4">
        <ValidatorError :validator="validator" />
        <div class="container-card w-full">
          <ContactForm :onSubmit="onSubmit" />
        </div>
      </div>
    </div>
  </div>
</template>
