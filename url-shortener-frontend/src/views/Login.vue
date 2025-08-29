<template>
  <div class="container mt-5">
    <h1>My Memory 🧠</h1>
    <p>Informe seus dados para acessar sua conta:</p>

    <form @submit.prevent="handleLogin" class="mt-4">

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
        <p v-if="errors.email" class="text-danger mt-1">{{ errors.email }}</p>
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
        <p v-if="errors.password" class="text-danger mt-1">{{ errors.password }}</p>
      </div>

      <div class="text-center mt-3">
        <button type="submit" class="btn-home">Entrar</button>
      </div>
    </form>

    <Notification
      :visible="showNotification"
      message="Login realizado com sucesso! Redirecionando..."
    />
  </div>
</template>

<script setup>
import { ref, reactive } from "vue";
import { useRouter } from "vue-router";
import Notification from "../views/Notification.vue";

const router = useRouter();

const email = ref("");
const password = ref("");
const showNotification = ref(false);

const errors = reactive({
  email: "",
  password: "",
});

// Validações básicas
function validateForm() {
  errors.email = "";
  errors.password = "";

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email.value)) {
    errors.email = "Email inválido.";
    return false;
  }

  if (password.value.length < 6) {
    errors.password = "A senha deve ter no mínimo 6 caracteres.";
    return false;
  }

  return true;
}

async function handleLogin() {
  if (!validateForm()) return;

  try {
    // chamada para a API de login
    const response = await fetch("http://localhost:3000/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: email.value,
        password: password.value,
      }),
    });

    if (!response.ok) {
      throw new Error("Credenciais inválidas.");
    }

    const data = await response.json();

    // salva o token no localStorage
    localStorage.setItem("token", data.token);

    showNotification.value = true;

    setTimeout(() => {
      router.push("/dashboard"); // página futura
    }, 2000);
  } catch (error) {
    errors.password = error.message || "Erro ao realizar login.";
  }
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
  font-family: "Arial", sans-serif;
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
