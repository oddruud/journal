<template>
  <div class="register">
    <form @submit.prevent="handleRegister">
      <div>
        <label for="username">Username:</label>
        <input type="text" id="username" v-model="username" required />
      </div>
      <div>
        <label for="password">Password:</label>
        <input type="password" id="password" v-model="password" required />
      </div>
      <div>
        <label for="email">Email:</label>
        <input type="email" id="email" v-model="email" required />
      </div>
      <button type="submit">Register</button>
    </form>
    <p v-if="message" class="message">{{ message }}</p>
    <!-- Display message -->
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth' // Import the auth store

const username = ref('')
const password = ref('')
const email = ref('')
const message = ref('') // Reactive variable for messages
const router = useRouter()
const authStore = useAuthStore()

const handleRegister = async () => {
  try {
    const response = await fetch(`${window.config.backEndUrl}/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username: username.value,
        password: password.value,
        email: email.value,
      }),
    })

    if (!response.ok) {
      throw new Error('Registration failed')
    }

    const data = await response.json()
    message.value =
      'Registration successful! Please check your email for confirmation.' // Set success message
  } catch (error) {
    console.error('Error during registration:', error)
    message.value = error instanceof Error ? error.message : String(error) // Convert error to string
  }
}
</script>

<style scoped>
.register {
  max-width: 400px;
  margin: auto;
  padding: 2rem;
  border: 1px solid #ccc;
  border-radius: 8px;
  background-color: #f9f9f9;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1); /* Added shadow for depth */
}

h1 {
  text-align: center; /* Center the heading */
  color: black; /* Changed color to black */
}

form {
  display: flex;
  flex-direction: column;
}

div {
  display: flex;
  align-items: center;
  margin-bottom: 1rem;
}

label {
  margin-right: 1rem;
  font-weight: bold;
  color: black;
}

input {
  flex: 1;
  padding: 0.5rem;
  border: 1px solid #ccc;
  border-radius: 4px;
  transition: border-color 0.3s;
  color: black;
}

input:focus {
  border-color: #007bff;
  outline: none;
}

button {
  padding: 0.7rem;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s;
}

button:hover {
  background-color: #0056b3;
}

.message {
  color: black;
}
</style>
