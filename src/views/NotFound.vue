<template>
  <div class="not-found">
    <h1>404</h1>
    <p>Lo sentimos, la pÃ¡gina que buscas no existe.</p>
    <router-link to="/" class="home-link">Volver al inicio</router-link>
  </div>
</template>

<script setup>
// No se requiere lÃ³gica adicional para esta vista.
</script>

<style scoped>
.not-found {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  text-align: center;
  background: linear-gradient(135deg, #f3e7e9, #e3eeff);
  color: #333;
}

.not-found h1 {
  font-size: 6rem;
  font-weight: bold;
  color: #d32f2f;
  margin-bottom: 1rem;
}

.not-found p {
  font-size: 1.5rem;
  margin-bottom: 2rem;
  color: #555;
}

.home-link {
  font-size: 1.2rem;
  color: #fff;
  background: linear-gradient(135deg, #d32f2f, #f44336);
  padding: 0.8rem 1.5rem;
  border-radius: var(--r-card);
  text-decoration: none;
  font-weight: bold;
  transition: background 0.3s, transform 0.2s;
}

.home-link:hover {
  background: linear-gradient(135deg, #b71c1c, #d32f2f);
  transform: translateY(-3px);
}
</style>
