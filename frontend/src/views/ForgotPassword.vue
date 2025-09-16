<template>
  <div class="container mt-5">
    <h1>Recuperar Senha 🔒</h1>
    <p>Informe seu email para receber o link de redefinição de senha:</p>

    <form @submit.prevent="handleRecovery" class="mt-4">
      <div class="mb-3 text-start">
        <label for="email" class="form-label">Email:</label>
        <input
          type="email"
          id="email"
          v-model="email"
          class="form-control"
          placeholder="Digite seu email"
          required
        />
        <div v-if="emailError" class="text-danger mt-1">{{ emailError }}</div>
        <div v-if="successMessage" class="text-success mt-1">{{ successMessage }}</div>
      </div>

      <div class="d-flex justify-content-center">
        <button type="submit" class="btn custom-btn">Enviar link</button>
      </div>
    </form>

    <p class="text-center mt-3">
      <router-link to="/login" class="text-secondary">Voltar ao login</router-link>
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
h1 {
  text-align: center;
  margin-bottom: 20px;
}

p {
  text-align: center;
}

.custom-btn {
  padding: 10px 25px;
  font-size: 1.25rem;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  background-color: #de7288a8;
  color: white;
  transition: background 0.3s ease;
  min-width: 140px;
}

.custom-btn:hover {
  background-color: #e05a75d6;
}

@media (max-width: 576px) {
  .custom-btn {
    font-size: 1rem;
    padding: 8px 20px;
    min-width: 120px;
  }
}
</style>
