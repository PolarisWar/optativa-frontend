<template>
  <div class="min-h-screen bg-gradient-to-r from-gray-900 to-gray-800 p-6">
    <div class="max-w-4xl mx-auto bg-gray-700 rounded-lg shadow-xl p-8">
      <h1 class="text-5xl font-bold text-center text-green-400 mb-8">Lista de Ingredientes</h1>
      
      <div class="text-center mb-8">
        <NuxtLink to="/" class="text-blue-400 hover:text-blue-300 transition duration-300 font-semibold">
          ← Volver al Home
        </NuxtLink>
      </div>

      <!-- Botón para mostrar formulario -->
      <div class="text-center mb-8">
        <button @click="mostrarFormulario = true" class="bg-gradient-to-r from-green-400 to-teal-500 text-white py-3 px-6 rounded-lg hover:from-green-500 hover:to-teal-600 transition duration-300 font-semibold shadow-lg">
          Agregar Ingrediente
        </button>
      </div>

      <!-- Formulario -->
      <div v-if="mostrarFormulario" class="bg-gray-600 p-6 rounded-lg shadow-md mb-8">
        <h2 class="text-3xl font-bold text-green-400 mb-6 text-center">
          {{ ingredienteId ? 'Editar Ingrediente' : 'Nuevo Ingrediente' }}
        </h2>
        <form @submit.prevent="ingredienteId ? actualizarIngrediente() : agregarIngrediente()" class="space-y-4">
          <input v-model="ingrediente_name" placeholder="Nombre del ingrediente" required class="w-full p-3 border border-gray-500 rounded-lg focus:ring-2 focus:ring-green-400 focus:outline-none transition duration-300 bg-gray-700 text-white" />
          <input v-model="unidad_medida" type="number" placeholder="Unidad de medida (gramos)" required class="w-full p-3 border border-gray-500 rounded-lg focus:ring-2 focus:ring-green-400 focus:outline-none transition duration-300 bg-gray-700 text-white" />
          
          <!-- Select de recetas -->
          <select 
            v-model="recetaId" 
            required 
            class="w-full p-3 border border-gray-500 rounded-lg focus:ring-2 focus:ring-green-400 focus:outline-none transition duration-300 bg-gray-700 text-white"
          >
            <option value="" disabled>Selecciona una receta</option>
            <option v-for="receta in recetas" :key="receta.id" :value="receta.id">
                      {{ receta.receta_name }} 
            </option>
          </select>

          <button type="submit" class="w-full bg-gradient-to-r from-green-400 to-teal-500 text-white py-3 rounded-lg hover:from-green-500 hover:to-teal-600 transition duration-300 font-semibold shadow-lg">
            {{ ingredienteId ? 'Actualizar' : 'Agregar' }}
          </button>
          <button @click="cancelarFormulario" type="button" class="w-full bg-gradient-to-r from-gray-500 to-gray-600 text-white py-3 rounded-lg hover:from-gray-600 hover:to-gray-700 transition duration-300 font-semibold shadow-lg">
            Cancelar
          </button>
        </form>
      </div>

      <!-- Lista de ingredientes -->
      <div class="bg-gray-600 p-6 rounded-lg shadow-md">
        <h2 class="text-3xl font-bold text-green-400 mb-6 text-center">Ingredientes Existentes</h2>
        <ul class="space-y-4">
          <li v-for="ingrediente in ingredientes" :key="ingrediente.id" class="bg-gray-700 p-6 rounded-lg shadow-sm hover:shadow-md transition duration-300">
            <div class="space-y-2">
              <h3 class="text-2xl font-bold text-green-400">{{ ingrediente.ingredientes_name }}</h3>
              <p class="text-gray-300"><span class="font-semibold">Unidad de medida:</span> {{ ingrediente.unidad_medida }}g</p>
              <p class="text-gray-300"><span class="font-semibold">Receta asociada:</span> {{ obtenerNombreReceta(ingrediente.recetaId) }}</p>
              <div class="flex space-x-4 mt-4">
                <button @click="editarIngrediente(ingrediente)" class="bg-gradient-to-r from-blue-400 to-indigo-500 text-white px-4 py-2 rounded-lg hover:from-blue-500 hover:to-indigo-600 transition duration-300 shadow-lg">Editar</button>
                <button @click="eliminarIngrediente(ingrediente.id)" class="bg-gradient-to-r from-red-400 to-pink-500 text-white px-4 py-2 rounded-lg hover:from-red-500 hover:to-pink-600 transition duration-300 shadow-lg">Eliminar</button>
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

const ingredientes = ref([])
const recetas = ref([]) // Nueva variable para almacenar recetas
const ingrediente_name = ref('')
const unidad_medida = ref('')
const recetaId = ref('')
const ingredienteId = ref(null)
const mostrarFormulario = ref(false)

// Función para obtener recetas
const obtenerRecetas = async () => {
  try {
    const response = await $fetch('http://localhost:3001/recetas', {
      headers: {
        'Authorization': token.value
      }
    })
    recetas.value = response
  } catch (error) {
    toast.error('🍲 Error al cargar recetas', {
      timeout: 3000,
      bodyClassName: 'text-gray-100'
    })
  }
}

const obtenerNombreReceta = (idReceta) => {
  // 1. Búsqueda segura con optional chaining
  const receta = recetas.value?.find(r => r.id === idReceta)
  
  // 2. Validación mejorada con mensaje de error descriptivo
  if (!receta) {
    console.error(`Receta con ID ${idReceta} no encontrada`)
    return 'Receta no disponible'
  }
  
  // 3. Devolver solo el nombre (sin ID)
  return receta.receta_name
}

// Modificar onMounted para cargar ambos datos
onMounted(async () => {
  await obtenerIngredientes()
  await obtenerRecetas()
})

// Resto del código sin cambios...
const obtenerIngredientes = async () => {
  try {
    const response = await $fetch('http://localhost:3001/ingredientes', {
      headers: {
        'Authorization': token.value
      }
    })
    ingredientes.value = response
  } catch (error) {
    toast.error('🥑 Error al cargar ingredientes', {
      timeout: 3000,
      bodyClassName: 'text-gray-100'
    })
  }
}

const agregarIngrediente = async () => {
  try {
    const nuevoIngrediente = {
      ingredientes_name: ingrediente_name.value,
      unidad_medida: unidad_medida.value,
      recetaId: recetaId.value,
    }
    
    await $fetch('http://localhost:3001/ingredientes', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': token.value
      },
      body: JSON.stringify(nuevoIngrediente),
    })
    
    await obtenerIngredientes()
    limpiarFormulario()
    mostrarFormulario.value = false
    
    toast.success('🥄 ¡Ingrediente agregado con éxito!', {
      timeout: 3000,
      icon: '🍴',
      bodyClassName: 'text-gray-100'
    })
  } catch (error) {
    toast.error('🔥 Error al guardar el ingrediente', {
      timeout: 3000,
      bodyClassName: 'text-gray-100'
    })
  }
}

const editarIngrediente = (ingrediente) => {
  ingredienteId.value = ingrediente.id
  ingrediente_name.value = ingrediente.ingredientes_name
  unidad_medida.value = ingrediente.unidad_medida
  recetaId.value = ingrediente.recetaId
  mostrarFormulario.value = true
}

const actualizarIngrediente = async () => {
  try {
    const ingredienteActualizado = {
      ingredientes_name: ingrediente_name.value,
      unidad_medida: unidad_medida.value,
      recetaId: recetaId.value,
    }

    await $fetch(`http://localhost:3001/ingredientes/${ingredienteId.value}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': token.value
      },
      body: JSON.stringify(ingredienteActualizado),
    })

    await obtenerIngredientes()
    limpiarFormulario()
    mostrarFormulario.value = false
    
    toast.success('📝 ¡Ingrediente actualizado!', {
      timeout: 3000,
      icon: '✅',
      bodyClassName: 'text-gray-100'
    })
  } catch (error) {
    toast.error('❌ Error al actualizar el ingrediente', {
      timeout: 3000,
      bodyClassName: 'text-gray-100'
    })
  }
}

const eliminarIngrediente = async (id) => {
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
      await $fetch(`http://localhost:3001/ingredientes/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': token.value
        }
      });
      await obtenerIngredientes();

      toast.success('🗑️ Ingrediente eliminado', {
        timeout: 3000,
        icon: '⚠️',
        bodyClassName: 'text-gray-100'
      })
    } catch (error) {
      toast.error('🚨 Error al eliminar el ingrediente', {
        timeout: 3000,
        bodyClassName: 'text-gray-100'
      })
    }
  }
};

const limpiarFormulario = () => {
  ingredienteId.value = null
  ingrediente_name.value = ''
  unidad_medida.value = ''
  recetaId.value = ''
}

const cancelarFormulario = () => {
  limpiarFormulario()
  mostrarFormulario.value = false
}
</script>