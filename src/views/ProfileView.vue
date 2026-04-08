<template>
  <div class="profile-container">
    <div class="profile-card">
      <h1>Mi Perfil</h1>

      <div v-if="isLoading" class="loading">
        Cargando...
      </div>

      <div v-else-if="userInfo" class="user-info">
        <div class="info-group">
          <label>Nombre:</label>
          <p>{{ userInfo.name }}</p>
        </div>

        <div class="info-group">
          <label>Email:</label>
          <p>{{ userInfo.email }}</p>
        </div>

        <div v-if="userInfo.phone" class="info-group">
          <label>Teléfono:</label>
          <p>{{ userInfo.phone }}</p>
        </div>

        <div class="info-group">
          <label>ID de Usuario:</label>
          <p>{{ userInfo.id }}</p>
        </div>

        <!-- Estado de Contraseña -->
        <div v-if="passwordStatus" class="password-status">
          <label>Estado de Contraseña:</label>
          <div class="status-content">
            <div :class="['status-badge', passwordStatus.changeRequired ? 'required' : 'ok']">
              <i :class="passwordStatus.changeRequired ? 'bi bi-exclamation-circle' : 'bi bi-check-circle'"></i>
              {{ passwordStatus.changeRequired ? 'Cambio requerido' : 'Actualizada' }}
            </div>
            <p class="status-text">
              <span v-if="!passwordStatus.changeRequired">
                Días restantes: <strong>{{ passwordStatus.daysRemaining }}</strong> de {{ passwordStatus.expirationDays }}
              </span>
              <span v-else>
                Se requiere cambiar la contraseña urgentemente
              </span>
            </p>
          </div>
        </div>

        <!-- Botones de Acción -->
        <div class="actions">
          <router-link to="/change-password" class="btn btn-primary">
            <i class="bi bi-key"></i>
            Cambiar Contraseña
          </router-link>
          <button @click="handleLogout" class="btn btn-danger">
            <i class="bi bi-box-arrow-right"></i>
            Cerrar sesión
          </button>
        </div>
      </div>

      <div v-else class="error">
        Por favor inicia sesión
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { authService } from '../services/auth';

const router = useRouter();
const userInfo = ref(null);
const passwordStatus = ref(null);
const isLoading = ref(true);

onMounted(async () => {
  if (!authService.isAuthenticated()) {
    router.push('/login');
  } else {
    // Simulación - en producción obtendría los datos de una API
    isLoading.value = false;
    userInfo.value = {
      id: 1,
      name: 'Juan Pérez',
      email: 'juan@example.com',
      phone: '+52 5555551234'
    };

    // Guardar userId para usar después
    localStorage.setItem('userId', userInfo.value.id);

    // Obtener estado de contraseña
    try {
      const response = await authService.getPasswordStatus(userInfo.value.id);
      if (response.data.success) {
        passwordStatus.value = response.data.data;
      }
    } catch (err) {
      console.error('Error al obtener estado de contraseña:', err);
      // Usar valores por defecto
      passwordStatus.value = {
        changeRequired: false,
        daysRemaining: 45,
        expirationDays: 90
      };
    }
  }
});

async function handleLogout() {
  try {
    const { accessToken, refreshToken } = authService.getTokens();
    await authService.logout(accessToken, refreshToken);
  } catch (err) {
    console.error('Error en logout:', err);
  } finally {
    authService.clearTokens();
    router.push('/login');
  }
}
</script>

<style scoped>
.profile-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 2rem 1rem;
}

.profile-card {
  background: white;
  border-radius: 16px;
  padding: 3rem;
  width: 100%;
  max-width: 500px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
}

.profile-card h1 {
  text-align: center;
  color: #1f2937;
  margin: 0 0 2rem;
  font-size: 1.8rem;
}

.loading,
.error {
  text-align: center;
  color: #6b7280;
  padding: 2rem;
}

.error {
  color: #dc2626;
}

.user-info {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.info-group {
  border-bottom: 1px solid #e5e7eb;
  padding-bottom: 1rem;
}

.info-group label {
  display: block;
  color: #6b7280;
  font-size: 0.85rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
}

.info-group p {
  color: #1f2937;
  margin: 0;
  font-size: 1rem;
}

/* Estado de Contraseña */
.password-status {
  background: #f0f9ff;
  border: 2px solid #bfdbfe;
  border-radius: 12px;
  padding: 1rem;
}

.password-status label {
  display: block;
  color: #1e40af;
  font-size: 0.85rem;
  font-weight: 600;
  margin-bottom: 0.75rem;
}

.status-content {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.status-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  border-radius: 8px;
  width: fit-content;
  font-weight: 600;
  font-size: 0.9rem;
}

.status-badge.ok {
  background: #d1fae5;
  color: #065f46;
}

.status-badge.required {
  background: #fee2e2;
  color: #7f1d1d;
}

.status-text {
  color: #1e40af;
  font-size: 0.85rem;
  margin: 0;
}

/* Acciones */
.actions {
  display: flex;
  gap: 1rem;
  flex-direction: column;
  margin-top: 1rem;
  border-top: 1px solid #e5e7eb;
  padding-top: 1rem;
}

.btn {
  padding: 0.85rem;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  text-decoration: none;
  border: none;
  width: 100%;
}

.btn-primary {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 25px rgba(102, 126, 234, 0.3);
}

.btn-danger {
  background: #fee2e2;
  color: #dc2626;
  border: 2px solid #fecaca;
}

.btn-danger:hover {
  background: #fecaca;
  color: #b91c1c;
}

@media (max-width: 640px) {
  .profile-card {
    padding: 2rem 1.5rem;
  }

  .profile-card h1 {
    font-size: 1.5rem;
  }
}
</style>

