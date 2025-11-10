<template>
  <div class="login-container">
    <!-- Decoración de fondo -->
    <div class="background-decoration">
      <div class="shape shape-1"></div>
      <div class="shape shape-2"></div>
      <div class="shape shape-3"></div>
    </div>

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
import axios from '../config/AxiosConfig';
import { useRouter } from 'vue-router';

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
    const res = await axios.doPost('/login', { email: email.value, password: password.value });
    if (res.data && (res.data.token || res.data.access_token)) {
      localStorage.setItem('token', res.data.token || res.data.access_token);
      localStorage.setItem('role', 'admin'); // Simulate admin role for testing

      if ('admin' === 'admin') {
        router.push('/admin'); // Redirect admin users to admin dashboard
      } else {
        router.push('/'); // Redirect other users to home page
      }
    } else {
      error.value = 'Credenciales incorrectas';
    }
  } catch (e) {
    error.value = 'Usuario o contraseña incorrectos';
  } finally {
    loading.value = false;
  }
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
/* Variables y reset */
:root {
  --primary: #860734;
  --primary-light: #a91d4d;
  --primary-dark: #5d0524;
}

/* Container principal con diseño mejorado */
.login-container {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 2rem 1rem;
  position: relative;
  overflow: hidden;
}

/* Decoración de fondo animada */
.background-decoration {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  overflow: hidden;
  z-index: 0;
}

.shape {
  position: absolute;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(20px);
  animation: float 20s infinite ease-in-out;
}

.shape-1 {
  width: 300px;
  height: 300px;
  top: -100px;
  left: -100px;
  animation-delay: 0s;
}

.shape-2 {
  width: 200px;
  height: 200px;
  bottom: -50px;
  right: -50px;
  animation-delay: 3s;
}

.shape-3 {
  width: 150px;
  height: 150px;
  top: 50%;
  right: 10%;
  animation-delay: 6s;
}

@keyframes float {
  0%, 100% { transform: translateY(0) rotate(0deg); }
  50% { transform: translateY(-30px) rotate(10deg); }
}

/* Branding */
.login-brand {
  text-align: center;
  color: white;
  margin-bottom: 2rem;
  z-index: 1;
  animation: fadeInDown 0.6s ease;
}

.brand-icon {
  width: 80px;
  height: 80px;
  margin: 0 auto 1rem;
  background: rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(10px);
  border-radius: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2.5rem;
  border: 2px solid rgba(255, 255, 255, 0.3);
}

.login-brand h1 {
  font-size: clamp(1.5rem, 4vw, 2rem);
  font-weight: 700;
  margin: 0 0 0.5rem;
  text-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
}

.login-brand p {
  font-size: 1rem;
  opacity: 0.9;
  margin: 0;
}

/* Formulario con glassmorphism */
.login-form {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  padding: 2.5rem;
  border-radius: 24px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  min-width: 320px;
  max-width: 440px;
  width: 100%;
  position: relative;
  z-index: 1;
  border: 1px solid rgba(255, 255, 255, 0.3);
  animation: fadeInUp 0.6s ease;
}

@keyframes fadeInDown {
  from {
    opacity: 0;
    transform: translateY(-30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Header del formulario */
.form-header {
  text-align: center;
  margin-bottom: 2rem;
}

.icon-circle {
  width: 70px;
  height: 70px;
  margin: 0 auto 1rem;
  background: linear-gradient(135deg, var(--primary), var(--primary-light));
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2rem;
  color: white;
  box-shadow: 0 10px 30px rgba(134, 7, 52, 0.3);
}

.icon-circle.success {
  background: linear-gradient(135deg, #10b981, #34d399);
}

.form-header h2 {
  color: #1f2937;
  font-weight: 700;
  margin: 0 0 0.5rem;
  font-size: clamp(1.5rem, 4vw, 1.8rem);
}

.form-header p {
  color: #6b7280;
  margin: 0;
  font-size: 0.95rem;
}

/* Botón de volver */
.back-btn {
  position: absolute;
  top: 1rem;
  left: 1rem;
  background: #f3f4f6;
  border: none;
  width: 40px;
  height: 40px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s;
  color: #6b7280;
  font-size: 1.2rem;
}

.back-btn:hover {
  background: #e5e7eb;
  color: var(--primary);
  transform: translateX(-3px);
}

/* Form groups */
.form-body {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.form-group label {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #374151;
  font-weight: 600;
  font-size: 0.95rem;
}

.form-group label i {
  color: var(--primary);
  font-size: 1.1rem;
}

.form-group input {
  width: 100%;
  padding: 0.875rem 1rem;
  border: 2px solid #e5e7eb;
  border-radius: 12px;
  font-size: 1rem;
  transition: all 0.3s;
  background: white;
  color: #1f2937;
}

.form-group input:focus {
  border-color: var(--primary);
  outline: none;
  box-shadow: 0 0 0 4px rgba(134, 7, 52, 0.1);
}

.form-group input::placeholder {
  color: #9ca3af;
}

/* Password wrapper */
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
  color: var(--primary);
}

/* Code input especial */
.code-input {
  text-align: center;
  font-size: 1.5rem !important;
  letter-spacing: 0.5rem;
  font-weight: 600;
}

/* Help text */
.help-text {
  color: #6b7280;
  font-size: 0.85rem;
  margin-top: -0.25rem;
}

/* Botón principal mejorado */
.btn-primary {
  width: 100%;
  background: linear-gradient(135deg, var(--primary), var(--primary-light));
  color: white;
  font-weight: 700;
  border: none;
  border-radius: 12px;
  padding: 1rem;
  font-size: 1.05rem;
  cursor: pointer;
  transition: all 0.3s;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  box-shadow: 0 4px 15px rgba(134, 7, 52, 0.3);
}

.btn-primary:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 6px 25px rgba(134, 7, 52, 0.4);
}

.btn-primary:active:not(:disabled) {
  transform: translateY(0);
}

.btn-primary:disabled {
  background: linear-gradient(135deg, #d1d5db, #9ca3af);
  cursor: not-allowed;
  box-shadow: none;
}

.loading-spinner {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.spin {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

/* Error mejorado */
.login-error {
  background: #fef2f2;
  border: 1px solid #fecaca;
  color: #dc2626;
  padding: 0.875rem 1rem;
  border-radius: 12px;
  font-size: 0.9rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-weight: 500;
}

.login-error i {
  font-size: 1.2rem;
  flex-shrink: 0;
}

.error-enter-active, .error-leave-active {
  transition: all 0.3s ease;
}

.error-enter-from {
  opacity: 0;
  transform: translateY(-10px);
}

.error-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

/* Botón de recuperación */
.reset-password-btn {
  background: transparent;
  border: none;
  color: var(--primary);
  text-align: center;
  cursor: pointer;
  margin-top: 0.5rem;
  padding: 0.5rem;
  font-weight: 600;
  font-size: 0.95rem;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  border-radius: 8px;
}

.reset-password-btn:hover {
  background: rgba(134, 7, 52, 0.05);
  color: var(--primary-dark);
}

/* Responsive */
@media (max-width: 480px) {
  .login-container {
    padding: 1rem 0.75rem;
  }

  .login-form {
    padding: 2rem 1.5rem;
    min-width: 0;
  }

  .brand-icon {
    width: 60px;
    height: 60px;
    font-size: 2rem;
  }

  .login-brand h1 {
    font-size: 1.25rem;
  }

  .form-header h2 {
    font-size: 1.35rem;
  }

  .icon-circle {
    width: 60px;
    height: 60px;
    font-size: 1.75rem;
  }
}

/* Accesibilidad */
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
</style>
