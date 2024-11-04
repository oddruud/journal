<template>
  <div class="login">
    <form @submit.prevent="handleLogin">
      <div>
        <label for="username">Username:</label>
        <input type="text" id="username" v-model="username" required />
      </div>
      <div>
        <label for="password">Password:</label>
        <input type="password" id="password" v-model="password" required />
      </div>
      <button type="submit">Login</button>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth' // Import the auth store
import type { UserInfo } from '../types/UserInfo' // Import the UserInfo type

const username = ref('')
const password = ref('')
const authStore = useAuthStore() // Initialize the auth store
const router = useRouter() // Initialize the router

const handleLogin = async () => {
  try {
    const response = await fetch(`${window.config.backEndUrl}/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username: username.value,
        password: password.value,
      }),
    })

    if (!response.ok) {
      throw new Error('Login failed')
    }

    const data: UserInfo = await response.json() // Use UserInfo type for response data
    authStore.login(data) // Pass the entire UserInfo object to the login function

    router.push('/') // Redirect to home view
  } catch (error) {
    console.error('Error during login:', error)
  }
}

const handleGoogleLogin = async () => {
  try {
    // Implement Google login logic here
    // This might involve redirecting to a Google login page or using a library like gapi
    console.log('Google login initiated')
  } catch (error) {
    console.error('Error during Google login:', error)
  }
}

// Check if user is already logged in on component mount
onMounted(() => {
  if (authStore.isLoggedIn) {
    router.push('/') // Redirect to home if already logged in
  }
})
</script>

<style scoped>
.login {
  max-width: 400px;
  margin: auto;
  padding: 2rem;
  border: 1px solid #e0e0e0;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  background-color: #ffffff;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

h1 {
  text-align: center;
  margin-bottom: 1.5rem;
  color: #333;
  font-size: 1.5rem;
  font-weight: 600;
}

form {
  display: flex;
  flex-direction: column;
}

div {
  display: flex;
  align-items: center;
  margin-bottom: 1.5rem;
}

label {
  margin-right: 1rem;
  font-weight: 600;
  color: #444;
  width: 100px;
}

input {
  flex: 1;
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 1rem;
  transition: border-color 0.3s;
}

input:focus {
  border-color: #007bff;
  outline: none;
}

button {
  padding: 0.75rem;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 1rem;
  transition: background-color 0.3s;
}

button:hover {
  background-color: #0056b3;
}

.google-login {
  margin-top: 1rem;
  background-color: #db4437;
  color: white;
  border-radius: 6px;
  transition: background-color 0.3s;
}

.google-login:hover {
  background-color: #c33d2e;
}
</style>
