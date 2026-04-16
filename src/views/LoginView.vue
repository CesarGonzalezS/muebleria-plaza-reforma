<template>
  <div class="login-container">

    <!-- Logo o TÃ­tulo principal -->
    <div class="login-brand" v-if="!resetStep">
      <div class="brand-icon">
        <i class="bi bi-shop"></i>
      </div>
      <h1>MueblerÃ­a Plaza Reforma</h1>
      <p>Panel de AdministraciÃ³n</p>
    </div>

    <form v-if="!resetStep" class="login-form" @submit.prevent="handleLogin">
      <div class="form-header">
        <h2>Iniciar sesiÃ³n</h2>
        <p>Ingresa tus credenciales para continuar</p>
      </div>

      <div class="form-body">
        <div class="form-group">
          <label for="email">
            <i class="bi bi-envelope"></i>
            Correo electrÃ³nico
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
            ContraseÃ±a
          </label>
          <div class="password-wrapper">
            <input
              v-model="password"
              id="password"
              :type="showPassword ? 'text' : 'password'"
              placeholder="â€¢â€¢â€¢â€¢â€¢â€¢â€¢â€¢"
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
          Â¿Olvidaste tu contraseÃ±a?
        </button>

        <div class="register-link">
          Â¿No tienes cuenta? <router-link to="/register">RegÃ­strate aquÃ­</router-link>
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
        <h2>Restablecer contraseÃ±a</h2>
        <p>Ingresa tu correo para recibir el cÃ³digo</p>
      </div>

      <div class="form-body">
        <div class="form-group">
          <label for="reset-email">
            <i class="bi bi-envelope"></i>
            Correo electrÃ³nico
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
            Enviar cÃ³digo
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
        <h2>Verificar cÃ³digo</h2>
        <p>Revisa tu correo e ingresa el cÃ³digo</p>
      </div>

      <div class="form-body">
        <div class="form-group">
          <label for="code">
            <i class="bi bi-123"></i>
            CÃ³digo de verificaciÃ³n
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
        <h2>Nueva contraseÃ±a</h2>
        <p>Crea una contraseÃ±a segura</p>
      </div>

      <div class="form-body">
        <div class="form-group">
          <label for="new-password">
            <i class="bi bi-shield-lock"></i>
            Nueva contraseÃ±a
          </label>
          <div class="password-wrapper">
            <input
              v-model="newPassword"
              id="new-password"
              :type="showPassword ? 'text' : 'password'"
              placeholder="â€¢â€¢â€¢â€¢â€¢â€¢â€¢â€¢"
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
          <small class="help-text">MÃ­nimo 6 caracteres</small>
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
    console.log("📌 INICIANDO LOGIN CON:", email.value);

    // Consumir API de login
    const res = await authService.login(email.value, password.value);
    console.log("📥 RESPUESTA LOGIN:", res.data);

    // Validar respuesta
    if (res.data.success && res.data.data?.accessToken) {
      const token = res.data.data.accessToken;

      console.log("✅ TOKEN RECIBIDO:", token.substring(0, 20) + "...");
      console.log("📝 TIPO:", typeof token);

      // Guardar token en localStorage
      localStorage.setItem('accessToken', token);

      // Verificar que se guardó
      const verificar = localStorage.getItem('accessToken');
      console.log("💾 TOKEN GUARDADO EN LOCALSTORAGE:", verificar ? "✅ SÍ" : "❌ NO");

      // Guardar datos del usuario
      if (res.data.data.user) {
        localStorage.setItem('user', JSON.stringify(res.data.data.user));
      }

      console.log("🎉 LOGIN EXITOSO - REDIRIGIENDO A /admin");

      // Redirigir al dashboard
      await router.push('/admin');

    } else {
      error.value = 'Respuesta inválida del servidor';
      console.error("❌ RESPUESTA SIN SUCCESS O TOKEN");
    }

  } catch (e) {
    console.error("❌ ERROR EN LOGIN:", e);
    error.value = e.response?.data?.message || 'Email o contraseña incorrectos';
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
    error.value = 'Error al enviar el cÃ³digo de verificaciÃ³n';
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
    error.value = 'CÃ³digo de verificaciÃ³n incorrecto';
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
    alert('ContraseÃ±a restablecida con Ã©xito');
  } catch (e) {
    error.value = 'Error al restablecer la contraseÃ±a';
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
  background: var(--canvas);
  padding: var(--s4) var(--s3);
}

.login-brand {
  text-align: center;
  margin-bottom: var(--s3);
}

.login-brand h1 {
  font-size: 1.125rem;
  font-weight: 600;
  letter-spacing: -0.02em;
  color: var(--ink);
  margin: 0 0 4px;
}

.login-brand p {
  font-size: 0.8125rem;
  color: var(--slate);
  margin: 0;
}

.brand-dot {
  width: 40px;
  height: 40px;
  background: var(--ink);
  border-radius: 50%;
  margin: 0 auto var(--s2);
}

.login-form {
  background: var(--white);
  border: 1px solid var(--border);
  border-radius: var(--r-hero);
  padding: var(--s4);
  width: 100%;
  max-width: 400px;
  position: relative;
  box-shadow: var(--shadow-sm);
}

.form-header {
  margin-bottom: var(--s3);
  text-align: center;
}

.form-header h2 {
  font-size: 1.125rem;
  font-weight: 600;
  letter-spacing: -0.02em;
  color: var(--ink);
  margin: 0 0 4px;
}

.form-header p {
  font-size: 0.8125rem;
  color: var(--slate);
  margin: 0;
}

.icon-circle {
  width: 40px;
  height: 40px;
  background: var(--ink);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--canvas);
  font-size: 1rem;
  margin: 0 auto var(--s2);
}
.icon-circle.success { background: #16a34a; }

.back-btn {
  position: absolute;
  top: var(--s3);
  left: var(--s3);
  background: transparent;
  border: 1px solid var(--border);
  width: 32px;
  height: 32px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: var(--slate);
  font-size: 0.875rem;
  transition: background 0.15s;
}
.back-btn:hover { background: var(--canvas); color: var(--ink); }

.form-body {
  display: flex;
  flex-direction: column;
  gap: var(--s2);
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.form-group label {
  font-size: 0.8125rem;
  font-weight: 500;
  color: var(--charcoal);
}

.form-group input {
  padding: 10px 14px;
  border: 1px solid var(--dust);
  border-radius: 10px;
  font-size: 0.9375rem;
  font-family: var(--font);
  color: var(--ink);
  background: var(--canvas-lifted);
  outline: none;
  transition: border-color 0.15s;
  width: 100%;
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
  cursor: pointer;
  color: var(--slate);
  font-size: 0.875rem;
  padding: 4px;
  display: flex;
  align-items: center;
}
.toggle-password:hover { color: var(--ink); }

.btn-primary {
  background: var(--ink);
  color: var(--canvas);
  border: 1.5px solid var(--ink);
  border-radius: var(--r-btn);
  padding: 10px 24px;
  font-size: 0.9375rem;
  font-weight: 500;
  font-family: var(--font);
  letter-spacing: -0.02em;
  cursor: pointer;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  transition: opacity 0.15s;
}
.btn-primary:hover:not(:disabled) { opacity: 0.85; }
.btn-primary:disabled { opacity: 0.5; cursor: not-allowed; }

.reset-password-btn {
  background: transparent;
  border: none;
  color: var(--slate);
  font-size: 0.8125rem;
  font-family: var(--font);
  cursor: pointer;
  text-align: center;
  padding: 4px 0;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 5px;
}
.reset-password-btn:hover { color: var(--ink); }

.register-link {
  text-align: center;
  font-size: 0.8125rem;
  color: var(--slate);
}
.register-link a { color: var(--ink); font-weight: 500; text-decoration: underline; text-underline-offset: 2px; }

.login-error {
  background: #fef2f2;
  border: 1px solid #fecaca;
  color: #dc2626;
  border-radius: 10px;
  padding: 10px 14px;
  font-size: 0.8125rem;
  display: flex;
  align-items: center;
  gap: 6px;
}

.loading-spinner { display: flex; align-items: center; gap: 6px; }

.code-input { text-align: center; font-size: 1.25rem; letter-spacing: 0.2em; }

.help-text { font-size: 0.75rem; color: var(--slate); }

.spin { animation: spin 0.7s linear infinite; }
@keyframes spin { to { transform: rotate(360deg); } }

/* Transitions */
.error-enter-active, .error-leave-active { transition: opacity 0.2s, transform 0.2s; }
.error-enter-from, .error-leave-to { opacity: 0; transform: translateY(-4px); }

@media (max-width: 480px) {
  .login-form { padding: var(--s3); border-radius: var(--r-card); }
}
</style>
