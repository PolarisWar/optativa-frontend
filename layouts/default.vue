<template>
    <div>
      <!-- Navbar -->
      <Navbar />
  
      <!-- Contenido dinámico -->
      <main>
        <slot /> <!-- Aquí se inyectará el contenido de las páginas -->
      </main>
  
      <!-- Footer -->
      <footer class="bg-green-800 text-white py-8">
        <div class="container mx-auto px-6 text-center">
          <p class="text-lg">© 2025 RecipeHub. Todos los derechos reservados.</p>
        </div>
      </footer>
    </div>
  </template>
  
  <script>
  import Navbar from '~/components/Navbar.vue';
  
  export default {
    name: 'DefaultLayout',
    components: {
      Navbar,
    },
  };
  </script>
  
  <style scoped>
  /* Estilos personalizados si es necesario */
  </style>