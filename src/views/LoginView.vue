<template>
  <div class="login-container">

    <!-- Logo o Título principal -->
    <div class="login-brand" v-if="!resetStep">
      <div class="brand-icon">
        <i class="bi bi-shop"></i>
      </div>
      <h1>Mueblería Plaza Reforma</h1>
      <p>Panel de Administración</p>
    </div>

    <form v-if="!resetStep" class="login-form" @submit.prevent="handleLogin">
      <div class="form-header">
        <h2>Iniciar sesión</h2>
        <p>Ingresa tus credenciales para continuar</p>
      </div>

      <div class="form-body">
        <div class="form-group">
          <label for="email">
            <i class="bi bi-envelope"></i>
            Correo electrónico
          </label>
          <input
            v-model="email"
            id="email"
            type="email"
            placeholder="tu@email.com"
            required
            autocomplete="username"
          />
        </div>

        <div class="form-group">
          <label for="password">
            <i class="bi bi-lock"></i>
            Contraseña
          </label>
          <div class="password-wrapper">
            <input
              v-model="password"
              id="password"
              :type="showPassword ? 'text' : 'password'"
              placeholder="••••••••"
              required
              autocomplete="current-password"
            />
            <button
              type="button"
              class="toggle-password"
              @click="showPassword = !showPassword"
              tabindex="-1"
            >
              <i :class="showPassword ? 'bi bi-eye-slash' : 'bi bi-eye'"></i>
            </button>
          </div>
        </div>

        <Transition name="error">
          <div v-if="error" class="login-error">
            <i class="bi bi-exclamation-circle"></i>
            {{ error }}
          </div>
        </Transition>

        <button type="submit" class="btn-primary" :disabled="loading">
          <span v-if="!loading">
            <i class="bi bi-box-arrow-in-right"></i>
            Entrar
          </span>
          <span v-else class="loading-spinner">
            <i class="bi bi-arrow-repeat spin"></i>
            Ingresando...
          </span>
        </button>

        <button type="button" class="reset-password-btn" @click="startResetPassword">
          <i class="bi bi-question-circle"></i>
          ¿Olvidaste tu contraseña?
        </button>

        <div class="register-link">
          ¿No tienes cuenta? <router-link to="/register">Regístrate aquí</router-link>
        </div>
      </div>
    </form>

    <form v-else-if="resetStep === 1" class="login-form" @submit.prevent="requestReset">
      <button type="button" class="back-btn" @click="resetStep = 0">
        <i class="bi bi-arrow-left"></i>
      </button>

      <div class="form-header">
        <div class="icon-circle">
          <i class="bi bi-key"></i>
        </div>
        <h2>Restablecer contraseña</h2>
        <p>Ingresa tu correo para recibir el código</p>
      </div>

      <div class="form-body">
        <div class="form-group">
          <label for="reset-email">
            <i class="bi bi-envelope"></i>
            Correo electrónico
          </label>
          <input
            v-model="email"
            id="reset-email"
            type="email"
            placeholder="tu@email.com"
            required
          />
        </div>

        <Transition name="error">
          <div v-if="error" class="login-error">
            <i class="bi bi-exclamation-circle"></i>
            {{ error }}
          </div>
        </Transition>

        <button type="submit" class="btn-primary" :disabled="loading">
          <span v-if="!loading">
            <i class="bi bi-send"></i>
            Enviar código
          </span>
          <span v-else class="loading-spinner">
            <i class="bi bi-arrow-repeat spin"></i>
            Enviando...
          </span>
        </button>
      </div>
    </form>

    <form v-else-if="resetStep === 2" class="login-form" @submit.prevent="verifyCode">
      <button type="button" class="back-btn" @click="resetStep = 1">
        <i class="bi bi-arrow-left"></i>
      </button>

      <div class="form-header">
        <div class="icon-circle">
          <i class="bi bi-shield-check"></i>
        </div>
        <h2>Verificar código</h2>
        <p>Revisa tu correo e ingresa el código</p>
      </div>

      <div class="form-body">
        <div class="form-group">
          <label for="code">
            <i class="bi bi-123"></i>
            Código de verificación
          </label>
          <input
            v-model="code"
            id="code"
            type="text"
            placeholder="000000"
            required
            class="code-input"
          />
        </div>

        <Transition name="error">
          <div v-if="error" class="login-error">
            <i class="bi bi-exclamation-circle"></i>
            {{ error }}
          </div>
        </Transition>

        <button type="submit" class="btn-primary" :disabled="loading">
          <span v-if="!loading">
            <i class="bi bi-check-circle"></i>
            Verificar
          </span>
          <span v-else class="loading-spinner">
            <i class="bi bi-arrow-repeat spin"></i>
            Verificando...
          </span>
        </button>
      </div>
    </form>

    <form v-else-if="resetStep === 3" class="login-form" @submit.prevent="resetPassword">
      <div class="form-header">
        <div class="icon-circle success">
          <i class="bi bi-lock-fill"></i>
        </div>
        <h2>Nueva contraseña</h2>
        <p>Crea una contraseña segura</p>
      </div>

      <div class="form-body">
        <div class="form-group">
          <label for="new-password">
            <i class="bi bi-shield-lock"></i>
            Nueva contraseña
          </label>
          <div class="password-wrapper">
            <input
              v-model="newPassword"
              id="new-password"
              :type="showPassword ? 'text' : 'password'"
              placeholder="••••••••"
              required
              minlength="6"
            />
            <button
              type="button"
              class="toggle-password"
              @click="showPassword = !showPassword"
              tabindex="-1"
            >
              <i :class="showPassword ? 'bi bi-eye-slash' : 'bi bi-eye'"></i>
            </button>
          </div>
          <small class="help-text">Mínimo 6 caracteres</small>
        </div>

        <Transition name="error">
          <div v-if="error" class="login-error">
            <i class="bi bi-exclamation-circle"></i>
            {{ error }}
          </div>
        </Transition>

        <button type="submit" class="btn-primary" :disabled="loading">
          <span v-if="!loading">
            <i class="bi bi-check-circle"></i>
            Restablecer
          </span>
          <span v-else class="loading-spinner">
            <i class="bi bi-arrow-repeat spin"></i>
            Procesando...
          </span>
        </button>
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { authService } from '../services/auth';

const email = ref('');
const password = ref('');
const code = ref('');
const newPassword = ref('');
const error = ref('');
const loading = ref(false);
const resetStep = ref(0);
const showPassword = ref(false);
const router = useRouter();

async function handleLogin() {
  error.value = '';
  loading.value = true;
  try {
    console.log('🔐 Iniciando login...');
    const res = await authService.login(email.value, password.value);
    console.log('✅ Respuesta del login:', res.data);

    if (res.data.success && res.data.data) {
      const { accessToken, refreshToken } = res.data.data;
      console.log('🔑 Tokens recibidos:', { accessToken: accessToken?.substring(0, 20) + '...', refreshToken: refreshToken?.substring(0, 20) + '...' });

      authService.setTokens(accessToken, refreshToken);
      console.log('💾 Tokens guardados en localStorage');

      // Verificar que se guardaron
      const savedToken = localStorage.getItem('accessToken');
      console.log('✔️ Token guardado verificado:', savedToken ? 'SÍ' : 'NO');

      // Pequeño retraso para asegurar que el token esté guardado
      await new Promise(resolve => setTimeout(resolve, 100));

      console.log('🔄 Redirigiendo a /admin...');
      // Redirigir a admin o home
      router.push('/admin');
    } else {
      console.warn('❌ Respuesta sin éxito:', res.data);
      error.value = 'Credenciales incorrectas';
    }
  } catch (e) {
    console.error('❌ Error en login:', e);
    error.value = e.response?.data?.message || 'Usuario o contraseña incorrectos';
  } finally {
    loading.value = false;
  }
}

function handleForgotPassword() {
  router.push('/forgot-password');
}

function startResetPassword() {
  resetStep.value = 1;
  error.value = '';
}

async function requestReset() {
  error.value = '';
  loading.value = true;
  try {
    await axios.doPost('/request-reset', { email: email.value });
    resetStep.value = 2;
  } catch (e) {
    error.value = 'Error al enviar el código de verificación';
  } finally {
    loading.value = false;
  }
}

async function verifyCode() {
  error.value = '';
  loading.value = true;
  try {
    await axios.doPost('/verify-code', { email: email.value, code: code.value });
    resetStep.value = 3;
  } catch (e) {
    error.value = 'Código de verificación incorrecto';
  } finally {
    loading.value = false;
  }
}

async function resetPassword() {
  error.value = '';
  loading.value = true;
  try {
    await axios.doPost('/reset-password', { email: email.value, code: code.value, new_password: newPassword.value });
    resetStep.value = 0;
    alert('Contraseña restablecida con éxito');
  } catch (e) {
    error.value = 'Error al restablecer la contraseña';
  } finally {
    loading.value = false;
  }
}
</script>

<style scoped>
.login-container {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: #f5f5f4;
  padding: 2rem 1rem;
}

.login-brand {
  text-align: center;
  margin-bottom: 1.5rem;
}

.brand-icon {
  width: 52px;
  height: 52px;
  margin: 0 auto 0.75rem;
  background: #111827;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  color: #fff;
}

.login-brand h1 {
  font-size: 1.25rem;
  font-weight: 700;
  margin: 0 0 0.25rem;
  color: #111827;
}

.login-brand p {
  font-size: 0.875rem;
  color: #6b7280;
  margin: 0;
}

.login-form {
  background: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  padding: 2rem;
  min-width: 320px;
  max-width: 400px;
  width: 100%;
  position: relative;
}

.form-header {
  margin-bottom: 1.5rem;
}

.icon-circle {
  width: 44px;
  height: 44px;
  margin: 0 auto 0.75rem;
  background: #111827;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.25rem;
  color: white;
}

.icon-circle.success {
  background: #16a34a;
}

.form-header h2 {
  color: #111827;
  font-weight: 700;
  margin: 0 0 0.25rem;
  font-size: 1.125rem;
  text-align: center;
}

.form-header p {
  color: #6b7280;
  margin: 0;
  font-size: 0.875rem;
  text-align: center;
}

.back-btn {
  position: absolute;
  top: 1rem;
  left: 1rem;
  background: #f3f4f6;
  border: 1px solid #e5e7eb;
  width: 34px;
  height: 34px;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: #6b7280;
  font-size: 1rem;
  transition: background 0.15s;
}
.back-btn:hover { background: #e5e7eb; color: #111827; }

.form-body {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.375rem;
}

.form-group label {
  display: flex;
  align-items: center;
  gap: 0.375rem;
  color: #374151;
  font-weight: 500;
  font-size: 0.875rem;
}

.form-group label i { color: #6b7280; }

.form-group input {
  width: 100%;
  padding: 0.625rem 0.75rem;
  border: 1px solid #e5e7eb;
  border-radius: 6px;
  font-size: 0.875rem;
  background: #fff;
  color: #111827;
  transition: border-color 0.15s;
  box-sizing: border-box;
  font-family: inherit;
}

.form-group input:focus {
  border-color: #111827;
  outline: none;
}

.form-group input::placeholder { color: #9ca3af; }

.password-wrapper {
  position: relative;
  display: flex;
  align-items: center;
}

.password-wrapper input { padding-right: 2.75rem; }

.toggle-password {
  position: absolute;
  right: 0.625rem;
  background: transparent;
  border: none;
  color: #9ca3af;
  font-size: 1rem;
  cursor: pointer;
  padding: 0.375rem;
  display: flex;
  align-items: center;
  transition: color 0.15s;
}
.toggle-password:hover { color: #374151; }

.code-input {
  text-align: center;
  font-size: 1.25rem !important;
  letter-spacing: 0.375rem;
  font-weight: 600;
}

.help-text {
  color: #6b7280;
  font-size: 0.8125rem;
}

.btn-primary {
  width: 100%;
  background: #111827;
  color: #fff;
  font-weight: 600;
  border: none;
  border-radius: 6px;
  padding: 0.625rem 1rem;
  font-size: 0.875rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.375rem;
  transition: background 0.15s;
  font-family: inherit;
}
.btn-primary:hover:not(:disabled) { background: #374151; }
.btn-primary:disabled { background: #9ca3af; cursor: not-allowed; }

.loading-spinner {
  display: flex;
  align-items: center;
  gap: 0.375rem;
}

.spin { animation: spin-anim 0.8s linear infinite; }
@keyframes spin-anim { to { transform: rotate(360deg); } }

.login-error {
  background: #fee2e2;
  border: 1px solid #fca5a5;
  color: #dc2626;
  padding: 0.625rem 0.75rem;
  border-radius: 6px;
  font-size: 0.875rem;
  display: flex;
  align-items: center;
  gap: 0.375rem;
  font-weight: 500;
}

.error-enter-active, .error-leave-active { transition: opacity 0.2s; }
.error-enter-from, .error-leave-to { opacity: 0; }

.reset-password-btn {
  background: transparent;
  border: none;
  color: #6b7280;
  text-align: center;
  cursor: pointer;
  padding: 0.375rem;
  font-weight: 500;
  font-size: 0.875rem;
  transition: color 0.15s;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.375rem;
  border-radius: 6px;
  font-family: inherit;
}
.reset-password-btn:hover { color: #111827; }

.register-link {
  text-align: center;
  color: #6b7280;
  font-size: 0.875rem;
}

.register-link a {
  color: #111827;
  text-decoration: none;
  font-weight: 600;
}
.register-link a:hover { text-decoration: underline; }

@media (max-width: 480px) {
  .login-form { padding: 1.5rem; min-width: 0; }
}
</style>
