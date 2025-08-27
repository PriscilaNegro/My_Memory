<template>
  <div class="container mt-5">
    <h1>Página de Cadastro My Memory 🧠</h1>
    <p>Preencha os dados abaixo para criar sua conta:</p>

    <form @submit.prevent="handleRegister" class="mt-4">
      
      <div class="mb-3 text-start">
        <label for="name" class="form-label">Nome:</label>
        <input
          type="text"
          id="name"
          v-model="name"
          class="form-control"
          placeholder="Digite seu nome"
          required
        />
      </div>

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
      </div>

      <div class="mb-3 text-start">
        <label for="password" class="form-label">Senha:</label>
        <input
          type="password"
          id="password"
          v-model="password"
          class="form-control"
          placeholder="Digite sua senha"
          required
        />
      </div>

      <div class="mb-3 text-start">
        <label for="confirmPassword" class="form-label">Confirmar Senha:</label>
        <input
          type="password"
          id="confirmPassword"
          v-model="confirmPassword"
          class="form-control"
          placeholder="Confirme sua senha"
          required
        />
      </div>

      <!-- Mensagem de erro -->
      <div v-if="error" class="alert alert-danger">
        {{ error }}
      </div>

      <div class="text-center mt-3">
        <button type="submit" class="btn-home">Cadastrar</button>
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref } from "vue";

const name = ref("");
const email = ref("");
const password = ref("");
const confirmPassword = ref("");
const error = ref("");

function handleRegister() {
  error.value = "";

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email.value)) {
    error.value = "Email inválido.";
    return;
  }

  if (password.value !== confirmPassword.value) {
    error.value = "As senhas não conferem.";
    return;
  }

  console.log("Cadastro válido:", name.value, email.value);

  alert("Cadastro realizado com sucesso!");
  // Aqui chama API para salvar o usuário

  // Redireciona para login
  router.push("/login");
}
</script>

<style scoped>
h1 {
  color: #000000;
  text-align: center;
}

p {
  text-align: center;
  font-size: 1.125rem;
  margin-bottom: 2rem;
  font-family: 'Arial', sans-serif;
}

.container {
  max-width: 700px;
  margin: auto;
}

.btn-home {
  width: 160px; 
  padding: 12px 0; 
  font-size: 1.25rem;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  background-color: #de7288a8;
  color: white;
  transition: background 0.3s ease;
}

.btn-home:hover {
  background-color: #e05a75d6;
}
</style>
