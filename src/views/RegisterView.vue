<template>
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
          ¡Registro exitoso! Redirigiendo...
        </div>

        <!-- Botón enviar -->
        <button type="submit" class="btn-submit" :disabled="loading">
          <span v-if="!loading">Registrarse</span>
          <span v-else>Registrando...</span>
        </button>

        <!-- Link a login -->
        <div class="login-link">
          ¿Ya tienes cuenta? <router-link to="/login">Inicia sesión aquí</router-link>
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
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 2rem 1rem;
}

.register-card {
  background: white;
  border-radius: 16px;
  padding: 3rem;
  width: 100%;
  max-width: 500px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
}

.register-card h1 {
  text-align: center;
  color: #1f2937;
  margin: 0 0 0.5rem;
  font-size: 1.8rem;
}

.subtitle {
  text-align: center;
  color: #6b7280;
  margin: 0 0 2rem;
  font-size: 0.95rem;
}

.form-group {
  margin-bottom: 1.5rem;
}

.form-group label {
  display: block;
  color: #374151;
  font-weight: 600;
  margin-bottom: 0.5rem;
  font-size: 0.95rem;
}

.form-group input {
  width: 100%;
  padding: 0.75rem 1rem;
  border: 2px solid #e5e7eb;
  border-radius: 8px;
  font-size: 1rem;
  transition: all 0.3s;
  box-sizing: border-box;
}

.form-group input:focus {
  outline: none;
  border-color: #667eea;
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
  color: #6b7280;
  font-size: 1.2rem;
  cursor: pointer;
  padding: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: color 0.2s;
}

.toggle-password:hover {
  color: #667eea;
}

.error-message {
  background: #fee;
  border: 1px solid #fca;
  color: #c33;
  padding: 0.75rem 1rem;
  border-radius: 8px;
  margin-bottom: 1rem;
  font-size: 0.9rem;
}

.success-message {
  background: #efe;
  border: 1px solid #aca;
  color: #3a3;
  padding: 0.75rem 1rem;
  border-radius: 8px;
  margin-bottom: 1rem;
  font-size: 0.9rem;
}

.btn-submit {
  width: 100%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  padding: 0.85rem;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
  margin-bottom: 1rem;
}

.btn-submit:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 10px 25px rgba(102, 126, 234, 0.3);
}

.btn-submit:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.login-link {
  text-align: center;
  color: #6b7280;
  font-size: 0.9rem;
}

.login-link a {
  color: #667eea;
  text-decoration: none;
  font-weight: 600;
  transition: color 0.2s;
}

.login-link a:hover {
  color: #764ba2;
}

@media (max-width: 640px) {
  .register-card {
    padding: 2rem 1.5rem;
  }

  .register-card h1 {
    font-size: 1.5rem;
  }
}
</style>

