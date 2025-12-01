<template>
  <div class="login-page">

    <h1 class="title"><span>Entrar</span></h1>
    <p class="subtitle">Bem-vindo de volta! Acesse sua conta</p>

    <form @submit.prevent="handleLogin" class="form-box">

      <!-- EMAIL -->
      <div class="input-group-custom">
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

      <!-- SENHA -->
      <div class="input-group-custom">
        <label for="password">Senha</label>

        <div class="password-wrapper">
          <input
            :type="showPassword ? 'text' : 'password'"
            id="password"
            v-model="form.password"
            placeholder="Digite sua senha"
            required
          />

          <!-- ícone/btn olho -->
          <button type="button" class="eye-btn" @click="togglePassword" aria-label="Mostrar senha">
            <i :class="showPassword ? 'bi bi-eye-slash' : 'bi bi-eye'"></i>
          </button>
        </div>

        <p v-if="errors.password" class="error-msg">{{ errors.password }}</p>
      </div>

      <div class="forgot">
        <router-link to="/forgot-password">Esqueci minha senha</router-link>
      </div>

      <p v-if="errors.api" class="error-msg">{{ errors.api }}</p>

      <div class="btn-area">
        <button 
          type="submit" 
          class="btn-main"
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

// reactive form (garante que template sempre veja a referência)
const form = reactive({
  email: "",
  password: "",
});

// estado de exibição da senha
const showPassword = ref(false);

const errors = reactive({
  email: "",
  password: "",
  api: "",
});

const router = useRouter();

function togglePassword() {
  showPassword.value = !showPassword.value;
}

/* Validações simples reutilizadas */
function validateEmailField() {
  errors.email = "";
  if (!form.email || !form.email.trim()) {
    errors.email = "O email é obrigatório.";
    return false;
  }
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(form.email)) {
    errors.email = "Email inválido.";
    return false;
  }
  const allowedDomains = ["gmail.com", "hotmail.com", "outlook.com", "yahoo.com"];
  const domain = form.email.split("@")[1] || "";
  if (!allowedDomains.some(d => domain.endsWith(d))) {
    errors.email = `Somente emails dos provedores ${allowedDomains.join(", ")} são aceitos.`;
    return false;
  }
  return true;
}

function validatePasswordField() {
  errors.password = "";
  if (!form.password || !form.password.trim()) {
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
    form.email.trim().length > 0 &&
    form.password.trim().length >= 6 &&
    errors.email === "" &&
    errors.password === ""
  );
});

const handleLogin = async () => {
  // valida antes de submeter
  const eOk = validateEmailField();
  const pOk = validatePasswordField();
  if (!eOk || !pOk) return;

  errors.api = "";
  try {
    const response = await api.post("/users/login", {
      email: form.email,
      password: form.password,
    });

    // assume padrão { data: { token: "..." } }
    if (response && response.data && response.data.token) {
      localStorage.setItem("token", response.data.token);
      // limpar form (opcional)
      form.email = "";
      form.password = "";
      router.push("/dashboard");
    } else {
      // fallback para casos estranhos
      errors.api = "Resposta inesperada do servidor.";
    }
  } catch (err) {
    // tratar resposta do backend
    errors.api = err?.response?.data?.message || "Erro ao realizar login.";
  }
};
</script>

<style scoped>
.login-page {
  min-height: 100vh;
  width: 100%;
  background: transparent;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  padding: 20px;
}

.title {
  font-size: 2.5rem;
  font-weight: bold;
  margin-top: 20px;
  text-align: center;
  white-space: nowrap;
}

.title span {
  color: #f3b2ff;
  text-shadow: 0 0 15px #c73afa;
}

.subtitle {
  font-size: 1.1rem;
  color: #ffe6f3;
  margin-bottom: 40px;
  margin-top: 20px;
}

.form-box {
  width: 100%;
  max-width: 420px;
  background: transparent;
  padding: 0 10px;
  border-radius: 0;
}

/* inputs */
.input-group-custom {
  margin-bottom: 18px;
  text-align: left;
}

label {
  color: #e7baff;
  display: block;
  margin-bottom: 6px;
  font-size: 0.95rem;
}

input {
  width: 100%;
  padding: 12px 44px 12px 12px; 
  background: transparent !important;
  border: 2px solid #b654ff;
  border-radius: 10px;
  color: #c7d9ff;
  font-size: 1rem;
  outline: none;
  box-shadow: 0 0 8px rgba(182, 84, 255, 0.5);
  transition: 0.25s ease;
}

input::placeholder {
  color: #c9a6ff;
}

input:focus {
  border-color: #8db3ff;
  box-shadow: 0 0 12px #8db3ff;
}

/* wrapper senha + olho */
.password-wrapper {
  position: relative;
  width: 100%;
}

/* botão olho - estilizado como botão transparente */
.eye-btn {
  position: absolute;
  right: 8px;
  top: 50%;
  transform: translateY(-50%);
  border: none;
  background: transparent;
  color: #c9a6ff;
  padding: 6px;
  cursor: pointer;
  font-size: 1.1rem;
}

/* evita que o botão mova o foco/submit quando clicar */
.eye-btn:focus {
  outline: none;
}

/* forgot */
.forgot {
  width: 100%;
  text-align: right;
  margin-bottom: 12px;
}

.forgot a {
  color: #c9a6ff;
  text-decoration: none;
}

.forgot a:hover {
  color: #ffffff;
}

/* erros */
.error-msg {
  color: #ffb4d6;
  font-size: 0.9rem;
  margin-top: 6px;
}

/* botão principal */
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

.btn-main:disabled {
  opacity: 0.45;
  cursor: not-allowed;
}

.btn-area {
  display: flex;
  justify-content: center;
  margin-top: 22px;
}

@media (max-width: 480px) {
  .login-page {
    min-height: auto;
    padding-bottom: 40px;
  }

  .btn-area {
    margin-bottom: 10px;
  }

  .btn-main {
    margin-top: 8px;
  }

  input {
    padding-right: 40px;
  }
}
</style>
