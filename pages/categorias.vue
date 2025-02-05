<template>
    <div class="p-4">
      <h1 class="text-4xl text-center my-4">Lista de Categorías</h1>
      
      <div class="text-center mb-4">
        <NuxtLink to="/" class="text-blue-500 hover:underline">Volver al Home</NuxtLink>
      </div>
  
      <h2 class="text-2xl text-center my-4">Agregar Nueva Categoría</h2>
      <form @submit.prevent="categoriaId ? actualizarCategoria() : agregarCategoria()" class="mb-4">
        <input v-model="categoria_name" placeholder="Nombre de la categoría" required class="border p-2 mb-2 w-full" />
        <input v-model="categoria_descripcion" placeholder="Descripción" required class="border p-2 mb-2 w-full" />
        <button type="submit" class="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition">
          {{ categoriaId ? 'Actualizar Categoría' : 'Agregar Categoría' }}
        </button>
      </form>
  
      <h2 class="text-2xl text-center my-4">Categorías Existentes</h2>
      <ul class="list-disc pl-5">
        <li v-for="categoria in categorias" :key="categoria.id" class="my-2">
          <strong>{{ categoria.categoria_name }}</strong> - {{ categoria.categoria_descripcion }}<br />
          <button @click="editarCategoria(categoria)" class="bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600 transition">Editar</button>
          <button @click="eliminarCategoria(categoria.id)" class="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600 transition">Eliminar</button>
        </li>
      </ul>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted } from 'vue'
  const { token } = useAuth()

  // Referencias reactivas
  const categorias = ref([])
  const categoria_name = ref('')
  const categoria_descripcion = ref('')
  const categoriaId = ref(null)

  // Obtener categorías
  const obtenerCategorias = async () => {
    try {
      const response = await $fetch('http://localhost:3001/categorias', {
        headers: {
          'Authorization': token.value
        }
      })
      categorias.value = response
    } catch (error) {
      console.error('Error al obtener categorías:', error)
    }
  }

  // Agregar categoría
  const agregarCategoria = async () => {
    try {
      const nuevaCategoria = {
        categoria_name: categoria_name.value,
        categoria_descripcion: categoria_descripcion.value,
      }
      
      await $fetch('http://localhost:3001/categorias', {
        method: 'POST',
        headers: {
          'Authorization': token.value
        },
        body: JSON.stringify(nuevaCategoria),
      })

      alert('Categoría agregada exitosamente')
      await obtenerCategorias()
      limpiarFormulario()
    } catch (error) {
      console.error('Error al agregar categoría:', error)
    }
  }

  // Editar categoría
  const editarCategoria = (categoria) => {
    categoriaId.value = categoria.id
    categoria_name.value = categoria.categoria_name
    categoria_descripcion.value = categoria.categoria_descripcion
  }

  // Actualizar categoría
  const actualizarCategoria = async () => {
    try {       
      const categoriaActualizada = {
        categoria_name: categoria_name.value,
        categoria_descripcion: categoria_descripcion.value,
      }

      await $fetch(`http://localhost:3001/categorias/${categoriaId.value}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': token.value
        },
        body: JSON.stringify(categoriaActualizada),
      })

      alert('Categoría actualizada exitosamente')
      await obtenerCategorias()
      limpiarFormulario()
    } catch (error) {
      console.error('Error al actualizar categoría:', error)
    }
  }

  // Eliminar categoría
  const eliminarCategoria = async (id) => {
    try {
      await $fetch(`http://localhost:3001/categorias/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': token.value
        }
      })

      alert('Categoría eliminada exitosamente')
      await obtenerCategorias()
    } catch (error) {
      console.error('Error al eliminar categoría:', error)
    }
  }

  // Limpiar formulario
  const limpiarFormulario = () => {
    categoria_name.value = ''
    categoria_descripcion.value = ''
    categoriaId.value = null
  }

  // Cargar categorías al montar el componente
  onMounted(() => {
    obtenerCategorias()
  })
  </script>