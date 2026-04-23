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
        <div class="form-row">
          <div class="form-group">
            <label for="name">Nombre</label>
            <input
              type="text"
              id="name"
              name="name"
              v-model="form.name"
              @blur="validateField('name')"
              :class="{ error: errors.name, valid: form.name && !errors.name }"
              autocomplete="name"
              placeholder="Tu nombre"
            />
            <span class="error-message" v-if="errors.name" role="alert">{{ errors.name }}</span>
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
  border-radius: 16px;
  padding: 2rem;
  box-shadow: 0 2px 12px rgba(134, 7, 52, 0.05), 0 8px 32px rgba(134, 7, 52, 0.08);
  border: 1px solid rgba(134, 7, 52, 0.07);
  max-width: 520px;
  width: 100%;
  margin: 0 auto;
}

.form-header {
  display: flex;
  align-items: center;
  gap: 0.875rem;
  margin-bottom: 1.75rem;
}

.icon-wrap {
  flex-shrink: 0;
  width: 44px;
  height: 44px;
  background: rgba(134, 7, 52, 0.09);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #860734;
}

.icon-wrap svg { width: 22px; height: 22px; }

.form-header h2 {
  font-size: 1.125rem;
  font-weight: 700;
  color: #141413;
  margin: 0 0 0.15rem;
  line-height: 1.3;
}

.form-subtitle {
  font-size: 0.8125rem;
  color: #696969;
  margin: 0;
}

.contact-form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.375rem;
}

label {
  font-size: 0.8125rem;
  font-weight: 600;
  color: #262627;
  letter-spacing: 0.01em;
}

input,
textarea {
  width: 100%;
  padding: 0.6875rem 0.875rem;
  border: 1.5px solid #E0DAD7;
  border-radius: 10px;
  background: #FAFAF9;
  color: #141413;
  font-size: 0.9375rem;
  font-family: inherit;
  transition: border-color 0.18s, box-shadow 0.18s, background 0.18s;
  box-sizing: border-box;
  resize: vertical;
  outline: none;
}

input::placeholder,
textarea::placeholder { color: #B0A8A5; }

input:hover, textarea:hover { border-color: #BBA8A0; }

input:focus, textarea:focus {
  border-color: #860734;
  background: #fff;
  box-shadow: 0 0 0 3px rgba(134, 7, 52, 0.08);
}

input.valid, textarea.valid { border-color: #16a34a; }

input.error, textarea.error { border-color: #dc2626; background: #fff9f9; }

input.error:focus, textarea.error:focus {
  box-shadow: 0 0 0 3px rgba(220,38,38,0.08);
}

.error-message {
  font-size: 0.78125rem;
  color: #dc2626;
  font-weight: 500;
}

.btn-submit {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  width: 100%;
  padding: 0.8125rem 1rem;
  background: #860734;
  color: #ffffff;
  font-size: 0.9375rem;
  font-weight: 600;
  border: none;
  border-radius: 10px;
  cursor: pointer;
  transition: background 0.18s, transform 0.15s, box-shadow 0.18s;
  box-shadow: 0 4px 14px rgba(134, 7, 52, 0.28);
  margin-top: 0.25rem;
  letter-spacing: 0.01em;
}

.btn-submit svg { width: 17px; height: 17px; }
.btn-content, .btn-loading { display: flex; align-items: center; gap: 0.5rem; }

.btn-submit:hover:not(:disabled) {
  background: #9e0840;
  transform: translateY(-1px);
  box-shadow: 0 6px 20px rgba(134, 7, 52, 0.36);
}

.btn-submit:active:not(:disabled) { transform: translateY(0); }
.btn-submit:disabled { opacity: 0.55; cursor: not-allowed; box-shadow: none; }
.btn-submit:focus-visible { outline: 3px solid #860734; outline-offset: 2px; }

.spinner { width: 17px; height: 17px; animation: spin 0.8s linear infinite; }
@keyframes spin { to { transform: rotate(360deg); } }

.form-note {
  display: flex;
  align-items: center;
  gap: 0.375rem;
  color: #696969;
  font-size: 0.78125rem;
  margin: 0;
}

.form-note svg { width: 14px; height: 14px; flex-shrink: 0; color: #860734; }

.success-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding: 1.5rem 0;
  gap: 1rem;
}

.success-icon {
  width: 60px;
  height: 60px;
  background: rgba(134, 7, 52, 0.09);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #860734;
}

.success-icon svg { width: 32px; height: 32px; }

.success-state h3 {
  font-size: 1.125rem;
  font-weight: 700;
  color: #141413;
  margin: 0;
}

.success-state p {
  font-size: 0.9375rem;
  color: #696969;
  margin: 0;
  max-width: 260px;
  line-height: 1.55;
}

.btn-secondary {
  padding: 0.6rem 1.5rem;
  border: 1.5px solid #860734;
  background: transparent;
  color: #860734;
  font-size: 0.875rem;
  font-weight: 600;
  border-radius: 10px;
  cursor: pointer;
  transition: background 0.18s, color 0.18s;
}

.btn-secondary:hover { background: #860734; color: #fff; }

@media (max-width: 580px) { .form-row { grid-template-columns: 1fr; } }

@media (max-width: 640px) {
  .form-card { border-radius: 14px; padding: 1.5rem 1.25rem; }
}

@media (prefers-reduced-motion: reduce) {
  input, textarea, .btn-submit, .btn-secondary { transition: none; }
  .spinner { animation: none; }
}
</style>
