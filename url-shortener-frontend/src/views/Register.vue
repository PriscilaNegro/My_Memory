<template>
  <div class="container mt-5">
    <h1>Página de Cadastro My Memory 🧠</h1>
    <p>Preencha os dados abaixo para criar sua conta:</p>

    <form @submit.prevent="handleRegister" class="mt-4">
      <!-- Nome -->
      <div class="mb-3">
        <label for="name" class="form-label">Nome</label>
        <input
          type="text"
          id="name"
          v-model="name"
          class="form-control"
          placeholder="Digite seu nome"
          required
        />
      </div>

      <!-- Email -->
      <div class="mb-3">
        <label for="email" class="form-label">Email</label>
        <input
          type="email"
          id="email"
          v-model="email"
          class="form-control"
          placeholder="Digite seu email"
          required
        />
      </div>

      <!-- Senha -->
      <div class="mb-3">
        <label for="password" class="form-label">Senha</label>
        <input
          type="password"
          id="password"
          v-model="password"
          class="form-control"
          placeholder="Digite sua senha"
          required
        />
      </div>

      <!-- Confirmação de Senha -->
      <div class="mb-3">
        <label for="confirmPassword" class="form-label">Confirmar Senha</label>
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

      <!-- Botão de cadastro -->
      <button type="submit" class="btn btn-primary">Cadastrar</button>
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

  // Validação de email
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email.value)) {
    error.value = "Email inválido.";
    return;
  }

  // Verificação de senha
  if (password.value !== confirmPassword.value) {
    error.value = "As senhas não conferem.";
    return;
  }

  // Cadastro válido
  console.log("Cadastro válido:", name.value, email.value);

  alert("Cadastro realizado com sucesso!");
  // Aqui você chamaria sua API para salvar o usuário
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
</style>
