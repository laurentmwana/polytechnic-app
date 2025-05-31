<script setup lang="ts">
definePageMeta({
  layout: "auth",
});
</script>

<template>
  <Card>
    <CardHeader>
      <CardTitle>Se connecter</CardTitle>
      <CardDescription>
        Connectez-vous à votre compte pour accéder à votre espace
      </CardDescription>
    </CardHeader>
    <CardContent>
      <form class="space-y-6">
        <div class="space-y-2">
          <Label>Adresse e-mail</Label>
          <Input type="email" />
        </div>
        <div class="space-y-2">
          <Label>Mot de passe</Label>
          <Input type="password" />
        </div>

        <Button class="w-full"> Se connecter </Button>
      </form>
    </CardContent>
  </Card>
</template>
