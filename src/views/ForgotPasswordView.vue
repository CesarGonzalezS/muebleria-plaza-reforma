¯»¿<template>



  <div class="forgot-password-container">



    <div class="forgot-password-card">



      <button @click="goBack" class="back-btn">



        <i class="bi bi-arrow-left"></i> Atrás



      </button>







      <!-- Step 1: Solicitar Reset -->



      <div v-if="step === 1">



        <h1>¿Olvidaste tu Contraseña?</h1>



        <p class="subtitle">Ingresa tu email para recibir instrucciones</p>







        <form @submit.prevent="handleForgotPassword">



          <div class="form-group">



            <label for="email">Correo Electrónico</label>



            <input



              v-model="email"



              id="email"



              type="email"



              placeholder="tu@email.com"



              required



            />



          </div>







          <div v-if="error" class="error-message">



            {{ error }}



          </div>







          <button type="submit" class="btn-submit" :disabled="loading">



            <span v-if="!loading">Enviar Instrucciones</span>



            <span v-else>Enviando...</span>



          </button>







          <div class="form-link">



            ¿Recuerdas tu contraseña? <router-link to="/login">Inicia sesión</router-link>



          </div>



        </form>



      </div>







      <!-- Step 2: Validar Token -->



      <div v-if="step === 2">



        <h1>Validar Token</h1>



        <p class="subtitle">Ingresa el token que recibiste en tu email</p>







        <form @submit.prevent="handleValidateToken">



          <div class="form-group">



            <label for="token">Token de Recuperación</label>



            <input



              v-model="resetToken"



              id="token"



              type="text"



              placeholder="abc123def456..."



              required



            />



          </div>







          <div v-if="error" class="error-message">



            {{ error }}



          </div>







          <button type="submit" class="btn-submit" :disabled="loading">



            <span v-if="!loading">Validar Token</span>



            <span v-else>Validando...</span>



          </button>



        </form>



      </div>










      <div v-if="step === 3" class="success-container">



        <div class="success-icon">



          <i class="bi bi-check-circle"></i>



        </div>



        <h1>¡Token Válido!</h1>



        <p>Redirigiendo para resetear tu contraseña...</p>



      </div>



    </div>



  </div>



</template>







<script setup>



import { ref } from 'vue';



import { useRouter } from 'vue-router';



import { authService } from '../services/auth';







const router = useRouter();







const step = ref(1);



const email = ref('');



const resetToken = ref('');



const error = ref('');



const loading = ref(false);







function goBack() {



  if (step.value > 1) {



    step.value--;



    error.value = '';



  } else {



    router.push('/login');



  }



}







async function handleForgotPassword() {



  error.value = '';



  loading.value = true;







  try {



    await authService.forgotPassword(email.value);



    step.value = 2;



  } catch (err) {



    error.value = err.response?.data?.message || 'Error al procesar la solicitud. Intenta de nuevo.';



  } finally {



    loading.value = false;



  }



}







async function handleValidateToken() {



  error.value = '';



  loading.value = true;







  try {



    const response = await authService.validateResetToken(resetToken.value);



    if (response.data.success) {



      step.value = 3;



      // Redirigir a reset-password con el token



      setTimeout(() => {



        router.push({



          name: 'ResetPassword',



          query: { token: resetToken.value }



        });



      }, 1000);



    }



  } catch (err) {



    error.value = err.response?.data?.message || 'Token inválido o expirado.';



  } finally {



    loading.value = false;



  }



}



</script>







<style scoped>



.forgot-password-container {



  min-height: 100vh;



  display: flex;



  align-items: center;



  justify-content: center;



  background: var(--canvas);



  padding: 2rem 1rem;



}







.forgot-password-card {



  background: var(--white);



  border-radius: 16px;



  padding: 3rem;



  width: 100%;



  max-width: 500px;



  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);



  position: relative;



  animation: slideIn 0.3s ease;



}







@keyframes slideIn {



  from {



    opacity: 0;



    transform: translateY(20px);



  }



  to {



    opacity: 1;



    transform: translateY(0);



  }



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







.forgot-password-card h1 {



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







.btn-submit {



  width: 100%;



  background: var(--canvas);



  color: white;



  border: none;



  padding: 0.85rem;



  border-radius: var(--r-card);



  font-size: 1rem;



  font-weight: 600;



  cursor: pointer;



  transition: all 0.3s;



  display: inline-flex;



  align-items: center;



  justify-content: center;



  text-decoration: none;



}







.btn-submit:hover:not(:disabled) {



  transform: translateY(-2px);



  box-shadow: 0 10px 25px rgba(102, 126, 234, 0.3);



}







.btn-submit:disabled {



  opacity: 0.6;



  cursor: not-allowed;



}







.form-link {



  text-align: center;



  color: var(--slate);



  font-size: 0.9rem;



  margin-top: 1rem;



}







.form-link a {



  color: var(--ink);



  text-decoration: none;



  font-weight: 600;



}







.form-link a:hover {



  text-decoration: underline;



}







/* Success Container */



.success-container {



  text-align: center;



}







.success-icon {



  font-size: 3.5rem;



  color: #10b981;



  margin-bottom: 1rem;



  animation: bounceIn 0.6s ease;



}







@keyframes bounceIn {



  0% {



    opacity: 0;



    transform: scale(0.3);



  }



  50% {



    opacity: 1;



    transform: scale(1.05);



  }



  70% {



    transform: scale(0.9);



  }



  100% {



    transform: scale(1);



  }



}







.success-container h1 {



  color: #10b981;



  margin-bottom: 0.5rem;



}







.success-container p {



  color: var(--slate);



  margin-bottom: 2rem;



}







@media (max-width: 640px) {



  .forgot-password-card {



    padding: 2rem 1.5rem;



  }







  .back-btn {



    top: 1rem;



    left: 1rem;



  }







  .forgot-password-card h1 {



    font-size: 1.5rem;



  }



}



</style>







