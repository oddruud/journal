<template>
  <div class="messages-list">
    <h2>Messages</h2>
    <ul>
      <MessageItem v-for="message in messages" :key="message.id" :imageSrc="`${props.baseUrl}/${message.avatar}`">
        <template #author>{{ message.author }}</template>
        <template #content>{{ message.content }}</template>
      </MessageItem>
    </ul>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, defineProps } from 'vue'
import MessageItem from './MessageItem.vue' // Import the MessageItem component

const props = defineProps<{
  baseUrl: string  
  messageEndpoint: string
}>()

const messages = ref([])

const fetchMessages = async () => {
  try {
    const response = await fetch(`${props.baseUrl}${props.messageEndpoint}`) // Use the apiUrl prop
    if (!response.ok) {
      throw new Error('Network response was not ok')
    }
    messages.value = await response.json()
  } catch (error) {
    console.error('Error fetching messages:', error)
  }
}

onMounted(() => {
  fetchMessages()
})
</script>

<style scoped>
.messages-list {
  padding: 1rem;
}
.messages-list h2 {
  margin-bottom: 1rem;
}
.messages-list ul {
  list-style-type: none;
  padding: 0;
}
</style>
