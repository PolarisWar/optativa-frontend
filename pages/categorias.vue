<template>
  <div class="min-h-screen bg-gradient-to-r from-gray-900 to-gray-800 p-6">
    <div class="max-w-4xl mx-auto bg-gray-700 rounded-lg shadow-xl p-8">
      <h1 class="text-5xl font-bold text-center text-green-400 mb-8">Lista de Categorías</h1>
      
      <div class="text-center mb-8">
        <NuxtLink to="/" class="text-blue-400 hover:text-blue-300 transition duration-300 font-semibold">
          ← Volver al Home
        </NuxtLink>
      </div>

      <!-- Botón para mostrar el formulario de agregar categoría -->
      <div class="text-center mb-8">
        <button @click="mostrarFormulario = true" class="bg-gradient-to-r from-green-400 to-teal-500 text-white py-3 px-6 rounded-lg hover:from-green-500 hover:to-teal-600 transition duration-300 font-semibold shadow-lg">
          Agregar Categoría
        </button>
      </div>

      <!-- Formulario para agregar/editar categorías -->
      <div v-if="mostrarFormulario" class="bg-gray-600 p-6 rounded-lg shadow-md mb-8">
        <h2 class="text-3xl font-bold text-green-400 mb-6 text-center">
          {{ categoriaId ? 'Editar Categoría' : 'Agregar Nueva Categoría' }}
        </h2>
        <form @submit.prevent="categoriaId ? actualizarCategoria() : agregarCategoria()" class="space-y-4">
          <input v-model="categoria_name" placeholder="Nombre de la categoría" required class="w-full p-3 border border-gray-500 rounded-lg focus:ring-2 focus:ring-green-400 focus:outline-none transition duration-300 bg-gray-700 text-white" />
          <input v-model="categoria_descripcion" placeholder="Descripción" required class="w-full p-3 border border-gray-500 rounded-lg focus:ring-2 focus:ring-green-400 focus:outline-none transition duration-300 bg-gray-700 text-white" />
          <button type="submit" class="w-full bg-gradient-to-r from-green-400 to-teal-500 text-white py-3 rounded-lg hover:from-green-500 hover:to-teal-600 transition duration-300 font-semibold shadow-lg">
            {{ categoriaId ? 'Actualizar Categoría' : 'Agregar Categoría' }}
          </button>
          <button @click="cancelarFormulario" type="button" class="w-full bg-gradient-to-r from-gray-500 to-gray-600 text-white py-3 rounded-lg hover:from-gray-600 hover:to-gray-700 transition duration-300 font-semibold shadow-lg">
            Cancelar
          </button>
        </form>
      </div>

      <!-- Lista de categorías existentes -->
      <div class="bg-gray-600 p-6 rounded-lg shadow-md">
        <h2 class="text-3xl font-bold text-green-400 mb-6 text-center">Categorías Existentes</h2>
        <ul class="space-y-4">
          <li v-for="categoria in categorias" :key="categoria.id" class="bg-gray-700 p-6 rounded-lg shadow-sm hover:shadow-md transition duration-300">
            <div class="space-y-2">
              <h3 class="text-2xl font-bold text-green-400">{{ categoria.categoria_name }}</h3>
              <p class="text-gray-200">{{ categoria.categoria_descripcion }}</p>
              <div class="flex space-x-4 mt-4">
                <button @click="editarCategoria(categoria)" class="bg-gradient-to-r from-blue-400 to-indigo-500 text-white px-4 py-2 rounded-lg hover:from-blue-500 hover:to-indigo-600 transition duration-300 shadow-lg">Editar</button>
                <button @click="eliminarCategoria(categoria.id)" class="bg-gradient-to-r from-red-400 to-pink-500 text-white px-4 py-2 rounded-lg hover:from-red-500 hover:to-pink-600 transition duration-300 shadow-lg">Eliminar</button>
              </div>
            </div>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import Swal from 'sweetalert2';
import { useToast } from 'vue-toastification';

const { token } = useAuth()
const toast = useToast()
const config = useRuntimeConfig()

const categorias = ref([])
const categoria_name = ref('')
const categoria_descripcion = ref('')
const categoriaId = ref(null)
const mostrarFormulario = ref(false)

const obtenerCategorias = async () => {
  try {
    const response = await $fetch(`${config.public.BACKEND_URL}/categorias`, {
      headers: {
        'Authorization': token.value
      }
    })
    categorias.value = response
  } catch (error) {
    toast.error('🥬 Error al cargar categorías', {
      timeout: 3000,
      bodyClassName: 'text-gray-100'
    })
  }
}

const agregarCategoria = async () => {
  try {
    const nuevaCategoria = {
      categoria_name: categoria_name.value,
      categoria_descripcion: categoria_descripcion.value,
    }
    
    await $fetch(`${config.public.BACKEND_URL}/categorias`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': token.value
      },
      body: JSON.stringify(nuevaCategoria),
    })
    
    await obtenerCategorias()
    limpiarFormulario()
    mostrarFormulario.value = false
    
    toast.success('📂 ¡Categoría agregada con éxito!', {
      timeout: 3000,
      icon: '📁',
      bodyClassName: 'text-gray-100'
    })
  } catch (error) {
    toast.error('🔥 Error al guardar la categoría', {
      timeout: 3000,
      bodyClassName: 'text-gray-100'
    })
  }
}

const editarCategoria = (categoria) => {
  categoriaId.value = categoria.id
  categoria_name.value = categoria.categoria_name
  categoria_descripcion.value = categoria.categoria_descripcion
  mostrarFormulario.value = true
}

const actualizarCategoria = async () => {
  try {
    const categoriaActualizada = {
      categoria_name: categoria_name.value,
      categoria_descripcion: categoria_descripcion.value,
    }

    await $fetch(`${config.public.BACKEND_URL}/categorias/${categoriaId.value}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': token.value
      },
      body: JSON.stringify(categoriaActualizada),
    })

    await obtenerCategorias()
    limpiarFormulario()
    mostrarFormulario.value = false
    
    toast.success('📝 ¡Categoría actualizada!', {
      timeout: 3000,
      icon: '✅',
      bodyClassName: 'text-gray-100'
    })
  } catch (error) {
    toast.error('❌ Error al actualizar la categoría', {
      timeout: 3000,
      bodyClassName: 'text-gray-100'
    })
  }
}

const eliminarCategoria = async (id) => {
  const result = await Swal.fire({
    title: '¿Estás seguro?',
    text: '¡No podrás revertir esto!',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Sí, eliminar',
    cancelButtonText: 'Cancelar',
  });

  if (result.isConfirmed) {
    try {
      await $fetch(`${config.public.BACKEND_URL}/categorias/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': token.value
        }
      });
      await obtenerCategorias();

      toast.success('🗑️ Categoría eliminada', {
        timeout: 3000,
        icon: '⚠️',
        bodyClassName: 'text-gray-100'
      })
    } catch (error) {
      toast.error('🚨 Error al eliminar la categoría', {
        timeout: 3000,
        bodyClassName: 'text-gray-100'
      })
    }
  }
};

const limpiarFormulario = () => {
  categoria_name.value = ''
  categoria_descripcion.value = ''
  categoriaId.value = null
}

const cancelarFormulario = () => {
  limpiarFormulario()
  mostrarFormulario.value = false
}

onMounted(obtenerCategorias)
</script>