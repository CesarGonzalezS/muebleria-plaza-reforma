<template>
  <section class="form-card">
    <!-- Success state -->
    <div v-if="submitted" class="success-state">
      <div class="success-icon">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </div>
      <h3>¡Mensaje enviado!</h3>
      <p>Te redirigimos a WhatsApp para continuar la conversación.</p>
      <button class="btn-secondary" @click="resetForm">Enviar otro mensaje</button>
    </div>

    <!-- Form -->
    <template v-else>
      <div class="form-header">
        <div class="icon-wrap">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.8" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
          </svg>
        </div>
        <div>
          <h2>Envíanos un mensaje</h2>
          <p class="form-subtitle">Te responderemos vía WhatsApp</p>
        </div>
      </div>

      <form class="contact-form" @submit.prevent="handleSubmit" autocomplete="off" novalidate>
        <div class="form-group">
          <label for="name">Nombre completo</label>
          <input
            type="text"
            id="name"
            name="name"
            v-model="form.name"
            @blur="validateField('name')"
            :class="{ error: errors.name, valid: form.name && !errors.name }"
            autocomplete="name"
            placeholder="Tu nombre completo"
          />
          <span class="error-message" v-if="errors.name" role="alert">{{ errors.name }}</span>
        </div>

        <div class="form-group">
          <label for="email">Correo electrónico</label>
          <input
            type="email"
            id="email"
            name="email"
            v-model="form.email"
            @blur="validateField('email')"
            :class="{ error: errors.email, valid: form.email && !errors.email }"
            autocomplete="email"
            placeholder="tucorreo@ejemplo.com"
          />
          <span class="error-message" v-if="errors.email" role="alert">{{ errors.email }}</span>
        </div>

        <div class="form-group">
          <label for="phone">Teléfono</label>
          <input
            type="tel"
            id="phone"
            name="phone"
            v-model="form.phone"
            @blur="validateField('phone')"
            :class="{ error: errors.phone, valid: form.phone && !errors.phone }"
            autocomplete="tel"
            placeholder="10 dígitos"
          />
          <span class="error-message" v-if="errors.phone" role="alert">{{ errors.phone }}</span>
        </div>

        <div class="form-group">
          <label for="message">Mensaje</label>
          <textarea
            id="message"
            name="message"
            v-model="form.message"
            @blur="validateField('message')"
            :class="{ error: errors.message, valid: form.message && !errors.message }"
            rows="4"
            placeholder="¿En qué podemos ayudarte?"
          ></textarea>
          <span class="error-message" v-if="errors.message" role="alert">{{ errors.message }}</span>
        </div>

        <button type="submit" class="btn-submit" :disabled="isSubmitting" :aria-busy="isSubmitting">
          <span v-if="isSubmitting" class="btn-loading">
            <svg class="spinner" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="3" stroke-dasharray="32" stroke-linecap="round"/>
            </svg>
            Enviando...
          </span>
          <span v-else class="btn-content">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
            </svg>
            Enviar mensaje
          </span>
        </button>

        <p class="form-note">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.8" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
          </svg>
          Tus datos están protegidos
        </p>
      </form>
    </template>
  </section>
</template>

<script setup>
import { ref } from 'vue';

const form = ref({ name: '', email: '', phone: '', message: '' });
const errors = ref({ name: '', email: '', phone: '', message: '' });
const isSubmitting = ref(false);
const submitted = ref(false);

const validateField = (field) => {
  const value = form.value[field];
  switch (field) {
    case 'name':
      errors.value.name = value.trim() === '' ? 'El nombre es requerido' : '';
      break;
    case 'email':
      errors.value.email = !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) ? 'Correo inválido' : '';
      break;
    case 'phone':
      errors.value.phone = !/^[0-9]{10}$/.test(value) ? 'Debe tener 10 dígitos' : '';
      break;
    case 'message':
      errors.value.message = value.trim().length < 10 ? 'Mínimo 10 caracteres' : '';
      break;
  }
};

const handleSubmit = async () => {
  Object.keys(form.value).forEach(field => validateField(field));
  if (Object.values(errors.value).some(e => e !== '')) return;

  isSubmitting.value = true;
  try {
    const text = `Hola, mi nombre es ${form.value.name}. Mi correo es ${form.value.email}, mi teléfono es ${form.value.phone}. Quiero decir: ${form.value.message}`;
    const url = `https://api.whatsapp.com/send?phone=7341218621&text=${encodeURIComponent(text)}`;
    const win = window.open(url, '_blank');
    if (!win) window.location.href = url;
    submitted.value = true;
  } catch {
    alert('Error al enviar. Por favor inténtalo de nuevo.');
  } finally {
    isSubmitting.value = false;
  }
};

const resetForm = () => {
  form.value = { name: '', email: '', phone: '', message: '' };
  errors.value = { name: '', email: '', phone: '', message: '' };
  submitted.value = false;
};
</script>

<style scoped>
.form-card {
  background: #ffffff;
  border-radius: 1.5rem;
  padding: 2.5rem 2rem;
  box-shadow:
    0 1px 3px rgba(134, 7, 52, 0.08),
    0 8px 32px rgba(134, 7, 52, 0.12);
  border: 1px solid rgba(134, 7, 52, 0.08);
  max-width: 520px;
  width: 100%;
  margin: 0 auto;
}

/* Header */
.form-header {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1.75rem;
}

.icon-wrap {
  flex-shrink: 0;
  width: 48px;
  height: 48px;
  background: linear-gradient(135deg, #860734, #a81552);
  border-radius: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
}

.icon-wrap svg {
  width: 24px;
  height: 24px;
}

.form-header h2 {
  font-size: 1.25rem;
  font-weight: 700;
  color: #1a0a12;
  margin: 0 0 0.15rem;
  line-height: 1.3;
}

.form-subtitle {
  font-size: 0.875rem;
  color: #6b4055;
  margin: 0;
}

/* Form groups */
.contact-form {
  display: flex;
  flex-direction: column;
  gap: 1.125rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.375rem;
}

label {
  font-size: 0.875rem;
  font-weight: 600;
  color: #3d1525;
  letter-spacing: 0.01em;
}

input,
textarea {
  width: 100%;
  padding: 0.75rem 1rem;
  border: 1.5px solid #e2d4da;
  border-radius: 0.625rem;
  background: #fafafa;
  color: #1a0a12;
  font-size: 0.9375rem;
  font-family: inherit;
  transition: border-color 0.2s, box-shadow 0.2s, background 0.2s;
  box-sizing: border-box;
  resize: vertical;
  outline: none;
}

input::placeholder,
textarea::placeholder {
  color: #b09aa6;
}

input:hover,
textarea:hover {
  border-color: #c4899e;
}

input:focus,
textarea:focus {
  border-color: #860734;
  background: #fff;
  box-shadow: 0 0 0 3px rgba(134, 7, 52, 0.1);
}

input.valid,
textarea.valid {
  border-color: #16a34a;
}

input.error,
textarea.error {
  border-color: #dc2626;
  background: #fff8f8;
}

input.error:focus,
textarea.error:focus {
  box-shadow: 0 0 0 3px rgba(220, 38, 38, 0.1);
}

.error-message {
  font-size: 0.8125rem;
  color: #dc2626;
  font-weight: 500;
}

/* Submit button */
.btn-submit {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  width: 100%;
  padding: 0.875rem 1rem;
  background: linear-gradient(135deg, #860734 0%, #a81552 100%);
  color: #ffffff;
  font-size: 0.9375rem;
  font-weight: 600;
  border: none;
  border-radius: 0.75rem;
  cursor: pointer;
  transition: opacity 0.2s, transform 0.15s, box-shadow 0.2s;
  box-shadow: 0 4px 14px rgba(134, 7, 52, 0.35);
  margin-top: 0.25rem;
  letter-spacing: 0.01em;
}

.btn-submit svg {
  width: 18px;
  height: 18px;
}

.btn-content,
.btn-loading {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.btn-submit:hover:not(:disabled) {
  opacity: 0.92;
  transform: translateY(-1px);
  box-shadow: 0 6px 20px rgba(134, 7, 52, 0.4);
}

.btn-submit:active:not(:disabled) {
  transform: translateY(0);
}

.btn-submit:disabled {
  opacity: 0.65;
  cursor: not-allowed;
  box-shadow: none;
}

.btn-submit:focus-visible {
  outline: 3px solid #860734;
  outline-offset: 2px;
}

/* Spinner */
.spinner {
  width: 18px;
  height: 18px;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

/* Privacy note */
.form-note {
  display: flex;
  align-items: center;
  gap: 0.375rem;
  color: #6b4055;
  font-size: 0.8125rem;
  margin: 0;
}

.form-note svg {
  width: 15px;
  height: 15px;
  flex-shrink: 0;
  color: #860734;
}

/* Success state */
.success-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding: 1rem 0;
  gap: 1rem;
}

.success-icon {
  width: 64px;
  height: 64px;
  background: linear-gradient(135deg, #860734, #a81552);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
}

.success-icon svg {
  width: 34px;
  height: 34px;
}

.success-state h3 {
  font-size: 1.25rem;
  font-weight: 700;
  color: #1a0a12;
  margin: 0;
}

.success-state p {
  font-size: 0.9375rem;
  color: #6b4055;
  margin: 0;
  max-width: 280px;
}

.btn-secondary {
  padding: 0.625rem 1.5rem;
  border: 1.5px solid #860734;
  background: transparent;
  color: #860734;
  font-size: 0.875rem;
  font-weight: 600;
  border-radius: 0.625rem;
  cursor: pointer;
  transition: background 0.2s, color 0.2s;
}

.btn-secondary:hover {
  background: #860734;
  color: #fff;
}

/* Responsive */
@media (max-width: 640px) {
  .form-card {
    border-radius: 1.125rem;
    padding: 1.75rem 1.25rem;
  }

  .form-header h2 {
    font-size: 1.125rem;
  }

  .icon-wrap {
    width: 42px;
    height: 42px;
    border-radius: 12px;
  }
}

@media (max-width: 400px) {
  .form-card {
    padding: 1.25rem 1rem;
    border-radius: 0.875rem;
  }
}

@media (prefers-reduced-motion: reduce) {
  input, textarea, .btn-submit, .btn-secondary {
    transition: none;
  }
  .spinner {
    animation: none;
  }
}
</style>
