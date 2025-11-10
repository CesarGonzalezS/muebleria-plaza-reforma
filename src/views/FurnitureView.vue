<template>
  <div class="furniture-view">
    <h1>Muebles</h1>
    <button @click="fetchFurniture">Recargar</button>
    <ul v-if="furniture.length">
      <li v-for="item in furniture" :key="item.id">
        <h3>{{ item.name }}</h3>
        <p>{{ item.description }}</p>
        <small>Categoría: {{ item.category }} | Precio: ${{ item.price }}</small>
        <button @click="deleteFurniture(item.id)">Eliminar</button>
      </li>
    </ul>
    <div v-else>
      No hay muebles.
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { getFurniture, deleteFurniture } from '../services/furniture';

const furniture = ref([]);

async function fetchFurniture() {
  try {
    furniture.value = await getFurniture();
  } catch (e) {
    // Manejo de error ya está en AxiosConfig
  }
}

async function deleteFurniture(id) {
  if (confirm('¿Seguro que deseas eliminar este mueble?')) {
    await deleteFurniture(id);
    fetchFurniture();
  }
}

onMounted(fetchFurniture);
</script>

<style scoped>
.furniture-view {
  max-width: 700px;
  margin: 2rem auto;
  padding: 1rem;
  background: #fff;
  border-radius: 1rem;
  box-shadow: 0 2px 12px #86073422;
}
.furniture-view h1 {
  color: #860734;
  margin-bottom: 1.2rem;
}
ul {
  list-style: none;
  padding: 0;
}
li {
  margin-bottom: 2rem;
  border-bottom: 1px solid #eee;
  padding-bottom: 1rem;
}
button {
  background: #a81552;
  color: #fff;
  border: none;
  border-radius: 6px;
  padding: 0.5rem 1rem;
  cursor: pointer;
  margin-top: 0.5rem;
}
button:hover {
  background: #860734;
}
</style>
