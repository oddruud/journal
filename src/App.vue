<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
import Header from './components/Header.vue'
import { useAuthStore } from './stores/auth' // Import the auth store
import { computed } from 'vue'
import { useSettingsStore } from './stores/settings'
import SideMenu from './components/SideMenu.vue'
import UserMenu from './components/UserMenu.vue'

const authStore = useAuthStore() // Initialize the auth store

const config = window.config
</script>

<template>
  <h1>CONTINUITY</h1>
  <SideMenu />
  <div class="login-register">
    <RouterLink to="/register" v-if="!authStore.isLoggedIn">Register</RouterLink
    ><span v-if="!authStore.isLoggedIn"> / </span>
    <RouterLink to="/login" v-if="!authStore.isLoggedIn">Login</RouterLink>
  </div>

  <div class="router-view-container">
    <RouterView />
  </div>
  <UserMenu />
</template>

<style scoped>
.login-register {
  position: absolute; /* Position it absolutely */
  top: 0; /* Align to the top */
  right: 0; /* Align to the right */
  margin: 10px; /* Add some margin for spacing */
  z-index: 10; /* Ensure it appears above other elements */
}

.router-view-container {
  display: flex; /* Use flexbox for centering */
  justify-content: center; /* Center horizontally */
  align-items: center; /* Center vertically */
  height: 100vh; /* Full viewport height */
}

/* Add this CSS to center the h1 */
h1 {
  text-align: center;
  margin: 0 auto; /* Center horizontally */
  font-family: 'Roboto', sans-serif; /* Apply the cool font */
  font-weight: 700; /* Optional: set the font weight */
  position: absolute; /* Position it absolutely */
  top: 10%; /* Center vertically */
  left: 50%; /* Center horizontally */
  transform: translate(-50%, -50%); /* Adjust for the element's size */
}
</style>
