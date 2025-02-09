<template>
  <div class="min-h-screen bg-gray-900 text-white">
    <Navbar />

      <div class="absolute inset-0 bg-black bg-opacity-50"></div>
      
      <div class="relative z-10 text-center px-4">
        <h1 class="text-4xl md:text-6xl font-bold mb-6">Bienvenido a RecipeHub</h1>
        <p class="text-lg md:text-xl mb-8">Descubre, crea y comparte tus recetas favoritas con nuestra comunidad.</p>
        <div class="flex flex-col md:flex-row gap-4 w-full max-w-md md:max-w-none mx-auto">
          <NuxtLink to="/recetas" class="w-full md:w-auto bg-gradient-to-r from-green-400 to-teal-500 text-white px-4 md:px-6 py-3 rounded-lg hover:from-green-500 hover:to-teal-600 transition duration-300 shadow-lg text-sm md:text-base">
            Explorar Recetas
          </NuxtLink>
          <NuxtLink to="/categorias" class="w-full md:w-auto bg-gradient-to-r from-blue-400 to-indigo-500 text-white px-4 md:px-6 py-3 rounded-lg hover:from-blue-500 hover:to-indigo-600 transition duration-300 shadow-lg text-sm md:text-base">
            Ver Categorías
          </NuxtLink>
          <NuxtLink to="/ingredientes" class="w-full md:w-auto bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-4 md:px-6 py-3 rounded-lg hover:from-yellow-500 hover:to-orange-600 transition duration-300 shadow-lg text-sm md:text-base">
            Ver Ingredientes
          </NuxtLink>
        </div>
      </div>

    <div class="py-12 bg-gray-800">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 class="text-3xl font-bold text-center mb-8">¿Por qué elegir RecipeHub?</h2>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div class="text-center">
            <div class="bg-gradient-to-r from-green-400 to-teal-500 p-6 rounded-lg shadow-lg">
              <h3 class="text-2xl font-semibold mb-4">Fácil de Usar</h3>
              <p class="text-gray-100">Interfaz intuitiva para gestionar tus recetas de manera sencilla.</p>
            </div>
          </div>
          <div class="text-center">
            <div class="bg-gradient-to-r from-blue-400 to-indigo-500 p-6 rounded-lg shadow-lg">
              <h3 class="text-2xl font-semibold mb-4">Comparte con la Comunidad</h3>
              <p class="text-gray-100">Comparte tus creaciones y descubre nuevas ideas culinarias.</p>
            </div>
          </div>
          <div class="text-center">
            <div class="bg-gradient-to-r from-yellow-400 to-orange-500 p-6 rounded-lg shadow-lg">
              <h3 class="text-2xl font-semibold mb-4">Organiza tus Recetas</h3>
              <p class="text-gray-100">Categoriza y encuentra tus recetas favoritas fácilmente.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import Navbar from '~/components/Navbar.vue';

useHead({
  title: 'RecipeHub - Descubre, crea y comparte tus recetas favoritas',
  meta: [
    {
      name: 'description',
      content: 'RecipeHub es la plataforma perfecta para descubrir, crear y compartir recetas. Únete a nuestra comunidad y organiza tus recetas de manera sencilla.'
    },
    {
      name: 'keywords',
      content: 'recetas, cocina, ingredientes, categorías, comunidad culinaria, RecipeHub'
    },
    {
      property: 'og:title',
      content: 'RecipeHub - Descubre, crea y comparte tus recetas favoritas'
    },
    {
      property: 'og:description',
      content: 'RecipeHub es la plataforma perfecta para descubrir, crear y compartir recetas. Únete a nuestra comunidad y organiza tus recetas de manera sencilla.'
    },
  ]
});
</script>