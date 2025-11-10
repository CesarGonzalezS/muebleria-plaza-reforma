<template>
  <div class="posts-view">
    <h1>Publicaciones</h1>
    <button @click="fetchPosts">Recargar</button>
    <ul v-if="posts.length">
      <li v-for="post in posts" :key="post.id">
        <h3>{{ post.title }}</h3>
        <p>{{ post.content }}</p>
        <small>Mueble ID: {{ post.furniture_id }} | Publicado: {{ post.publication_date }}</small>
        <button @click="deletePost(post.id)">Eliminar</button>
      </li>
    </ul>
    <div v-else>
      No hay publicaciones.
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { getPosts, softDeletePost } from '../services/posts';

const posts = ref([]);

async function fetchPosts() {
  try {
    posts.value = await getPosts();
  } catch (e) {
    // Manejo de error ya está en AxiosConfig
  }
}

async function deletePost(id) {
  if (confirm('¿Seguro que deseas eliminar esta publicación?')) {
    await softDeletePost(id);
    fetchPosts();
  }
}

onMounted(fetchPosts);
</script>

<style scoped>
.posts-view {
  max-width: 700px;
  margin: 2rem auto;
  padding: 1rem;
  background: #fff;
  border-radius: 1rem;
  box-shadow: 0 2px 12px #86073422;
}
.posts-view h1 {
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
