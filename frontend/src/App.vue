<template>
  <div id="app" :class="{ 
    fullpage: $route.name === 'NotFound'
  }"> 
    <router-view />
  </div>
</template>

<script setup>
import { watch } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute();

// Função para aplicar ou remover a classe 'no-scroll' no body
const updateBodyScroll = (routeName) => {
  // Se a rota NÃO for 'Dashboard', adiciona a classe para remover o scroll.
  if (routeName !== 'Dashboard') {
    document.body.classList.add('no-scroll');
  } else {
    // Se for 'Dashboard', remove a classe para permitir o scroll.
    document.body.classList.remove('no-scroll');
  }
};

// Observa a mudança de rota e aplica a lógica
watch(() => route.name, (newRouteName) => {
  updateBodyScroll(newRouteName);
}, { immediate: true }); // Executa imediatamente na montagem para a rota inicial

</script>

<style>

/* Aqui estilos globais*/
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  scrollbar-width: none; 
}

html, body, #app {
  min-height: 100vh;
  width: 100%;
  font-family: 'Arial', sans-serif;
  background: linear-gradient(180deg, #200029, #320043, #1d006c); 
}

/* A classe no-scroll é aplicada diretamente no body pelo script */
.no-scroll {
  overflow-y: hidden;
}

::-webkit-scrollbar {
  width: 8px; 
  height: 8px; 
  display: none;
}


</style>
