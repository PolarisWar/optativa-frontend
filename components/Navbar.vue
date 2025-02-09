<template>
  <nav class="bg-gray-900 shadow-lg">
    <div class="container mx-auto px-6 py-4 flex justify-between items-center">
      <!-- Logo y enlaces principales -->
      <div class="flex items-center">
        <NuxtLink to="/" class="text-2xl font-bold text-blue-500 hover:text-blue-400 transition duration-300">
          RecipeHub
        </NuxtLink>
        <div class="hidden md:flex space-x-6 ml-10">
          <NuxtLink to="/recetas" class="text-gray-300 hover:text-white transition duration-300">Recetas</NuxtLink>
          <NuxtLink to="/categorias" class="text-gray-300 hover:text-white transition duration-300">Categorías</NuxtLink>
          <NuxtLink to="/ingredientes" class="text-gray-300 hover:text-white transition duration-300">Ingredientes</NuxtLink>
        </div>
      </div>

      <!-- Menú de usuario y logout -->
      <div class="flex items-center space-x-4">
        <div class="relative">
          <button @click="toggleDropdown" class="flex items-center text-gray-300 hover:text-white focus:outline-none transition duration-300">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
            </svg>
          </button>
          <!-- Dropdown Menu -->
          <div v-if="isDropdownOpen" class="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-2 z-50">
            <button @click="handleLogout" class="block w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Cerrar Sesión</button>
          </div>
        </div>
      </div>
    </div>

    <!-- Menú móvil -->
    <div class="md:hidden">
      <button @click="toggleMobileMenu" class="text-gray-300 hover:text-white focus:outline-none">
        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16m-7 6h7"></path>
        </svg>
      </button>
      <div v-if="isMobileMenuOpen" class="px-2 pt-2 pb-3 space-y-1 sm:px-3">
        <NuxtLink to="/recetas" class="block text-gray-300 hover:text-white">Recetas</NuxtLink>
        <NuxtLink to="/categorias" class="block text-gray-300 hover:text-white">Categorías</NuxtLink>
        <NuxtLink to="/ingredientes" class="block text-gray-300 hover:text-white">Ingredientes</NuxtLink>
        <button @click="handleLogout" class="block w-full text-left text-gray-300 hover:text-white">Cerrar Sesión</button>
      </div>
    </div>
  </nav>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuth } from '#imports';

const { signOut, getSession } = useAuth();
const router = useRouter();

const isDropdownOpen = ref(false);
const isMobileMenuOpen = ref(false);

const toggleDropdown = () => {
  isDropdownOpen.value = !isDropdownOpen.value;
};

const toggleMobileMenu = () => {
  isMobileMenuOpen.value = !isMobileMenuOpen.value;
};

const handleLogout = async () => {
  try {
    const session = await getSession();
    if (!session) {
      await router.push('/login');
      return;
    }

    try {
      await signOut({ redirect: false });
    } catch (error) {
      if (!error.message.includes('Navigating to an external URL')) {
        throw error;
      }
    }

    await router.push('/login');
  } catch (error) {
    console.error('Error durante el logout:', error);
    // Aquí podrías mostrar un mensaje de error al usuario
  }
};
</script>

<style scoped>
/* Estilos adicionales si los necesitas */
</style>