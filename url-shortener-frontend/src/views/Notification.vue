<template>
  <transition name="slide-fade">
    <div v-if="visible" class="notification-container">
      <div class="notification-content">
        ✅
        <p>{{ message }}</p>
      </div>
    </div>
  </transition>
</template>

<script setup>
  defineProps({
    visible: Boolean,
    message: String,
  });
</script>

<style scoped>
.notification-container {
  position: fixed;
  top: 20px;
  right: 20px;
  background-color: #28a745; 
  color: white;
  padding: 15px 25px;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  z-index: 9999;
}
.notification-content {
  display: flex;
  align-items: center;
  gap: 15px;
  font-size: 1rem;
}

.slide-fade-enter-active, .slide-fade-leave-active {
  transition: all 0.5s ease;
}
.slide-fade-enter-from, .slide-fade-leave-to {
  transform: translateX(100%);
  opacity: 0;
}
</style>
