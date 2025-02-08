<template>
  <div class="flex justify-center items-center h-screen bg-gradient-to-r from-blue-500 to-purple-600">
    <form @submit.prevent="handleSubmit" class="bg-white shadow-2xl rounded-lg px-10 pt-12 pb-10 w-full max-w-md">
      <h1 class="text-4xl font-bold text-center mb-8 text-gray-800">{{ isLogin ? 'Iniciar Sesión' : 'Registrarse' }}</h1>
      
      <!-- Campo de Usuario -->
      <div class="mb-6 relative">
        <label for="userName" class="block text-gray-700 text-sm font-semibold mb-2">Usuario:</label>
        <div class="relative">
          <input v-model="credentials" type="text" id="userName" required
            class="w-full py-3 px-4 pl-10 text-gray-700 bg-gray-50 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all" />
          <span class="absolute inset-y-0 left-0 flex items-center pl-3">
            <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
            </svg>
          </span>
        </div>
      </div>

      <!-- Campo de Email (solo en registro) -->
      <div v-if="!isLogin" class="mb-6 relative">
        <label for="email" class="block text-gray-700 text-sm font-semibold mb-2">Email:</label>
        <div class="relative">
          <input v-model="email" type="email" id="email" required
            class="w-full py-3 px-4 pl-10 text-gray-700 bg-gray-50 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all" />
          <span class="absolute inset-y-0 left-0 flex items-center pl-3">
            <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
            </svg>
          </span>
        </div>
      </div>

      <!-- Campo de Contraseña -->
      <div class="mb-8 relative">
        <label for="password" class="block text-gray-700 text-sm font-semibold mb-2">Contraseña:</label>
        <div class="relative">
          <input v-model="password" type="password" id="password" required
            class="w-full py-3 px-4 pl-10 text-gray-700 bg-gray-50 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all" />
          <span class="absolute inset-y-0 left-0 flex items-center pl-3">
            <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
            </svg>
          </span>
        </div>
      </div>

      <div class="flex flex-col items-center justify-between gap-6">
        <button type="submit"
          class="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all w-full">
          {{ isLogin ? 'Iniciar Sesión' : 'Registrarse' }}
        </button>
        
        <button type="button" @click="toggleMode"
          class="text-blue-600 hover:text-blue-800 text-sm font-semibold transition-all">
          {{ isLogin ? '¿No tienes cuenta? Regístrate' : '¿Ya tienes cuenta? Inicia sesión' }}
        </button>
      </div>

      <p v-if="errorMessage" class="text-red-500 text-sm font-semibold mt-6 text-center">{{ errorMessage }}</p>
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
      }, { redirect: false });
    } else {
      const registrationData = {
        userName: credentials.value,
        correoElectronico: email.value,
        password: password.value,
        rol: 'usuario'
      };

      // Registramos al usuario
      await signUp({ ...registrationData, credentials: registrationData.userName }, { redirect: false });
      
      // Después del registro exitoso, iniciamos sesión automáticamente
      await signIn({
        credentials: credentials.value,
        password: password.value
      }, { redirect: false });
    }
    
    // Solo redirigimos si todo el proceso fue exitoso
    await router.push('/');
  } catch (error) {
    console.error('Error:', error);
    const berrorMessage = error.data?.message || 
      error.message || 
      (isLogin.value ? 'Error al iniciar sesión' : 'Error al registrarse');
    errorMessage.value = berrorMessage;
  }
}
</script>