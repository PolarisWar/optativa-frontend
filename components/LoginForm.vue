<template>
  <div class="flex justify-center items-center h-screen">
    <form @submit.prevent="handleSubmit" class="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
      <h1 class="text-3xl mb-6">{{ isLogin ? 'Iniciar Sesión' : 'Registrarse' }}</h1>
      
      <div class="mb-4">
        <label for="userName" class="block text-gray-700 text-sm font-bold mb-2">Usuario:</label>
        <input v-model="credentials" type="text" id="userName" required
          class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" />
      </div>

      <!-- Email field (only shown during registration) -->
      <div v-if="!isLogin" class="mb-4">
        <label for="email" class="block text-gray-700 text-sm font-bold mb-2">Email:</label>
        <input v-model="email" type="email" id="email" required
          class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" />
      </div>

      <div class="mb-6">
        <label for="password" class="block text-gray-700 text-sm font-bold mb-2">Contraseña:</label>
        <input v-model="password" type="password" id="password" required
          class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" />
      </div>

      <div class="flex flex-col items-center justify-between gap-4">
        <button type="submit"
          class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full">
          {{ isLogin ? 'Iniciar Sesión' : 'Registrarse' }}
        </button>
        
        <button type="button" @click="toggleMode"
          class="text-blue-500 hover:text-blue-700 text-sm">
          {{ isLogin ? '¿No tienes cuenta? Regístrate' : '¿Ya tienes cuenta? Inicia sesión' }}
        </button>
      </div>

      <p v-if="errorMessage" class="text-red-500 text-xs italic mt-4">{{ errorMessage }}</p>
    </form>
  </div>
</template>

<script setup>
definePageMeta({
  layout: 'login',
  auth: {
    unauthenticatedOnly: true,
    navigateAuthenticatedTo: "/",
  }
})

const { signIn, signUp } = useAuth()
const router = useRouter()

const isLogin = ref(true)
const credentials = ref('')
const email = ref('')
const password = ref('')
const errorMessage = ref('')

const toggleMode = () => {
  isLogin.value = !isLogin.value
  errorMessage.value = ''
}

const handleSubmit = async () => {
  try {
    if (isLogin.value) {
      await signIn({
        credentials: credentials.value,
        password: password.value
      }, { redirect: false })
    } else {
      const registrationData = {
        userName: credentials.value,  // Changed from 'username' to 'userName'
        email: email.value,
        password: password.value,
        rol: 'usuario'
      }

      console.log('Datos de registro:', registrationData)
      
      await signUp(registrationData, { redirect: false })

      await signIn({
        credentials: credentials.value,
        password: password.value
      }, { redirect: false })
    }
    router.push('/')
  } catch (error) {
    console.error('Error completo:', error)
    const berrorMessage = error.data?.message || (isLogin.value ? 'Error al iniciar sesión' : 'Error al registrarse')
    errorMessage.value = berrorMessage
  }
}
</script>
