¯»¿<template>
  <div class="register-container">
    <div class="register-card">
      <h1>Crear Cuenta</h1>
      <p class="subtitle">Completa el formulario para registrarte</p>

      <form @submit.prevent="handleRegister">
        <!-- Nombre -->
        <div class="form-group">
          <label for="name">Nombre Completo</label>
          <input
            v-model="form.name"
            id="name"
            type="text"
            placeholder="Juan Pérez"
            required
          />
        </div>

        <!-- Email -->
        <div class="form-group">
          <label for="email">Correo Electrónico</label>
          <input
            v-model="form.email"
            id="email"
            type="email"
            placeholder="juan@example.com"
            required
          />
        </div>

        <!-- Teléfono -->
        <div class="form-group">
          <label for="phone">Teléfono (Opcional)</label>
          <input
            v-model="form.phone"
            id="phone"
            type="tel"
            placeholder="+52 5555551234"
          />
        </div>

        <!-- Contraseña -->
        <div class="form-group">
          <label for="password">Contraseña</label>
          <div class="password-wrapper">
            <input
              v-model="form.password"
              id="password"
              :type="showPassword ? 'text' : 'password'"
              placeholder="Mínimo 8 caracteres"
              required
              minlength="8"
            />
            <button
              type="button"
              class="toggle-password"
              @click="showPassword = !showPassword"
            >
              <i :class="showPassword ? 'bi bi-eye-slash' : 'bi bi-eye'"></i>
            </button>
          </div>
        </div>

        <!-- Confirmar Contraseña -->
        <div class="form-group">
          <label for="password-confirm">Confirmar Contraseña</label>
          <div class="password-wrapper">
            <input
              v-model="form.passwordConfirm"
              id="password-confirm"
              :type="showPasswordConfirm ? 'text' : 'password'"
              placeholder="Confirma tu contraseña"
              required
              minlength="8"
            />
            <button
              type="button"
              class="toggle-password"
              @click="showPasswordConfirm = !showPasswordConfirm"
            >
              <i :class="showPasswordConfirm ? 'bi bi-eye-slash' : 'bi bi-eye'"></i>
            </button>
          </div>
        </div>

        <!-- Mensaje de error -->
        <div v-if="error" class="error-message">
          {{ error }}
        </div>

        <!-- Mensaje de éxito -->
        <div v-if="success" class="success-message">
          ¡Registro exitoso! Redirigiendo...
        </div>

        <!-- Botón enviar -->
        <button type="submit" class="btn-submit" :disabled="loading">
          <span v-if="!loading">Registrarse</span>
          <span v-else>Registrando...</span>
        </button>

        <!-- Link a login -->
        <div class="login-link">
          ¿Ya tienes cuenta? <router-link to="/login">Inicia sesión aquí</router-link>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { authService } from '../services/auth';

const router = useRouter();

const form = ref({
  name: '',
  email: '',
  phone: '',
  password: '',
  passwordConfirm: ''
});

const showPassword = ref(false);
const showPasswordConfirm = ref(false);
const error = ref('');
const success = ref(false);
const loading = ref(false);

async function handleRegister() {
  error.value = '';
  success.value = false;

  // Validar que las contraseñas coincidan
  if (form.value.password !== form.value.passwordConfirm) {
    error.value = 'Las contraseñas no coinciden';
    return;
  }

  // Validar longitud de contraseña
  if (form.value.password.length < 8) {
    error.value = 'La contraseña debe tener mínimo 8 caracteres';
    return;
  }

  loading.value = true;

  try {
    const response = await authService.register({
      name: form.value.name,
      email: form.value.email,
      phone: form.value.phone || null,
      password: form.value.password
    });

    if (response.data.success) {
      success.value = true;
      setTimeout(() => {
        router.push('/login');
      }, 1500);
    }
  } catch (err) {
    error.value = err.response?.data?.message || 'Error al registrarse. Por favor intenta de nuevo.';
  } finally {
    loading.value = false;
  }
}
</script>

<style scoped>
.register-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--canvas);
  padding: var(--s4) var(--s3);
}

.register-card {
  background: var(--white);
  border: 1px solid var(--border);
  border-radius: var(--r-hero);
  padding: var(--s4);
  width: 100%;
  max-width: 480px;
  box-shadow: var(--shadow-sm);
}

.register-card h1 {
  text-align: center;
  font-size: 1.125rem;
  font-weight: 600;
  letter-spacing: -0.02em;
  color: var(--ink);
  margin: 0 0 4px;
}

.subtitle {
  text-align: center;
  color: var(--slate);
  margin: 0 0 var(--s3);
  font-size: 0.8125rem;
}

.form-group {
  margin-bottom: var(--s2);
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.form-group label {
  display: block;
  color: var(--charcoal);
  font-weight: 500;
  font-size: 0.8125rem;
}

.form-group input {
  width: 100%;
  padding: 10px 14px;
  border: 1px solid var(--dust);
  border-radius: 10px;
  font-size: 0.9375rem;
  font-family: var(--font);
  color: var(--ink);
  background: var(--canvas-lifted);
  transition: border-color 0.15s;
  outline: none;
  box-sizing: border-box;
}

.form-group input:focus { border-color: var(--ink); background: var(--white); }
.form-group input::placeholder { color: var(--dust); }

.password-wrapper { position: relative; display: flex; align-items: center; }
.password-wrapper input { padding-right: 2.5rem; }

.toggle-password {
  position: absolute;
  right: 10px;
  background: transparent;
  border: none;
  color: var(--slate);
  font-size: 0.875rem;
  cursor: pointer;
  padding: 4px;
  display: flex;
  align-items: center;
}
.toggle-password:hover { color: var(--ink); }

.error-message {
  background: #fef2f2;
  border: 1px solid #fecaca;
  color: #dc2626;
  padding: 10px 14px;
  border-radius: 10px;
  margin-bottom: var(--s2);
  font-size: 0.8125rem;
}

.success-message {
  background: #f0fdf4;
  border: 1px solid #bbf7d0;
  color: #16a34a;
  padding: 10px 14px;
  border-radius: 10px;
  margin-bottom: var(--s2);
  font-size: 0.8125rem;
}

.btn-submit {
  width: 100%;
  background: var(--ink);
  color: var(--canvas);
  border: 1.5px solid var(--ink);
  padding: 10px 24px;
  border-radius: var(--r-btn);
  font-size: 0.9375rem;
  font-weight: 500;
  font-family: var(--font);
  letter-spacing: -0.02em;
  cursor: pointer;
  transition: opacity 0.15s;
  margin-bottom: var(--s2);
}
.btn-submit:hover:not(:disabled) { opacity: 0.85; }
.btn-submit:disabled { opacity: 0.5; cursor: not-allowed; }

.login-link {
  text-align: center;
  color: var(--slate);
  font-size: 0.8125rem;
}
.login-link a { color: var(--ink); font-weight: 500; text-decoration: underline; text-underline-offset: 2px; }

@media (max-width: 480px) {
  .register-card { padding: var(--s3); border-radius: var(--r-card); }
}
</style>
