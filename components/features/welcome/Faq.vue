<script setup lang="tsx">
const faqData = [
  {
    id: "item-1",
    question:
      "Quels sont les critères d’admission à la Faculté de Polytechnique ?",
    answer:
      "Pour être admis, il faut avoir obtenu un diplôme d’État avec une mention honorable en sciences. Les tests d’admission et l’analyse du dossier académique font également partie du processus de sélection.",
  },
  {
    id: "item-2",
    question:
      "Quand commencent les inscriptions pour la nouvelle année académique ?",
    answer:
      "Les inscriptions débutent généralement au mois d’août. Les dates précises sont publiées chaque année sur le site officiel de la faculté.",
  },
  {
    id: "item-3",
    question: "Comment récupérer ma carte d’étudiant ?",
    answer:
      "Après l’inscription, vous devez vous rendre au service des affaires académiques avec votre preuve de paiement pour récupérer votre carte d’étudiant.",
  },
  {
    id: "item-4",
    question: "Quelles sont les filières proposées en cycle de Licence ?",
    answer:
      "La Faculté propose des filières comme Génie Civil, Génie Électrique, Informatique, Mécanique, Géologie Appliquée, Télécommunications, etc.",
  },
  {
    id: "item-5",
    question:
      "Comment obtenir une attestation de réussite ou un relevé de notes ?",
    answer:
      "Ces documents sont délivrés par le secrétariat académique. Une demande écrite et la présentation d’une pièce d’identité sont nécessaires.",
  },
  {
    id: "item-6",
    question: "Où consulter les résultats des examens ?",
    answer:
      "Les résultats sont affichés aux valves de la faculté et peuvent également être consultés en ligne dans l’espace étudiant si vous disposez d’un compte.",
  },
  {
    id: "item-7",
    question:
      "Existe-t-il des opportunités de stage ou d’échange international ?",
    answer:
      "Oui, la faculté a des partenariats avec plusieurs institutions et entreprises. Les offres de stage et les programmes d’échange sont annoncés par le Service de Coopération.",
  },
  {
    id: "item-8",
    question: "Que faire en cas de perte de la carte d’étudiant ?",
    answer:
      "En cas de perte, signalez immédiatement au service académique et payez les frais de réédition pour obtenir une nouvelle carte.",
  },
  {
    id: "item-9",
    question: "Quel est le calendrier académique de l’année en cours ?",
    answer:
      "Le calendrier est publié en début d’année académique et contient toutes les dates importantes : début des cours, sessions d’examens, congés, etc. Il est consultable en ligne.",
  },
  {
    id: "item-10",
    question: "Comment accéder à la plateforme numérique de la faculté ?",
    answer:
      "L’accès se fait via une URL spécifique fournie par l’administration. Chaque étudiant reçoit ses identifiants après l’inscription. Pour tout problème d’accès, contactez le service informatique.",
  },
];
</script>

<template>
  <div class="container my-12">
    <div class="section-header">
      <h2 class="section-title">Questions fréquemment posées</h2>
      <p class="section-subtitle">
        Trouvez ici des réponses rapides aux questions les plus courantes sur
        nos programmes, inscriptions et services à la Faculté de Polytechnique.
      </p>
    </div>

    <div class="mx-auto max-w-3xl">
      <Accordion type="single" collapsible class="w-full">
        <AccordionItem
          v-for="faq in faqData"
          class="mb-5 rounded-md border px-3 shadow-sm"
          :key="faq.id"
          :value="faq.id"
        >
          <AccordionTrigger class="text-base font-medium">
            {{ faq.question }}
          </AccordionTrigger>
          <AccordionContent>{{ faq.answer }}</AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  </div>
</template>
