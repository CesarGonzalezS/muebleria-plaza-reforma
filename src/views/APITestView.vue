¯»¿<template>
  <div class="api-test-container">
    <div class="test-header">
      <h1><i class="bi bi-bug"></i> Test de APIs</h1>
      <p>Prueba todos los endpoints de la aplicación</p>
    </div>

    <div class="test-section">
      <h2>Estado del Token</h2>
      <div class="status-info">
        <div :class="['status-item', hasToken ? 'active' : 'inactive']">
          <i :class="hasToken ? 'bi bi-check-circle' : 'bi bi-x-circle'"></i>
          <span>{{ hasToken ? 'Token presente' : 'Sin token' }}</span>
        </div>
        <button v-if="!hasToken" @click="goToLogin" class="btn-primary">
          Iniciar Sesión
        </button>
      </div>
    </div>

    <div v-if="hasToken" class="test-section">
      <h2>Endpoints Disponibles</h2>

      <div class="endpoints-grid">
        <!-- Autenticación -->
        <div class="endpoint-card">
          <h3><i class="bi bi-lock"></i> Autenticación</h3>
          <ul>
            <li><router-link to="/change-password">Cambiar Contraseña</router-link></li>
            <li><router-link to="/profile">Mi Perfil</router-link></li>
          </ul>
        </div>

        <!-- Productos -->
        <div class="endpoint-card">
          <h3><i class="bi bi-box-seam"></i> Productos</h3>
          <ul>
            <li><router-link to="/productos-lista">Listar Productos</router-link></li>
            <li><router-link to="/productos-manager">Gestor de Productos</router-link></li>
          </ul>
        </div>

        <!-- Inventario -->
        <div class="endpoint-card">
          <h3><i class="bi bi-graph-up"></i> Inventario</h3>
          <ul>
            <li><router-link to="/low-stock">Productos con Stock Bajo</router-link></li>
            <li><router-link to="/inventory-adjust">Ajustar Inventario</router-link></li>
          </ul>
        </div>

        <!-- ¢rdenes -->
        <div class="endpoint-card">
          <h3><i class="bi bi-receipt"></i> ¢rdenes</h3>
          <ul>
            <li><router-link to="/my-orders">Mis ¢rdenes</router-link></li>
            <li><router-link to="/admin-orders">Gestión de ¢rdenes</router-link></li>
          </ul>
        </div>

        <!-- Reportes -->
        <div class="endpoint-card">
          <h3><i class="bi bi-graph-up-arrow"></i> Reportes</h3>
          <ul>
            <li><router-link to="/reports">Ver Reportes</router-link></li>
          </ul>
        </div>

        <!-- Admin -->
        <div class="endpoint-card">
          <h3><i class="bi bi-speedometer2"></i> Admin</h3>
          <ul>
            <li><router-link to="/admin">Panel de Administración</router-link></li>
          </ul>
        </div>
      </div>
    </div>

    <div class="test-section">
      <h2>Información Importante</h2>
      <div class="info-box">
        <p><strong>Base URL:</strong> {{ baseURL }}</p>
        <p><strong>Token guardado:</strong> {{ hasToken ? 'Sí' : 'No' }}</p>
        <p v-if="hasToken"><strong>Token:</strong> <code>{{ tokenPreview }}</code></p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();

const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

const hasToken = computed(() => {
  return !!localStorage.getItem('accessToken');
});

const tokenPreview = computed(() => {
  const token = localStorage.getItem('accessToken');
  if (!token) return '';
  return token.substring(0, 20) + '...';
});

function goToLogin() {
  router.push('/login');
}
</script>

<style scoped>
.api-test-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
  background: var(--canvas-lifted);
  min-height: 100vh;
}

.test-header {
  text-align: center;
  margin-bottom: 3rem;
}

.test-header h1 {
  color: var(--ink);
  font-size: 2rem;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  margin: 0;
}

.test-header p {
  color: var(--slate);
  margin-top: 0.5rem;
}

.test-section {
  background: var(--white);
  border-radius: 12px;
  padding: 2rem;
  margin-bottom: 2rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.test-section h2 {
  color: var(--ink);
  margin-top: 0;
  margin-bottom: 1.5rem;
  font-size: 1.3rem;
  border-bottom: 2px solid #e5e7eb;
  padding-bottom: 0.75rem;
}

.status-info {
  display: flex;
  align-items: center;
  gap: 2rem;
}

.status-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1rem 1.5rem;
  border-radius: var(--r-card);
  font-weight: 600;
}

.status-item.active {
  background: #d1fae5;
  color: #065f46;
}

.status-item.inactive {
  background: #fee2e2;
  color: #991b1b;
}

.status-item i {
  font-size: 1.5rem;
}

.endpoints-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1.5rem;
}

.endpoint-card {
  background: var(--canvas-lifted);
  border: 2px solid #e5e7eb;
  border-radius: var(--r-card);
  padding: 1.5rem;
  transition: all 0.3s;
}

.endpoint-card:hover {
  border-color: var(--ink);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.15);
}

.endpoint-card h3 {
  margin: 0 0 1rem;
  color: var(--ink);
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 1.05rem;
}

.endpoint-card h3 i {
  color: var(--ink);
  font-size: 1.2rem;
}

.endpoint-card ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.endpoint-card li {
  margin-bottom: 0.75rem;
}

.endpoint-card li:last-child {
  margin-bottom: 0;
}

.endpoint-card a {
  color: var(--ink);
  text-decoration: none;
  font-weight: 500;
  transition: color 0.2s;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
}

.endpoint-card a:hover {
  color: #764ba2;
  text-decoration: underline;
}

.info-box {
  background: #f0f9ff;
  border-left: 4px solid #0284c7;
  padding: 1.5rem;
  border-radius: var(--r-card);
}

.info-box p {
  margin: 0.75rem 0;
  color: #1e40af;
}

.info-box code {
  background: var(--white);
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-family: 'Courier New', monospace;
  color: #dc2626;
}

.btn-primary {
  background: var(--canvas);
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: var(--r-card);
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(102, 126, 234, 0.4);
}

@media (max-width: 768px) {
  .api-test-container {
    padding: 1rem;
  }

  .test-section {
    padding: 1.5rem;
  }

  .endpoints-grid {
    grid-template-columns: 1fr;
  }

  .status-info {
    flex-direction: column;
    align-items: flex-start;
  }
}
</style>

