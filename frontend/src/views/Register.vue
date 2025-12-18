<template>
  <div class="register-page">

    <h1 class="title"><span>Crie sua Conta</span></h1>
    <p class="subtitle">Preencha os dados abaixo para começar</p>

    <form v-on:submit.prevent="handleRegister" class="form-box">

      <div class="input-group">
        <label for="name">Nome</label>
        <input
          type="text"
          id="name"
          v-model="form.name"
          placeholder="Digite seu nome"
          required
        />
        <p v-if="form.name.length > 0 && form.name.length < 3" class="error-msg">
          O nome deve ter no mínimo 3 caracteres.
        </p>
      </div>

      <div class="input-group">
        <label for="email">E-mail</label>
        <input
          type="email"
          id="email"
          v-model="form.email"
          placeholder="Digite seu e-mail"
          required
        />
        <p v-if="errors.email" class="error-msg">{{ errors.email }}</p>
      </div>

      <div class="input-group">
        <label for="password">Senha</label>
        <input
          type="password"
          id="password"
          v-model="form.password"
          placeholder="Digite sua senha"
          required
        />
        <p v-if="form.password.length > 0 && form.password.length < 6" class="error-msg">
          A senha deve ter no mínimo 6 caracteres.
        </p>
      </div>

      <div class="input-group">
        <label for="confirmPassword">Confirmar Senha</label>
        <input
          type="password"
          id="confirmPassword"
          v-model="form.confirmPassword"
          placeholder="Confirme sua senha"
          required
        />
        <p v-if="errors.password" class="error-msg">{{ errors.password }}</p>
      </div>

      <div class="btn-area">
        <button type="submit" class="btn-main">Cadastrar</button>
      </div>

    </form>

    <Notification :visible="showNotification" message="Cadastro realizado com sucesso! Redirecionando..." />
  </div>
</template>

<script setup>
import { ref, reactive } from "vue";
import { useRouter } from "vue-router";
import Notification from '../views/Notification.vue';
import api from "../api";

const router = useRouter();
const showNotification = ref(false);

const form = reactive ({
  name: '',
  email: '',
  password: '',
  confirmPassword: ''
});

const errors = reactive({
  email: "",
  password: "",
});

const allowedDomains = ["gmail.com", "hotmail.com", "outlook.com", "yahoo.com"];

const handleRegister = async () => {
  if (form.name.trim().length < 3) {
    errors.name = "O nome deve ter no mínimo 3 caracteres.";
    return;
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(form.email)) {
    errors.email = "Email inválido.";
    return;
  }

  const domain = form.email.split("@")[1];
  if (!allowedDomains.some(d => domain.endsWith(d))) {
    errors.email = `Somente emails dos provedores ${allowedDomains.join(", ")} são aceitos.`;
    return;
  }

  if (form.password.length < 6) {
    errors.password = "A senha deve ter no mínimo 6 caracteres.";
    return;
  }

  if (form.password !== form.confirmPassword) {
    errors.password = "As senhas não conferem.";
    return;
  }

  try {
    const response = await api.post("/users", form);

    if (response) {
      form.name = "";
      form.email = "";
      form.password = "";
      form.confirmPassword = "";

      showNotification.value = true;
      setTimeout(() => {
        router.push('/login');
      }, 1500);
    }

  } catch (error) {
    if (error.response && error.response.data) {
      errors.email = error.response.data.message;
    } else {
      console.error("Erro inesperado:", error);
    }
  }
}
</script>

<style scoped>
.register-page {
  min-height: 100vh;
  background: transparent;
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
  margin-top: 0;
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
  margin-bottom: 20px;
  margin-top: 5px;
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
  background: transparent !important;
  border: 2px solid #b654ff;
  border-radius: 10px !important;
  color: #c7d9ff;
  font-size: 1rem;
  outline: none;
  box-shadow: 0 0 8px 1px rgba(182, 84, 255, 0.5);
  transition: 0.3s ease;
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

.btn-area {
  display: flex;
  justify-content: center;
  margin-top: 20px;
}

button { 
  margin-top: 20px;
 }

 @media (max-width: 360px) {
  .title {
    font-size: 2rem;
  }
}

@media (max-width: 480px) {
  .register-page {
    min-height: 100svh;
    overflow-y: auto;      
    padding-bottom: 20px; 
    margin-top: 10vh; 
  }

  .title {
    margin-top: 0; 
    margin-bottom: 10px; 
  }

  .subtitle {
    margin-top: 10px; 
    margin-bottom: 20px;
  }

  .btn-area {
    margin-bottom: 10px;   
  }

  button {
    margin-top: 15px;    
  }
}

@media (max-width: 768px) {
  .register-container {
    padding-bottom: 40px;
  }
}

</style>
