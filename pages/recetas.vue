<template>
  <div class="min-h-screen bg-gradient-to-r from-gray-900 to-gray-800 p-6">
    <div class="max-w-4xl mx-auto bg-gray-700 rounded-lg shadow-xl p-8">
      <h1 class="text-5xl font-bold text-center text-green-400 mb-8">Lista de Recetas</h1>
      
      <div class="text-center mb-8">
        <NuxtLink to="/" class="text-blue-400 hover:text-blue-300 transition duration-300 font-semibold">
          ← Volver al Home
        </NuxtLink>
      </div>

      <!-- Botón para mostrar el formulario de agregar receta -->
      <div class="text-center mb-8">
        <button @click="mostrarFormulario = true" class="bg-gradient-to-r from-green-400 to-teal-500 text-white py-3 px-6 rounded-lg hover:from-green-500 hover:to-teal-600 transition duration-300 font-semibold shadow-lg">
          Agregar Receta
        </button>
      </div>

      <!-- Formulario para agregar/editar recetas -->
      <div v-if="mostrarFormulario" class="bg-gray-600 p-6 rounded-lg shadow-md mb-8">
        <h2 class="text-3xl font-bold text-green-400 mb-6 text-center">
          {{ recetaId ? 'Editar Receta' : 'Agregar Nueva Receta' }}
        </h2>
        <form @submit.prevent="recetaId ? actualizarReceta() : agregarReceta()" class="space-y-4">
          <input v-model="receta_name" placeholder="Nombre de la receta" required class="w-full p-3 border border-gray-500 rounded-lg focus:ring-2 focus:ring-green-400 focus:outline-none transition duration-300 bg-gray-700 text-white" />
          <input v-model="receta_descripcion" placeholder="Descripción" required class="w-full p-3 border border-gray-500 rounded-lg focus:ring-2 focus:ring-green-400 focus:outline-none transition duration-300 bg-gray-700 text-white" />
          <textarea v-model="receta_instrucciones" placeholder="Instrucciones" required class="w-full p-3 border border-gray-500 rounded-lg focus:ring-2 focus:ring-green-400 focus:outline-none transition duration-300 bg-gray-700 text-white"></textarea>
          <input v-model="tiempo_preparacion" type="number" placeholder="Tiempo de preparación (minutos)" required class="w-full p-3 border border-gray-500 rounded-lg focus:ring-2 focus:ring-green-400 focus:outline-none transition duration-300 bg-gray-700 text-white" />
          
          <!-- Select para elegir la categoría -->
          <select v-model="categoriaId" required class="w-full p-3 border border-gray-500 rounded-lg focus:ring-2 focus:ring-green-400 focus:outline-none transition duration-300 bg-gray-700 text-white">
            <option value="" disabled>Selecciona una categoría</option>
            <option v-for="categoria in categorias" :key="categoria.id" :value="categoria.id">
              {{ categoria.categoria_name }}
            </option>
          </select>

          <button type="submit" class="w-full bg-gradient-to-r from-green-400 to-teal-500 text-white py-3 rounded-lg hover:from-green-500 hover:to-teal-600 transition duration-300 font-semibold shadow-lg">
            {{ recetaId ? 'Actualizar Receta' : 'Agregar Receta' }}
          </button>
          <button @click="cancelarFormulario" type="button" class="w-full bg-gradient-to-r from-gray-500 to-gray-600 text-white py-3 rounded-lg hover:from-gray-600 hover:to-gray-700 transition duration-300 font-semibold shadow-lg">
            Cancelar
          </button>
        </form>
      </div>

      <!-- Lista de recetas existentes -->
      <div class="bg-gray-600 p-6 rounded-lg shadow-md">
        <h2 class="text-3xl font-bold text-green-400 mb-6 text-center">Recetas Existentes</h2>
        <ul class="space-y-4">
          <li v-for="receta in recetas" :key="receta.id" class="bg-gray-700 p-6 rounded-lg shadow-sm hover:shadow-md transition duration-300">
            <div class="space-y-2">
              <h3 class="text-2xl font-bold text-green-400">{{ receta.receta_name }}</h3>
              <p class="text-gray-200">{{ receta.receta_descripcion }}</p>
              <p class="text-gray-300"><span class="font-semibold">Instrucciones:</span> {{ receta.receta_instrucciones }}</p>
              <p class="text-gray-300"><span class="font-semibold">Tiempo de preparación:</span> {{ receta.tiempo_preparacion }} minutos</p>
              <div class="flex space-x-4 mt-4">
                <button @click="editarReceta(receta)" class="bg-gradient-to-r from-blue-400 to-indigo-500 text-white px-4 py-2 rounded-lg hover:from-blue-500 hover:to-indigo-600 transition duration-300 shadow-lg">Editar</button>
                <button @click="eliminarReceta(receta.id)" class="bg-gradient-to-r from-red-400 to-pink-500 text-white px-4 py-2 rounded-lg hover:from-red-500 hover:to-pink-600 transition duration-300 shadow-lg">Eliminar</button>
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

const { token } = useAuth()

const recetas = ref([])
const categorias = ref([])
const receta_name = ref('')
const receta_descripcion = ref('')
const receta_instrucciones = ref('')
const tiempo_preparacion = ref('')
const categoriaId = ref('')
const recetaId = ref(null)
const mostrarFormulario = ref(false)

const obtenerRecetas = async () => {
  try {
    const response = await $fetch('http://localhost:3001/recetas', {
      headers: {
        'Authorization': token.value
      }
    })
    recetas.value = response
  } catch (error) {
    console.error('Error al obtener recetas:', error)
  }
}

const obtenerCategorias = async () => {
  try {
    const response = await $fetch('http://localhost:3001/categorias', {
      headers: {
        'Authorization': token.value
      }
    });
    categorias.value = response;
  } catch (error) {
    console.error('Error al obtener categorías:', error);
  }
};

const agregarReceta = async () => {
  try {
    const nuevaReceta = {
      receta_name: receta_name.value,
      receta_descripcion: receta_descripcion.value,
      receta_instrucciones: receta_instrucciones.value,
      tiempo_preparacion: tiempo_preparacion.value,
      categoriaId: categoriaId.value,
    }
    
    await $fetch('http://localhost:3001/recetas', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': token.value
      },
      body: JSON.stringify(nuevaReceta),
    })
    
    await obtenerRecetas()
    limpiarFormulario()
    mostrarFormulario.value = false
  } catch (error) {
    console.error('Error al agregar receta:', error)
  }
}

const editarReceta = (receta) => {
  recetaId.value = receta.id
  receta_name.value = receta.receta_name
  receta_descripcion.value = receta.receta_descripcion
  receta_instrucciones.value = receta.receta_instrucciones
  tiempo_preparacion.value = receta.tiempo_preparacion
  categoriaId.value = receta.categoriaId
  mostrarFormulario.value = true
}

const actualizarReceta = async () => {
  try {
    const recetaActualizada = {
      receta_name: receta_name.value,
      receta_descripcion: receta_descripcion.value,
      receta_instrucciones: receta_instrucciones.value,
      tiempo_preparacion: tiempo_preparacion.value,
      categoriaId: categoriaId.value,
    }

    await $fetch(`http://localhost:3001/recetas/${recetaId.value}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization':  token.value
      },
      body: JSON.stringify(recetaActualizada),
    })

    await obtenerRecetas()
    limpiarFormulario()
    mostrarFormulario.value = false
  } catch (error) {
    console.error('Error al actualizar receta:', error)
  }
}

const eliminarReceta = async (id) => {
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
      await $fetch(`http://localhost:3001/recetas/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': token.value
        }
      });
      await obtenerRecetas();

      // Mostrar mensaje de éxito
      Swal.fire(
        '¡Eliminado!',
        'La receta ha sido eliminada.',
        'success'
      );
    } catch (error) {
      console.error('Error al eliminar receta:', error);

      // Mostrar mensaje de error
      Swal.fire(
        'Error',
        'No se pudo eliminar la receta.',
        'error'
      );
    }
  }
};

const limpiarFormulario = () => {
  recetaId.value = null
  receta_name.value = ''
  receta_descripcion.value = ''
  receta_instrucciones.value = ''
  tiempo_preparacion.value = ''
  categoriaId.value = ''
}

const cancelarFormulario = () => {
  limpiarFormulario()
  mostrarFormulario.value = false
}

onMounted(async () => {
  await obtenerRecetas();
  await obtenerCategorias(); // Obtener categorías al cargar el componente
});
</script>