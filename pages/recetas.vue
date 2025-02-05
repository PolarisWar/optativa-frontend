<template>
  <div class="p-4">
    <h1 class="text-4xl text-center my-4">Lista de Recetas</h1>
    
    <div class="text-center mb-4">
      <NuxtLink to="/" class="text-blue-500 hover:underline">Volver al Home</NuxtLink>
    </div>

    <h2 class="text-2xl text-center my-4">Agregar Nueva Receta</h2>
    <form @submit.prevent="recetaId ? actualizarReceta() : agregarReceta()" class="mb-4">
      <input v-model="receta_name" placeholder="Nombre de la receta" required class="border p-2 mb-2 w-full" />
      <input v-model="receta_descripcion" placeholder="Descripción" required class="border p-2 mb-2 w-full" />
      <textarea v-model="receta_instrucciones" placeholder="Instrucciones" required class="border p-2 mb-2 w-full"></textarea>
      <input v-model="tiempo_preparacion" type="number" placeholder="Tiempo de preparación (minutos)" required class="border p-2 mb-2 w-full" />
      <input v-model="categoriaId" type="number" placeholder="ID de categoría" required class="border p-2 mb-2 w-full" />
      <button type="submit" class="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition">
        {{ recetaId ? 'Actualizar Receta' : 'Agregar Receta' }}
      </button>
    </form>

    <h2 class="text-2xl text-center my-4">Recetas Existentes</h2>
    <ul class="list-disc pl-5">
      <li v-for="receta in recetas" :key="receta.id" class="my-2">
        <strong>{{ receta.receta_name }}</strong> - {{ receta.receta_descripcion }}<br />
        <em>Instrucciones:</em> {{ receta.receta_instrucciones }}<br />
        <em>Tiempo de preparación:</em> {{ receta.tiempo_preparacion }} minutos<br />
        <button @click="editarReceta(receta)" class="bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600 transition">Editar</button>
        <button @click="eliminarReceta(receta.id)" class="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600 transition">Eliminar</button>
      </li>
    </ul>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const { token } = useAuth()

const recetas = ref([])
const receta_name = ref('')
const receta_descripcion = ref('')
const receta_instrucciones = ref('')
const tiempo_preparacion = ref('')
const categoriaId = ref('')
const recetaId = ref(null)

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
  } catch (error) {
    console.error('Error al actualizar receta:', error)
  }
}

const eliminarReceta = async (id) => {
  try {
    await $fetch(`http://localhost:3001/recetas/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization':  token.value
      }
    })
    await obtenerRecetas()
  } catch (error) {
    console.error('Error al eliminar receta:', error)
  }
}

const limpiarFormulario = () => {
  recetaId.value = null
  receta_name.value = ''
  receta_descripcion.value = ''
  receta_instrucciones.value = ''
  tiempo_preparacion.value = ''
  categoriaId.value = ''
}

onMounted(obtenerRecetas)
</script>
