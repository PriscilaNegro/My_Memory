<template>
  <div id="app" :class="{ fullpage: $route.name === 'NotFound' }">    
     <router-view />
  </div>
</template>

<script setup>
</script>

<style>

/* Aqui estilos globais*/
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

html, body, #app {
  height: 100%;
  width: 100%;
  font-family: 'Arial', sans-serif;
  background: linear-gradient(180deg, #200029, #320043, #1d006c); 
  overflow-y: hidden;
}

html::-webkit-scrollbar,
body::-webkit-scrollbar {
  display: none; 
}

</style>
