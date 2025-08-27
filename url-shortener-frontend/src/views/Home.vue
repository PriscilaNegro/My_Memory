<template>
  <div class="home">
    <h1>Bem-vindo ao My Memory 🧠</h1>
    <p>Organize seus itens de forma simples e rápida!</p>

    <div class="buttons">
      <router-link to="/register">
        <button>Cadastrar</button>
      </router-link>

      <router-link to="/login">
        <button>Login</button>
      </router-link>
    </div>
  </div>
</template>

<script setup>
</script>

<style scoped>
.home {
  text-align: center;
  position: relative;
  top: -30px;
}

.home p {
  font-size: 18px; 
  margin-bottom: 20px; 
  color: #000000; 
}

.buttons {
  margin-top: 20px;
  display: flex;
  justify-content: center;
  gap: 15px;
}

button {
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

button:hover {
  background-color: #e05a75d6;
}
</style>
