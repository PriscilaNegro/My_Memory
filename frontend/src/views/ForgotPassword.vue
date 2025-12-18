<template>
  <div class="recovery-page">

    <h1 class="title"><span>Recuperar Senha</span></h1>
    <p class="subtitle">Informe seu e-mail para receber o link de redefinição</p>

    <form @submit.prevent="handleRecovery" class="form-box">

      <div class="input-group">
        <label for="email">E-mail</label>
        <input
          type="email"
          id="email"
          v-model="email"
          placeholder="Digite seu e-mail"
          required
        />
        <p v-if="emailError" class="error-msg">{{ emailError }}</p>
        <p v-if="successMessage" class="success-msg">{{ successMessage }}</p>
      </div>

      <div class="btn-area">
        <button type="submit" class="btn-main">Enviar link</button>
      </div>

    </form>

    <p class="back-login">
      <router-link to="/login">Voltar ao login</router-link>
    </p>

  </div>
</template>


<script setup>
import { ref } from 'vue';
import axios from 'axios';

const email = ref("");
const emailError = ref("");
const successMessage = ref("");

function handleRecovery() {
  emailError.value = "";
  successMessage.value = "";

  if (!email.value) {
    emailError.value = "Email inválido.";
    return;
  }

  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailPattern.test(email.value)) {
    emailError.value = "Digite um email válido.";
    return;
  }

  // Requisição ao backend
  axios.post('http://localhost:3000/forgot-password', { email: email.value })
    .then(response => {
      // Supondo que o backend retorne { message: "..." }
      successMessage.value = response.data.message;
      email.value = "";
    })
    .catch(error => {
      // Captura mensagem de erro do backend ou padrão
      if (error.response && error.response.data && error.response.data.message) {
        emailError.value = error.response.data.message;
      } else {
        emailError.value = "Ocorreu um erro. Tente novamente.";
      }
    });
}
</script>

<style scoped>
.recovery-page {
  min-height: 100vh;
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  padding: 10px 20px;
  color: white;
}

.title {
  font-size: 2.5rem;
  font-weight: bold;
  margin-bottom: 5px;
  text-align: center;
  white-space: nowrap;
}

.title span {
  color: #f3b2ff;
  text-shadow: 0 0 15px #c73afa;
}

.subtitle {
  font-size: 1.2rem;
  color: #ffe6f3;
  margin-bottom: 30px;
  margin-top: 20px;
  text-align: center;
}

.form-box {
  width: 100%;
  max-width: 420px;
  background: transparent;
  padding: 0 10px;
  border-radius: 0;
  box-shadow: none;
  backdrop-filter: none;
}

.input-group {
  margin-bottom: 20px;
  text-align: left;
}

label {
  color: #e7baff;
  margin-bottom: 5px;
  display: block;
  font-size: 0.95rem;
}

input {
  width: 100%;
  padding: 12px;
  background: transparent;
  border: 2px solid #b654ff;
  border-radius: 10px !important;
  color: #c7d9ff;
  font-size: 1rem;
  outline: none;
  box-shadow: 0 0 8px 1px rgba(182, 84, 255, 0.5);
}

input::placeholder {
  color: #c9a6ff;
}

input:focus {
  border-color: #8db3ff;
  box-shadow: 0 0 12px #8db3ff;
}

.error-msg {
  color: white;
  font-size: 0.9rem;
  margin-top: 5px;
}

.success-msg {
  color: #8db3ff;
  font-size: 0.9rem;
  margin-top: 5px;
}

.btn-area {
  display: flex;
  justify-content: center;
  margin-top: 30px;
}

.btn-main {
  width: 160px;
  padding: 12px 0;
  border-radius: 12px;
  font-size: 1.1rem;
  cursor: pointer;
  background: transparent;
  color: #d796ff;
  border: 2px solid #b654ff;
  box-shadow: 0 0 10px rgba(182, 84, 255, 0.5);
  transition: 0.3s ease;
}

.btn-main:hover {
  transform: scale(1.05);
  color: #4f87ff;
  border-color: #8db3ff;
  box-shadow: 0 0 15px rgba(141, 173, 255, 0.9);
}

.back-login {
  margin-top: 25px;
}

.back-login a {
  color: #c9a6ff;
  text-decoration: none;
}

.back-login a:hover {
  text-decoration: underline;
}

@media (max-width: 480px) {
  .title {
    font-size: 2rem;
  }
}

</style>
