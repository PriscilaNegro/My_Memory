<template>
  <div class="notfound-wrapper">
    <div class="notfound-container">
      <h1>404</h1>
      <h2>Ops, Página não encontrada! 😢</h2>
      <p>A rota que você tentou acessar não existe.</p>

     <div class="d-flex gap-3 flex-wrap justify-content-center">
        <router-link to="/" class="btn btn-home btn-lg">
          Voltar para a Home
        </router-link>
        <router-link to="/login" class="btn btn-login btn-lg">
          Ir para Login
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
</script>

<style scoped>
.notfound-wrapper {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 100%;
  max-width: 600px;
  padding: 1rem;
  box-sizing: border-box;
  text-align: center;
}

.notfound-container h1 {
  font-size: 5rem;
  color: #b11d3ad6;
  margin-bottom: 1rem;
}

.notfound-container h2 {
  margin-bottom: 0.5rem;
}

.notfound-container p {
  margin-bottom: 1.5rem;
  color: #000000;
}

.btn-home {
  background-color: #de7288a8;
  color: white;
  border: none;
}

.btn-home:hover {
  background-color: #e05a75d6;
}

.btn-login {
  background-color: #de7288a8;
  color: white;
  border: none;
}

.btn-login:hover {
  background-color: #e05a75d6;
}
</style>