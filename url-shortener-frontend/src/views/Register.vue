<template>
  <div class="container mt-5">
    <h1>Cadastro My Memory 🧠</h1>
    <p>Preencha os dados abaixo para criar sua conta:</p>

    <form @submit.prevent="handleRegister" class="mt-4">
      
      <div class="mb-3 text-start">
        <label for="name" class="form-label"> Nome:</label>
        <input
          type="text"
          id="name"
          v-model="name"
          class="form-control"
          placeholder="Digite seu nome"
          required
        />
        <p v-if="name.length > 0 && name.length < 3" class="text-danger mt-1">
          O nome deve ter no mínimo 3 caracteres.
        </p>
      </div>

      <div class="mb-3 text-start">
        <label for="email" class="form-label"> Email:</label>
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
        <label for="password" class="form-label"> Senha:</label>
        <input
          type="password"
          id="password"
          v-model="password"
          class="form-control"
          placeholder="Digite sua senha"
          required
        />
        <p v-if="password.length > 0 && password.length < 6" class="text-danger mt-1">
          A senha deve ter no mínimo 6 caracteres.
        </p>
      </div>

      <div class="mb-3 text-start">
        <label for="confirmPassword" class="form-label"> Confirmar Senha:</label>
        <input
          type="password"
          id="confirmPassword"
          v-model="confirmPassword"
          class="form-control"
          placeholder="Confirme sua senha"
          required
        />
        <p v-if="errors.password" class="text-danger mt-1">{{ errors.password }}</p>
      </div>

      <div class="text-center mt-3">
        <button type="submit" class="btn-home">Cadastrar</button>
      </div>
    </form>
  </div>
  <Notification :visible="showNotification" message="Cadastro realizado com sucesso! Redirecionando..." />
</template>

<script setup>
import { ref, reactive } from "vue";
import { useRouter } from "vue-router";
import Notification from '../views/Notification.vue';

const router = useRouter();
const showNotification = ref(false);

const name = ref("");
const email = ref("");
const password = ref("");
const confirmPassword = ref("");

const errors = reactive({
   name: "",
   email: "",
   password: "",
   confirmPassword: ""
});

const allowedDomains = ["gmail.com", "hotmail.com", "outlook.com", "yahoo.com"];

function handleRegister() {
  errors.name = "";
  errors.email = "";
  errors.password = "";
  errors.confirmPassword = "";

  if (name.value.trim().length < 3) {
  errors.name = "O nome deve ter no mínimo 3 caracteres.";
  return;
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email.value)) {
    errors.email = "Email inválido.";
    return;
  }

  const domain = email.value.split("@")[1];
  if (!allowedDomains.some(d => domain.endsWith(d))) {
    errors.email = `Somente emails dos provedores ${allowedDomains.join(", ")} são aceitos.`;
    return;
  }

  if (password.value.length < 6) {
    errors.password = "A senha deve ter no mínimo 6 caracteres.";
    return;
  }

  if (password.value !== confirmPassword.value) {
    errors.password = "As senhas não conferem.";
    return;
  }

  console.log("Cadastro válido:", name.value, email.value);
  
  // Aqui chama API para salvar o usuário

  showNotification.value = true; 

  setTimeout(() => {
    router.push('/login');
  }, 3000);
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
