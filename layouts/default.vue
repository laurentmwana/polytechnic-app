<script setup></script>

<template>
  <div>
    <NavBar />
    <main class="h-full mt-auto">
      <slot />
    </main>
    <footer class="py-8" id="footer">
      <div class="container">
        <div class="container-center grid grid-cols-1 gap-6 md:grid-cols-2">
          <div>
            <h2
              class="mb-4 text-xl font-semibold text-gray-700 dark:text-gray-100"
            >
              Faculté Polytechnique
            </h2>
            <p class="text-description mb-4">
              La Faculté Polytechnique de l&#39;Université de Kinshasa (UNIKIN)
              est un pôle d&#39;excellence en ingénierie et en technologie,
              formant depuis des décennies les leaders de demain dans les
              domaines scientifiques et industriels
            </p>
          </div>
          <div class="flex md:justify-end">
            <div>
              <h2 class="mb-4 text-xl font-semibold">Nous contacter</h2>
              <ul class="space-y-2">
                <li>
                  <NuxtLink href="" class="flex gap-x-2 hover:underline">
                    <i
                      class="bi bi-envelope text-blue-500 hover:text-blue-600"
                    ></i>
                    <span class="text-muted-foreground"> Par e-mail </span>
                  </NuxtLink>
                </li>
                <li>
                  <a
                    href="https://api.whatsapp.com/send/?phone=243829760292&text&type=phone_number&app_absent=0"
                    class="flex gap-x-2 hover:underline"
                  >
                    <i
                      class="bi bi-whatsapp text-green-500 hover:text-green-600"
                    ></i>
                    <span class="text-muted-foreground"> Par Whatsapp </span>
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      <p class="mt-8 text-center text-sm text-gray-600">
        &copy; Faculté Polytechnique {{ new Date().getFullYear() }}
      </p>
    </footer>
  </div>
</template>
