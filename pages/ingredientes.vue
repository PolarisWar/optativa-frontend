<template>
    <div class="p-4">
      <h1 class="text-4xl text-center my-4">Lista de Ingredientes</h1>
      
      <div class="text-center mb-4">
        <NuxtLink to="/" class="text-blue-500 hover:underline">Volver al Home</NuxtLink>
      </div>
  
      <h2 class="text-2xl text-center my-4">Agregar Nuevo Ingrediente</h2>
      <form @submit.prevent="ingredienteId ? actualizarIngrediente() : agregarIngrediente()" class="mb-4">
        <input v-model="ingrediente_name" placeholder="Nombre del ingrediente" required class="border p-2 mb-2 w-full" />
        <input v-model="unidad_medida" type="number" placeholder="Unidad de medida" required class="border p-2 mb-2 w-full" />
        <input v-model="recetaId" type="number" placeholder="ID de receta" required class="border p-2 mb-2 w-full" />
        <button type="submit" class="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition">
          {{ ingredienteId ? 'Actualizar Ingrediente' : 'Agregar Ingrediente' }}
        </button>
      </form>
  
      <h2 class="text-2xl text-center my-4">Ingredientes Existentes</h2>
      <ul class="list-disc pl-5">
        <li v-for="ingrediente in ingredientes" :key="ingrediente.id" class="my-2">
          <strong>{{ ingrediente.ingredientes_name }}</strong> <br />
          <em>Unidad de medida:</em> {{ ingrediente.unidad_medida }} gramos<br />
          <button @click="editarIngrediente(ingrediente)" class="bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600 transition">Editar</button>
          <button @click="eliminarIngrediente(ingrediente.id)" class="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600 transition">Eliminar</button>
        </li>
      </ul>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted } from 'vue'

  const { token } = useAuth()
  
  const ingredientes = ref([])
  const ingrediente_name = ref('')
  const unidad_medida = ref('')
  const recetaId = ref('')
  const ingredienteId = ref(null)

  const obtenerIngredientes = async () => {
    try {
      const response = await $fetch('http://localhost:3001/ingredientes', {
        headers: {
          'Authorization': token.value
        }
      })
      ingredientes.value = response
    } catch (error) {
      console.error('Error al obtener ingredientes:', error)
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
    } catch (error) {
      console.error('Error al agregar ingrediente:', error)
    }
  }

  const editarIngrediente = (ingrediente) => {
    ingredienteId.value = ingrediente.id
    ingrediente_name.value = ingrediente.ingredientes_name
    unidad_medida.value = ingrediente.unidad_medida
    recetaId.value = ingrediente.recetaId
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
    } catch (error) {
      console.error('Error al actualizar ingrediente:', error)
    }
  }

  const eliminarIngrediente = async (id) => {
    try {
      await $fetch(`http://localhost:3001/ingredientes/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': token.value
        }
      })
      await obtenerIngredientes()
    } catch (error) {
      console.error('Error al eliminar ingrediente:', error)
    }
  }

  const limpiarFormulario = () => {
    ingredienteId.value = null
    ingrediente_name.value = ''
    unidad_medida.value = ''
    recetaId.value = ''
  }

  onMounted(obtenerIngredientes)
  </script>
  