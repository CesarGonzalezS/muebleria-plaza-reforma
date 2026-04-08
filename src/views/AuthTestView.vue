<template>
  <div class="quick-test-container">
    <div class="test-card">
      <h1>🧪 Test Rápido de Autenticación</h1>

      <div class="test-section">
        <h2>Estado de Autenticación</h2>
        <div :class="['status-box', isAuth ? 'authenticated' : 'not-authenticated']">
          <i :class="isAuth ? 'bi bi-shield-check' : 'bi bi-shield-dash'"></i>
          <span>{{ isAuth ? '✓ Autenticado' : '✗ No autenticado' }}</span>
        </div>
      </div>

      <div class="test-section">
        <h2>Información Almacenada</h2>
        <div class="info-box">
          <div class="info-item">
            <strong>AccessToken:</strong>
            <code v-if="accessToken">{{ accessToken.substring(0, 20) }}...</code>
            <code v-else class="empty">No disponible</code>
          </div>
          <div class="info-item">
            <strong>RefreshToken:</strong>
            <code v-if="refreshToken">{{ refreshToken.substring(0, 20) }}...</code>
            <code v-else class="empty">No disponible</code>
          </div>
          <div class="info-item">
            <strong>UserId:</strong>
            <code>{{ userId || 'No disponible' }}</code>
          </div>
        </div>
      </div>

      <div class="test-section">
        <h2>Enlaces Rápidos</h2>
        <div class="link-grid">
          <router-link to="/login" class="link-btn">
            <i class="bi bi-box-arrow-in-right"></i> Login
          </router-link>
          <router-link to="/register" class="link-btn">
            <i class="bi bi-person-plus"></i> Registro
          </router-link>
          <router-link to="/forgot-password" class="link-btn">
            <i class="bi bi-key"></i> Olvide Contraseña
          </router-link>
          <router-link to="/reset-password" class="link-btn">
            <i class="bi bi-arrow-clockwise"></i> Reset Pass
          </router-link>
          <router-link v-if="isAuth" to="/profile" class="link-btn">
            <i class="bi bi-person-circle"></i> Perfil
          </router-link>
          <router-link v-if="isAuth" to="/change-password" class="link-btn">
            <i class="bi bi-pencil-square"></i> Cambiar Pass
          </router-link>
          <button v-if="isAuth" @click="logout" class="link-btn logout">
            <i class="bi bi-box-arrow-right"></i> Logout
          </button>
        </div>
      </div>

      <div class="test-section">
        <h2>APIs Implementadas</h2>
        <div class="api-list">
          <div class="api-item">
            <span class="method post">POST</span>
            <span class="endpoint">/api/auth/register</span>
          </div>
          <div class="api-item">
            <span class="method post">POST</span>
            <span class="endpoint">/api/auth/login</span>
          </div>
          <div class="api-item">
            <span class="method post">POST</span>
            <span class="endpoint">/api/auth/logout</span>
          </div>
          <div class="api-item">
            <span class="method post">POST</span>
            <span class="endpoint">/api/auth/refresh</span>
          </div>
          <div class="api-item">
            <span class="method put">PUT</span>
            <span class="endpoint">/api/auth/change-password?userId=1</span>
          </div>
          <div class="api-item">
            <span class="method get">GET</span>
            <span class="endpoint">/api/auth/password-status/{userId}</span>
          </div>
          <div class="api-item">
            <span class="method post">POST</span>
            <span class="endpoint">/api/auth/forgot-password?email=user@example.com</span>
          </div>
          <div class="api-item">
            <span class="method post">POST</span>
            <span class="endpoint">/api/auth/validate-reset-token?token=...</span>
          </div>
          <div class="api-item">
            <span class="method post">POST</span>
            <span class="endpoint">/api/auth/reset-password</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRouter } from 'vue-router';
import { authService } from '../services/auth';

const router = useRouter();

const accessToken = ref('');
const refreshToken = ref('');
const userId = ref('');

const isAuth = computed(() => authService.isAuthenticated());

onMounted(() => {
  const tokens = authService.getTokens();
  accessToken.value = tokens.accessToken;
  refreshToken.value = tokens.refreshToken;
  userId.value = localStorage.getItem('userId');
});

async function logout() {
  try {
    const tokens = authService.getTokens();
    await authService.logout(tokens.accessToken, tokens.refreshToken);
  } catch (err) {
    console.error('Error en logout:', err);
  } finally {
    authService.clearTokens();
    accessToken.value = '';
    refreshToken.value = '';
    userId.value = '';
    router.push('/login');
  }
}
</script>

<style scoped>
.quick-test-container {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 2rem 1rem;
}

.test-card {
  max-width: 900px;
  margin: 0 auto;
  background: white;
  border-radius: 16px;
  padding: 2rem;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
}

.test-card h1 {
  text-align: center;
  color: #1f2937;
  margin-bottom: 2rem;
  font-size: 2rem;
}

.test-section {
  margin-bottom: 2rem;
  padding-bottom: 2rem;
  border-bottom: 1px solid #e5e7eb;
}

.test-section:last-child {
  border-bottom: none;
}

.test-section h2 {
  color: #374151;
  font-size: 1.25rem;
  margin-bottom: 1rem;
}

/* Status Box */
.status-box {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1.5rem;
  border-radius: 12px;
  font-weight: 600;
  font-size: 1.1rem;
}

.status-box.authenticated {
  background: #d1fae5;
  color: #065f46;
  border: 2px solid #6ee7b7;
}

.status-box.not-authenticated {
  background: #fee2e2;
  color: #7f1d1d;
  border: 2px solid #fecaca;
}

.status-box i {
  font-size: 1.5rem;
}

/* Info Box */
.info-box {
  background: #f9fafb;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  padding: 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.info-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem;
  background: white;
  border-radius: 8px;
}

.info-item strong {
  color: #374151;
  min-width: 120px;
}

.info-item code {
  background: #f3f4f6;
  padding: 0.5rem 0.75rem;
  border-radius: 6px;
  font-size: 0.85rem;
  color: #667eea;
  font-family: 'Courier New', monospace;
  word-break: break-all;
}

.info-item code.empty {
  color: #9ca3af;
}

/* Link Grid */
.link-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 1rem;
}

.link-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.75rem 1rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 8px;
  text-decoration: none;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
}

.link-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 25px rgba(102, 126, 234, 0.3);
}

.link-btn.logout {
  background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
}

.link-btn.logout:hover {
  box-shadow: 0 10px 25px rgba(239, 68, 68, 0.3);
}

/* API List */
.api-list {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.api-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 0.75rem 1rem;
  background: #f9fafb;
  border-left: 4px solid #667eea;
  border-radius: 8px;
}

.method {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 50px;
  padding: 0.25rem 0.5rem;
  border-radius: 6px;
  font-size: 0.75rem;
  font-weight: 700;
  color: white;
}

.method.post {
  background: #3b82f6;
}

.method.get {
  background: #10b981;
}

.method.put {
  background: #f59e0b;
}

.endpoint {
  font-family: 'Courier New', monospace;
  color: #667eea;
  font-weight: 600;
  font-size: 0.9rem;
  flex: 1;
  word-break: break-all;
}

@media (max-width: 768px) {
  .test-card {
    padding: 1.5rem;
  }

  .test-card h1 {
    font-size: 1.5rem;
  }

  .link-grid {
    grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  }

  .info-item {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.5rem;
  }
}
</style>

