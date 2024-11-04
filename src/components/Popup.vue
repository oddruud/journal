<template>
  <div class="popup" v-if="isVisible">
    <div class="popup-content">
      <button class="close-button" @click="closePopup">Close</button>
      <slot></slot>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const isVisible = ref(true)

const closePopup = () => {
  isVisible.value = false
}
</script>

<style scoped>
.popup {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 300px;
  height: 300px;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.popup-content {
  color: white;
  padding: 30px;
  border-radius: 10px;
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.3);
  max-width: 90%;
  max-height: 80%;
  overflow-y: auto;
}

.close-button {
  background-color: #f44336;
  color: white;
  border: none;
  padding: 10px 15px;
  border-radius: 5px;
  cursor: pointer;
  transition:
    background-color 0.3s,
    transform 0.2s;
  position: absolute;
  top: 10px;
  right: 10px;
}

.close-button:hover {
  background-color: #d32f2f;
  transform: scale(1.05);
}
</style>
