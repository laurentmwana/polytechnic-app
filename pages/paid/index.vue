<script setup lang="ts">
useHead({
  title: "Mes paiements - Polytechnic Application",
});
definePageMeta({
  layout: "default",
});
</script>

<template>
  <div class="container my-12">
    <div class="section-page-header">
      <h2 class="section-page-title">Mes paiements</h2>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card>
        <CardHeader>
          <CardTitle class="text-xl"> Frais académique </CardTitle>
          <CardDescription>
            Les frais académiques à l’Université de Kinshasa représentent le
            montant principal que chaque étudiant doit payer pour s’inscrire et
            suivre les cours durant une année académique. Ces frais couvrent le
            fonctionnement général de l’université, notamment la rémunération
            des enseignants, l’entretien des infrastructures, et l’organisation
            des activités pédagogiques
          </CardDescription>
        </CardHeader>
        <CardFooter>
          <Button>
            <NuxtLink href="/paid/academic"> Voir plus </NuxtLink>
          </Button>
        </CardFooter>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle class="text-xl"> Frais laboratoire (labo) </CardTitle>
          <CardDescription>
            Les frais de laboratoire sont des frais additionnels, principalement
            exigés dans les filières scientifiques, médicales ou techniques. Ils
            servent à financer les activités pratiques, les travaux dirigés,
            l’achat de matériel et le bon fonctionnement des laboratoires
            universitaires
          </CardDescription>
        </CardHeader>
        <CardFooter>
          <Button variant="secondary">
            <NuxtLink href="/paid/laboratory"> Voir plus </NuxtLink>
          </Button>
        </CardFooter>
      </Card>
    </div>
  </div>
</template>
