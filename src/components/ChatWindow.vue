<template>
  <div class="chat-window">
    <div class="messages-area">
      <div class="messages-area-inner">
        <ul>
          <li
            v-for="(message, index) in chatHistory"
            :key="message.id"
            :class="[
              message.type,
              { 'fade-in': index === chatHistory.length - 1 },
            ]"
          >
            <img :src="message.avatar" alt="avatar" class="avatar" />
            <strong
              ><b>{{ message.user }}</b
              >:</strong
            >
            {{ message.content }}
          </li>
          <li v-if="isTyping" class="typing-indicator">
            User is typing<span class="dot">.</span><span class="dot">.</span
            ><span class="dot">.</span>
          </li>
        </ul>
      </div>
    </div>
    <div class="input-area">
      <input
        v-model="userInput"
        @keyup.enter="sendMessage"
        placeholder="Type your message..."
      />
      <button @click="sendMessage">Send</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, nextTick } from 'vue'
import { useAuthStore } from '../stores/auth'

const chatHistory = ref<
  { id: number; content: string; user: string; type: string; avatar: string }[]
>([])
const userInput = ref('')
let messageId = 0
const isTyping = ref(false)

const authStore = useAuthStore()
const userName = computed(() => authStore.userInfo?.username)
const userAvatar = computed(() => authStore.userInfo?.avatarUrl)

const sendMessage = async () => {
  if (userInput.value.trim() === '') return

  chatHistory.value.push({
    id: messageId++,
    content: userInput.value,
    user: userName.value || 'Anonymous',
    type: 'user',
    avatar: userAvatar.value || 'src/assets/avatar.svg',
  })

  isTyping.value = true

  await nextTick()
  scrollToBottom()

  try {
    const response = await fetch(`${window.config.backEndUrl}/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ message: userInput.value }),
    })

    if (!response.ok) {
      throw new Error('Network response was not ok')
    }

    const answer = await response.json()

    chatHistory.value.push({
      id: messageId++,
      content: answer.answer,
      user: answer.user,
      type: 'bot',
      avatar: userAvatar.value || 'src/assets/avatar.svg',
    })

    await nextTick()
    scrollToBottom()
  } catch (error) {
    console.error('Error fetching answer:', error)
  } finally {
    isTyping.value = false
    userInput.value = ''
  }
}

const scrollToBottom = () => {
  const messagesArea = document.querySelector('.messages-area')
  if (messagesArea) {
    messagesArea.scrollTop = 100000
  }
}
</script>

<style scoped>
.chat-window {
  padding: 1rem;
  border: 1px solid #333;
  border-radius: 8px;
  background-color: #fff;
  max-width: 600px;
  margin: 0 auto;
  color: #000;
}

.chat-window h2 {
  margin-bottom: 1rem;
}

.chat-window ul {
  list-style-type: none;
  padding: 0;
  max-height: 300px;
  overflow-y: auto;
}

.chat-window li {
  display: flex;
  align-items: center;
  margin-bottom: 0.5rem;
  padding: 0.5rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  background-color: #fff;
}

.avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  margin-right: 10px;
}

.chat-window li.user {
  background-color: #b3e5fc;
  text-align: right;
}

.chat-window li.bot {
  background-color: #c8e6c9;
  text-align: left;
}

.input-area {
  display: flex;
  margin-top: 1rem;
}

input {
  flex: 1;
  padding: 0.5rem;
  border: 1px solid #ccc;
  border-radius: 4px;
  margin-right: 0.5rem;
}

button {
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 4px;
  background-color: #388e3c;
  color: #fff;
  cursor: pointer;
  transition: background-color 0.3s;
}

button:hover {
  background-color: #2e7d32;
}

.messages-area {
  height: 300px;
  max-height: 300px;
  overflow-y: auto;
  display: flex;
  flex-direction: column-reverse;
}

.fade-in {
  animation: fadeIn 0.5s ease-in-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes slideInFromBelow {
  from {
    transform: translateY(20px);
  }
  to {
    transform: translateY(0);
  }
}

.typing-indicator {
  font-style: italic;
  color: #888;
}

.dot {
  animation: blink 1.5s infinite step-start;
  display: inline-block;
}

.dot:nth-child(1) {
  animation-delay: 0s;
}

.dot:nth-child(2) {
  animation-delay: 0.3s;
}

.dot:nth-child(3) {
  animation-delay: 0.6s;
}

@keyframes blink {
  0%,
  20% {
    opacity: 0;
  }
  40% {
    opacity: 1;
  }
  60% {
    opacity: 0;
  }
  80%,
  100% {
    opacity: 1;
  }
}
</style>
