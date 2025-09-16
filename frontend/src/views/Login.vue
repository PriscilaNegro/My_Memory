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
          v-model="form.email"
          class="form-control"
          placeholder="Digite seu email"
          required
          @blur="validateEmail"
          @input="errors.api = ''"
        />
        <p v-if="errors.email" class="text-danger mt-1">{{ errors.email }}</p>
      </div>

      <div class="mb-3 text-start">
        <label for="password" class="form-label">Senha:</label>
        <div class="input-group">
          <input
            :type="showPassword ? 'text' : 'password'"
            id="password"
            v-model="form.password"
            class="form-control"
            placeholder="Digite sua senha"
            required
            @blur="validatePassword"
            @input="errors.api = ''"
          />
          <button
            type="button"
            class="btn btn-outline-secondary"
            @click="togglePassword"
            >
           <i :class="showPassword ? 'bi bi-eye-slash' : 'bi bi-eye'"></i>
          </button>

        </div>
        <p v-if="errors.password" class="text-danger mt-1">{{ errors.password }}</p>
      </div>

      <div class="text-center mb-3 forgot-password">
        <router-link to="/forgot-password" class="text-decoration-none">
          Esqueci minha senha
        </router-link>
      </div>

      <p v-if="errors.api" class="text-danger mt-2">{{ errors.api }}</p>

      <div class="text-center mt-3">
        <button 
          type="submit" 
          class="btn-home" 
          :disabled="!isFormValid"
          >
          Entrar
        </button>
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref, reactive, computed } from "vue";
import { useRouter } from "vue-router";
import api from "../api";

const router = useRouter();

const form = reactive ({
  email: '',
  password: '',
});

const showPassword = ref(false);

const errors = reactive({
  email: "",
  password: "",
  api: ""
});

function togglePassword() {
  showPassword.value = !showPassword.value;
}

// Validações básicas
function validateEmail() {
  errors.email = "";

  if (!form.email.trim()) {
    errors.email = "O email é obrigatório.";
    return false;
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(form.email)) {
    errors.email = "Email inválido.";
    return false;
  }

  const allowedDomains = ["gmail.com", "hotmail.com", "outlook.com", "yahoo.com"];
  const domain = form.email.split("@")[1];
  if (!allowedDomains.some(d => domain.endsWith(d))) {
    errors.email = `Somente emails dos provedores ${allowedDomains.join(", ")} são aceitos.`;
    return false;
  }
  return true;
}

function validatePassword() {
  errors.password = "";

  if (!form.password.trim()) {
    errors.password = "A senha é obrigatória.";
    return false;
  }

  if (form.password.length < 6) {
    errors.password = "A senha deve ter no mínimo 6 caracteres.";
    return false;
  }

  return true;
}

const isFormValid = computed(() => {
  return (
    form.email.trim() &&
    form.password.trim() &&
    form.password.length >= 6 &&
    errors.email  === "" &&
    errors.password  === "" 
  );
});

function validateForm() {
  const emailValid = validateEmail();
  const passwordValid = validatePassword();
  return emailValid && passwordValid;
}

const handleLogin = async () => {
  if (!validateForm()) return;

  try {
    // chamada para a API de login
    const response = await api.post("/users/login", form);

    if (response){
      // salva o token no localStorage
      localStorage.setItem("token", response.data.token);
      router.push("/dashboard"); 
    }
    else{    
      if (response.status === 401) {
        errors.api = "Email ou senha incorretos.";
        return;
      }

      if (!response.ok) {
        errors.api = "Erro ao conectar com o servidor.";
        return;
      }
  }
  } catch (error) {
    errors.api = error.response.data.message || "Erro ao realizar login.";
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

.forgot-password a {
  color: rgb(83, 83, 83);
  text-decoration: none;
  font-size: 0.95rem;
}

.forgot-password a:hover {
  color: #313131; 
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

.btn-home:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}


</style>


