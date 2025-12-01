<template>
  <meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover">

  <div class="home">
    <img src="../assets/brainneon.png" alt="Brain" class="brain-img" />

    <h1 class="title"><span>My Memory</span></h1>
    <p class="subtitle">Organize seus itens de forma simples e rápida!</p>

    <div class="buttons">
      <router-link to="/register">
        <button class="btn register">Cadastrar</button>
      </router-link>

      <router-link to="/login">
        <button class="btn login">Login</button>
      </router-link>
    </div>
  </div>
</template>

<style scoped>
.home {
  height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  background: transparent; 
  text-align: center;
  padding: 20px;
}

.brain-img {
  width: 180px;
  max-width: 50vw; 
  margin-bottom: 20px; 
  animation: pulse 3s infinite ease-in-out;
  opacity: 0.9;
}

@keyframes pulse {
  0% { transform: scale(1); opacity: 0.85; }
  50% { transform: scale(1.07); opacity: 1; }
  100% { transform: scale(1); opacity: 0.85; }
}

.title {
  font-size: 2.8rem;
  color: white;
  margin-bottom: 10px;
  font-weight: bold;
}

.title span {
  color: #f3b2ff;
  text-shadow: 0 0 15px #c73afa;
}

.subtitle {
  font-size: 1.2rem;
  color: #ffe6f3;
  margin-bottom: 80px; 
  margin-top: 20px;
  padding: 0 10px;
}

.buttons {
  display: flex;
  gap: 20px;
  flex-wrap: wrap;
  justify-content: center;
}

.btn {
  width: 150px;
  padding: 12px 0;
  border-radius: 12px;
  font-size: 1.1rem;
  cursor: pointer;
  background: transparent;
  color: #d796ff; 
  border: 2px solid #b654ff;
  box-shadow: 0 0 10px rgba(182, 84, 255, 0.5);
  backdrop-filter: blur(3px);
  transition: 0.3s ease;
}

.btn:hover {
  transform: scale(1.05);
  color:  #4f87ff;
  border-color: #8db3ff;
  box-shadow: 0 0 15px rgba(141, 173, 255, 0.901);
}

@media (max-width: 600px) {
    .title {
        white-space: nowrap; 
    }
  }

</style>
