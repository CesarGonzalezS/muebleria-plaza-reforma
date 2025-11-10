<template>
    <main>
        <!-- Formulario -->
        <section class="contact-form-col">
          <!-- Solo la parte del formulario mejorada -->
            <h2><i class="fas fa-paper-plane"></i> Envíanos un mensaje</h2>
            <form class="contact-form" @submit.prevent="handleSubmit" autocomplete="off">
              <div class="form-group">
                <label for="name"><i class="fas fa-user"></i> Nombre</label>
                <input type="text" id="name" name="name" v-model="form.name" @blur="validateField('name')"
                  :class="{ error: errors.name }" autocomplete="name" placeholder="Tu nombre completo" />
                <span class="error-message" v-if="errors.name">{{ errors.name }}</span>
              </div>

              <div class="form-group">
                <label for="email"><i class="fas fa-envelope"></i> Correo</label>
                <input type="email" id="email" name="email" v-model="form.email" @blur="validateField('email')"
                  :class="{ error: errors.email }" autocomplete="email" placeholder="tucorreo@ejemplo.com" />
                <span class="error-message" v-if="errors.email">{{ errors.email }}</span>
              </div>

              <div class="form-group">
                <label for="phone"><i class="fas fa-phone"></i> Teléfono</label>
                <input type="tel" id="phone" name="phone" v-model="form.phone" @blur="validateField('phone')"
                  :class="{ error: errors.phone }" autocomplete="tel" placeholder="10 dígitos" />
                <span class="error-message" v-if="errors.phone">{{ errors.phone }}</span>
              </div>

              <div class="form-group">
                <label for="message"><i class="fas fa-comment-alt"></i> Mensaje</label>
                <textarea id="message" name="message" v-model="form.message" @blur="validateField('message')"
                  :class="{ error: errors.message }" rows="4" placeholder="¿En qué podemos ayudarte?"></textarea>
                <span class="error-message" v-if="errors.message">{{ errors.message }}</span>
              </div>

              <button type="submit" :disabled="isSubmitting">
                {{ isSubmitting ? 'Enviando...' : 'Enviar mensaje' }}
              </button>
              <div class="form-note">
                <i class="fas fa-shield-alt"></i> Tus datos están protegidos y no serán compartidos.
              </div>
            </form>

          </section>

    </main>

    

</template>

<script setup>
import { ref } from 'vue';

const form = ref({
  name: '',
  email: '',
  phone: '',
  message: ''
});

const errors = ref({
  name: '',
  email: '',
  phone: '',
  message: ''
});

const isSubmitting = ref(false);

const validateField = (field) => {
  const value = form.value[field];
  switch (field) {
    case 'name':
      errors.value.name = value.trim() === '' ? 'El nombre es requerido' : '';
      break;
    case 'email':
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      errors.value.email = !emailRegex.test(value) ? 'Correo inválido' : '';
      break;
    case 'phone':
      const phoneRegex = /^[0-9]{10}$/;
      errors.value.phone = !phoneRegex.test(value) ? 'Teléfono debe tener 10 dígitos' : '';
      break;
    case 'message':
      errors.value.message = value.trim().length < 10 ? 'Mínimo 10 caracteres' : '';
      break;
  }
};

const handleSubmit = async () => {
  Object.keys(form.value).forEach(field => validateField(field));
  if (Object.values(errors.value).some(error => error !== '')) {
    return;
  }
  isSubmitting.value = true;
  try {
    // Construir el mensaje para WhatsApp
    const message = `Hola, mi nombre es ${form.value.name}. Mi correo es ${form.value.email}, mi teléfono es ${form.value.phone}. Quiero decir: ${form.value.message}`;
    const encodedMessage = encodeURIComponent(message);
    // Usar el enlace web de WhatsApp (evita intentar abrir el esquema nativo que falla en algunos navegadores)
    const phoneNumber = '7341218621';
    const webWhatsappLink = `https://api.whatsapp.com/send?phone=${phoneNumber}&text=${encodedMessage}`;

    // Abrir en una nueva pestaña/ventana (más seguro en escritorio y móviles)
    const newWin = window.open(webWhatsappLink, '_blank');
    // Si el navegador bloquea popups, forzar la navegación en la misma ventana como fallback
    if (!newWin) {
      window.location.href = webWhatsappLink;
    }
  } catch (error) {
    alert('Hubo un error al enviar el mensaje. Por favor, inténtalo de nuevo.');
  } finally {
    isSubmitting.value = false;
  }
};
</script>

<style scoped>
.contact-view {
  background: #f6f6fb;
  min-height: 100vh;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

.contact-header {
  background: linear-gradient(135deg, #860734 80%, #d59fa9 100%);
  color: #fff;
  text-align: center;
  padding: 2.3rem 0 1.6rem;
  border-radius: 0 0 2.2rem 2.2rem;
  margin-bottom: 1.3rem;
  box-shadow: 0 6px 36px #860733;
}

.contact-header h1 {
  font-size: 2.25rem;
  font-weight: 900;
  margin-bottom: 0.7rem;
}

.contact-header p {
  font-size: 1.07rem;
  font-weight: 600;
  margin-bottom: 0;
  color: #fffde6;
}

.container {
  width: 100%;
  max-width: 1150px;
  margin: 0 auto;
  padding: 0 1rem;
}

.contact-main {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
  margin-bottom: 1.5rem;
}

@media (max-width: 900px) {
  .contact-main {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
}

/* --- Formulario --- */
.contact-form-col {
  border-radius: 1.4rem;
  background: #ffffff !important;
  box-shadow: 0 6px 28px #ff025a98;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 8rem;
  padding: 2.5rem 2rem 2rem 2rem; /* Espaciado interno para separar el contenido del borde */
  box-sizing: border-box;
}

@media (max-width: 900px) {
  .contact-form-col {
    margin-top: 4rem;
    padding: 1.5rem 0.7rem 1.2rem 0.7rem; /* Menos padding en móvil */
  }
}

input, textarea {
  background: #fffdfa !important;
  color: #fff8fe !important;
}

.contact-form-col h2 {
  color: #a81552;
  margin-bottom: 1.05rem;
  font-size: 1.27rem;
  font-weight: 800;
}

.contact-form {
  width: 100%;
  max-width: 900px; /* Aumentado para inputs más anchos */
  margin: 0 auto;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 1.07rem;
}


.contact-form-col, .contact-form {
  background: #ffffff !important;
}
.contact-form, .contact-form * {
  background: transparent !important;
}
input, textarea, select, button {
  background: #ffffff !important;
  color: #22081e !important;
}


.form-group {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 0.18rem;
}

label {
  color: #a81552;
  font-weight: 700;
  font-size: 1rem;
  margin-bottom: 0.13rem;
}

input,
textarea {
  width: 100%;
  padding: 0.7em 1em;
  border: 1.5px solid #ecd5e7;
  border-radius: 8px;
  background: #faf6fa;
  font-size: 1.07rem;
  font-family: inherit;
  transition: border-color 0.16s, box-shadow 0.15s;
  box-sizing: border-box;
  resize: vertical;
}

input:focus,
textarea:focus {
  border-color: #a81552;
  outline: none;
  background: #fff;
  box-shadow: 0 2px 9px #fffefe;
}

input.error,
textarea.error {
  border-color: #e94e77;
  background: #fff0f3;
}

.error-message {
  color: #e94e77;
  font-size: 0.92em;
  margin-top: 2px;
  margin-bottom: 0;
  min-height: 1em;
}

button[type="submit"] {
  background: linear-gradient(90deg, #a81552 65%, #860734 100%);
  color: #ff23146e;
  font-weight: 700;
  font-size: 1.09rem;
  border: none;
  border-radius: 22px;
  padding: 0.82rem 0;
  cursor: pointer;
  margin-top: 0.3em;
  transition: background 0.15s, color 0.13s, box-shadow 0.16s, transform 0.13s;
  box-shadow: 0 2px 9px #963b3b;
  width: 100%;
}

button[type="submit"]:hover:not(:disabled) {
  background: linear-gradient(90deg, #d59fa9 5%, #a81552 80%);
  color: #860734;
  transform: translateY(-2px) scale(1.03);
}

button[type="submit"]:disabled {
  opacity: 0.75;
  cursor: not-allowed;
  background: #c0b7be;
}

.form-note {
  color: #a81552;
  font-size: 1.07rem;
  font-weight: 500;
  margin-top: 0.3em;
  min-height: 1em;
}

/* Responsive mejorado */
@media (max-width: 768px) {
  .contact-form-col {
    margin-top: 2rem;
    padding: 1.5rem 1rem;
    border-radius: 16px;
  }

  .contact-form-col h2 {
    font-size: 1.15rem;
    margin-bottom: 0.9rem;
  }

  .contact-form {
    gap: 0.9rem;
  }

  label {
    font-size: 0.95rem;
  }

  input,
  textarea {
    font-size: 1rem;
    padding: 0.6rem 0.85rem;
  }

  button[type="submit"] {
    font-size: 1rem;
    padding: 0.75rem 0;
  }
}

@media (max-width: 480px) {
  .contact-form-col {
    margin-top: 1rem;
    padding: 1.2rem 0.75rem;
    border-radius: 12px;
  }

  .contact-form-col h2 {
    font-size: 1.05rem;
    margin-bottom: 0.8rem;
  }

  .contact-form {
    gap: 0.8rem;
  }

  label {
    font-size: 0.9rem;
    margin-bottom: 0.1rem;
  }

  input,
  textarea {
    font-size: 0.95rem;
    padding: 0.55rem 0.75rem;
    border-radius: 6px;
  }

  textarea {
    /* removed invalid CSS property 'rows' */
  }

  button[type="submit"] {
    font-size: 0.95rem;
    padding: 0.7rem 0;
    border-radius: 18px;
  }

  .error-message {
    font-size: 0.85rem;
  }

  .form-note {
    font-size: 0.9rem;
    margin-top: 0.5rem;
  }
}

/* Fix box-sizing y elimina scroll lateral */
*,
*::before,
*::after {
  box-sizing: border-box;
}

html,
body {
  width: 100vw;
  max-width: 100vw;
  overflow-x: hidden;
  padding: 0;
  margin: 0;
}
</style>
