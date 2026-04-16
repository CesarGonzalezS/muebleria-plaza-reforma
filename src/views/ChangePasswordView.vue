<template>
  <div class="change-password-container">
    <div class="change-password-card">
      <button @click="goBack" class="back-btn">
        <i class="bi bi-arrow-left"></i> AtrÃ¡s
      </button>

      <h1>Cambiar ContraseÃ±a</h1>
      <p class="subtitle">Actualiza tu contraseÃ±a para mantener tu cuenta segura</p>

      <form @submit.prevent="handleChangePassword">
        <!-- ContraseÃ±a Actual -->
        <div class="form-group">
          <label for="current-password">ContraseÃ±a Actual</label>
          <div class="password-wrapper">
            <input
              v-model="form.currentPassword"
              id="current-password"
              :type="showCurrentPassword ? 'text' : 'password'"
              placeholder="â€¢â€¢â€¢â€¢â€¢â€¢â€¢â€¢"
              required
            />
            <button
              type="button"
              class="toggle-password"
              @click="showCurrentPassword = !showCurrentPassword"
            >
              <i :class="showCurrentPassword ? 'bi bi-eye-slash' : 'bi bi-eye'"></i>
            </button>
          </div>
        </div>

        <!-- Nueva ContraseÃ±a -->
        <div class="form-group">
          <label for="new-password">Nueva ContraseÃ±a</label>
          <div class="password-wrapper">
            <input
              v-model="form.newPassword"
              id="new-password"
              :type="showNewPassword ? 'text' : 'password'"
              placeholder="MÃ­nimo 8 caracteres"
              required
              minlength="8"
            />
            <button
              type="button"
              class="toggle-password"
              @click="showNewPassword = !showNewPassword"
            >
              <i :class="showNewPassword ? 'bi bi-eye-slash' : 'bi bi-eye'"></i>
            </button>
          </div>
        </div>

        <!-- Confirmar Nueva ContraseÃ±a -->
        <div class="form-group">
          <label for="confirm-password">Confirmar Nueva ContraseÃ±a</label>
          <div class="password-wrapper">
            <input
              v-model="form.confirmPassword"
              id="confirm-password"
              :type="showConfirmPassword ? 'text' : 'password'"
              placeholder="â€¢â€¢â€¢â€¢â€¢â€¢â€¢â€¢"
              required
              minlength="8"
            />
            <button
              type="button"
              class="toggle-password"
              @click="showConfirmPassword = !showConfirmPassword"
            >
              <i :class="showConfirmPassword ? 'bi bi-eye-slash' : 'bi bi-eye'"></i>
            </button>
          </div>
        </div>

        <!-- ValidaciÃ³n de fortaleza -->
        <div class="password-strength">
          <span :class="passwordStrength">
            <i :class="strengthIcon"></i>
            {{ strengthText }}
          </span>
        </div>

        <!-- Mensaje de error -->
        <div v-if="error" class="error-message">
          {{ error }}
        </div>

        <!-- Mensaje de Ã©xito -->
        <div v-if="success" class="success-message">
          Â¡ContraseÃ±a actualizada exitosamente!
        </div>

        <!-- Botones -->
        <div class="form-actions">
          <button type="submit" class="btn-submit" :disabled="loading">
            <span v-if="!loading">Actualizar ContraseÃ±a</span>
            <span v-else>Actualizando...</span>
          </button>
          <button type="button" @click="goBack" class="btn-cancel">
            Cancelar
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { authService } from '../services/auth';

const router = useRouter();

const form = ref({
  currentPassword: '',
  newPassword: '',
  confirmPassword: ''
});

const showCurrentPassword = ref(false);
const showNewPassword = ref(false);
const showConfirmPassword = ref(false);
const error = ref('');
const success = ref(false);
const loading = ref(false);

// Calcular fortaleza de contraseÃ±a
const passwordStrength = computed(() => {
  const pwd = form.value.newPassword;
  if (!pwd) return 'strength-empty';

  let strength = 0;
  if (pwd.length >= 8) strength++;
  if (pwd.length >= 12) strength++;
  if (/[A-Z]/.test(pwd)) strength++;
  if (/[a-z]/.test(pwd)) strength++;
  if (/[0-9]/.test(pwd)) strength++;
  if (/[!@#$%^&*]/.test(pwd)) strength++;

  if (strength <= 2) return 'strength-weak';
  if (strength <= 4) return 'strength-medium';
  return 'strength-strong';
});

const strengthIcon = computed(() => {
  if (passwordStrength.value === 'strength-weak') return 'bi bi-exclamation-circle';
  if (passwordStrength.value === 'strength-medium') return 'bi bi-info-circle';
  if (passwordStrength.value === 'strength-strong') return 'bi bi-check-circle';
  return 'bi bi-dash-circle';
});

const strengthText = computed(() => {
  if (passwordStrength.value === 'strength-weak') return 'DÃ©bil';
  if (passwordStrength.value === 'strength-medium') return 'Media';
  if (passwordStrength.value === 'strength-strong') return 'Fuerte';
  return '';
});

function goBack() {
  router.back();
}

async function handleChangePassword() {
  error.value = '';
  success.value = false;

  // Validaciones
  if (form.value.currentPassword === form.value.newPassword) {
    error.value = 'La nueva contraseÃ±a debe ser diferente a la actual';
    return;
  }

  if (form.value.newPassword !== form.value.confirmPassword) {
    error.value = 'Las contraseÃ±as no coinciden';
    return;
  }

  if (form.value.newPassword.length < 8) {
    error.value = 'La contraseÃ±a debe tener mÃ­nimo 8 caracteres';
    return;
  }

  loading.value = true;

  try {
    // Obtener userId del localStorage o de la API
    const userId = localStorage.getItem('userId') || '1';

    await authService.changePassword(
      userId,
      form.value.currentPassword,
      form.value.newPassword
    );

    success.value = true;

    // Limpiar formulario
    form.value = {
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    };

    // Redirigir despuÃ©s de 2 segundos
    setTimeout(() => {
      router.push('/profile');
    }, 2000);
  } catch (err) {
    error.value = err.response?.data?.message || 'Error al cambiar la contraseÃ±a. Intenta de nuevo.';
  } finally {
    loading.value = false;
  }
}
</script>

<style scoped>
.change-password-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--canvas);
  padding: 2rem 1rem;
}

.change-password-card {
  background: var(--white);
  border-radius: 16px;
  padding: 3rem;
  width: 100%;
  max-width: 500px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
  position: relative;
}

.back-btn {
  position: absolute;
  top: 1.5rem;
  left: 1.5rem;
  background: var(--canvas);
  border: none;
  padding: 0.5rem 1rem;
  border-radius: var(--r-card);
  color: var(--slate);
  cursor: pointer;
  transition: all 0.3s;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-weight: 600;
  font-size: 0.9rem;
}

.back-btn:hover {
  background: #e5e7eb;
  color: var(--ink);
}

.change-password-card h1 {
  text-align: center;
  color: var(--ink);
  margin: 0 0 0.5rem;
  font-size: 1.8rem;
}

.subtitle {
  text-align: center;
  color: var(--slate);
  margin: 0 0 2rem;
  font-size: 0.95rem;
}

.form-group {
  margin-bottom: 1.5rem;
}

.form-group label {
  display: block;
  color: var(--charcoal);
  font-weight: 600;
  margin-bottom: 0.5rem;
  font-size: 0.95rem;
}

.form-group input {
  width: 100%;
  padding: 0.75rem 1rem;
  border: 2px solid #e5e7eb;
  border-radius: var(--r-card);
  font-size: 1rem;
  transition: all 0.3s;
  box-sizing: border-box;
}

.form-group input:focus {
  outline: none;
  border-color: var(--ink);
  box-shadow: 0 0 0 4px rgba(102, 126, 234, 0.1);
}

.password-wrapper {
  position: relative;
  display: flex;
  align-items: center;
}

.password-wrapper input {
  padding-right: 3rem;
}

.toggle-password {
  position: absolute;
  right: 0.75rem;
  background: transparent;
  border: none;
  color: var(--slate);
  font-size: 1.2rem;
  cursor: pointer;
  padding: 0.5rem;
  transition: color 0.2s;
}

.toggle-password:hover {
  color: var(--ink);
}

.password-strength {
  margin-bottom: 1.5rem;
  font-size: 0.9rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.strength-empty {
  color: #9ca3af;
}

.strength-weak {
  color: #dc2626;
}

.strength-medium {
  color: #f59e0b;
}

.strength-strong {
  color: #10b981;
}

.error-message {
  background: #fee;
  border: 1px solid #fca;
  color: #c33;
  padding: 0.75rem 1rem;
  border-radius: var(--r-card);
  margin-bottom: 1rem;
  font-size: 0.9rem;
}

.success-message {
  background: #efe;
  border: 1px solid #aca;
  color: #3a3;
  padding: 0.75rem 1rem;
  border-radius: var(--r-card);
  margin-bottom: 1rem;
  font-size: 0.9rem;
}

.form-actions {
  display: flex;
  gap: 1rem;
  margin-top: 2rem;
}

.btn-submit,
.btn-cancel {
  flex: 1;
  padding: 0.85rem;
  border-radius: var(--r-card);
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
  border: none;
}

.btn-submit {
  background: var(--canvas);
  color: white;
}

.btn-submit:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 10px 25px rgba(102, 126, 234, 0.3);
}

.btn-submit:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.btn-cancel {
  background: var(--canvas);
  color: var(--slate);
}

.btn-cancel:hover {
  background: #e5e7eb;
}

@media (max-width: 640px) {
  .change-password-card {
    padding: 2rem 1.5rem;
  }

  .back-btn {
    top: 1rem;
    left: 1rem;
  }
}
</style>

