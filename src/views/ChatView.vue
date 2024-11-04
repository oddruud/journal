<template>
  <div class="chat-view">
    <ChatWindow v-if="isChatWindowVisible" />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import ChatWindow from '../components/ChatWindow.vue'

const isChatWindowVisible = ref(true)

function toggleChatWindow() {
  isChatWindowVisible.value = !isChatWindowVisible.value
}
</script>

<style scoped>
.chat-view {
  padding: 1rem;
}

button {
  background-color: #007bff; /* Blue background */
  color: white; /* White text */
  border: none; /* Remove border */
  padding: 0.5rem 1rem; /* Padding */
  border-radius: 5px; /* Rounded corners */
  cursor: pointer; /* Pointer cursor on hover */
  transition: background-color 0.3s; /* Smooth transition */
}

button:hover {
  background-color: #0056b3; /* Darker blue on hover */
}
</style>
