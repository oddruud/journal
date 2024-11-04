<template>
  <div class="messages">
    <MessagesList baseUrl="http://localhost:8080" messageEndpoint="/message" />
  </div>
</template>

<script setup lang="ts">
import MessagesList from '../components/MessagesList.vue'

</script>

<style>
@media (min-width: 1024px) {
  .messages {
    min-height: 100vh;
    display: flex;
    align-items: center;
  }
}
</style>
