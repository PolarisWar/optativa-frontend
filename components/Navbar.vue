<template>
  <nav class="bg-gray-800 p-4">
    <div class="container mx-auto flex justify-between">
      <li>
        <div>
          <NuxtLink to="/" class="text-blue-500 hover:underline mr-4">Home</NuxtLink>
          <NuxtLink to="/recetas" class="text-white hover:underline mr-4">Recetas</NuxtLink>
          <NuxtLink to="/categorias" class="text-white hover:underline mr-4">Categorías</NuxtLink> 
          <NuxtLink to="/ingredientes" class="text-white hover:underline mr-4">Ingredientes</NuxtLink>
          <button
            @click="handleLogout"
            class="text-white hover:underline mr-4"
          >
            Cerrar Sesión
          </button>
        </div>
      </li>
    </div>
  </nav>
</template>

<script setup>
const { signOut, getSession } = useAuth()
const router = useRouter()

const handleLogout = async () => {
  try {
    const session = await getSession()
    if (!session) {
      await router.push('/login')
      return
    }
    
    try {
      await signOut({ redirect: false })
    } catch (error) {
      if (!error.message.includes('Navigating to an external URL')) {
        throw error
      }
    }
    
    await router.push('/login')
  } catch (error) {
    console.error('Error durante el logout:', error)
    // Aquí podrías mostrar un mensaje de error al usuario
  }
}
</script>





