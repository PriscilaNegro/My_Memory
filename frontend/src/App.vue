<template>
  <div id="app":class="{ fullpage: $route.name === 'NotFound' }">    
     <router-view />
  </div>
</template>

<script setup>
</script>

<style>

/* Aqui estilos globais*/
body {
  margin: 0;
  font-family: Arial, sans-serif;
}
</style>
