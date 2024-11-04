<template>
  <img
    v-if="authStore.isLoggedIn"
    @click="toggleMenu"
    :src="avatarUrl"
    alt="User Avatar"
    class="avatar"
  />
  <div :class="['user-menu', { 'is-open': isOpen }]">
    <button v-if="isOpen" @click="toggleMenu" class="close-button">X</button>
    <nav v-if="isOpen">
      <ul>
        <li v-if="authStore.isLoggedIn" class="user-info">
          <img :src="avatarUrl" alt="User Avatar" class="avatar2" />
          <span class="username">{{ userName }}</span>
        </li>
        <li>
          <RouterLink
            to="/profile"
            :class="{ 'active-link': route.path === '/profile' }"
          >
            Profile
          </RouterLink>
        </li>
        <li>
          <RouterLink
            to="/settings"
            :class="{ 'active-link': route.path === '/settings' }"
          >
            Settings
          </RouterLink>
        </li>
        <li>
          <button
            id="logout-button"
            v-if="authStore.isLoggedIn"
            @click="handleLogout"
            class="link-style"
          >
            Sign out
          </button>
        </li>
      </ul>
    </nav>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { RouterLink, useRouter, useRoute } from 'vue-router' // Import useRoute
import { useAuthStore } from '../stores/auth' // Import the auth store

const authStore = useAuthStore() // Initialize the auth store
const userName = computed(() => authStore.userInfo?.username) // Access username property

// Provide a default avatar URL if none is available
const avatarUrl = computed(
  () => authStore.userInfo?.avatarUrl || 'src/assets/avatar.png',
)

const isOpen = ref(false)

const toggleMenu = () => {
  isOpen.value = !isOpen.value
}

const router = useRouter() // Initialize the router
const route = useRoute() // Initialize the route

// Method to handle logout
const handleLogout = () => {
  authStore.logout() // Call the logout function from the auth store
  isOpen.value = false // Close the menu
  router.push('/') // Navigate to the home route
}
</script>

<style scoped>
.user-menu {
  width: 250px;
  transition: transform 0.3s ease;
  transform: translateX(100%);
  position: fixed;
  top: 0;
  right: 0;
  height: 100%;
  background-color: rgba(51, 51, 51, 1);
  color: white;
  overflow: hidden;
  z-index: 1000;
}

.user-menu.is-open {
  transform: translateX(0);
}

.toggle-button {
  background-color: #007bff;
  color: white;
  border: none;
  padding: 10px;
  cursor: pointer;
  position: absolute;
  top: 0;
  left: -50px;
  transform: translateX(-100%);
  z-index: 1001;
}

.close-button {
  background-color: transparent;
  color: white;
  border: none;
  font-size: 20px;
  cursor: pointer;
  position: absolute;
  top: 10px;
  right: 10px;
  z-index: 1002;
}

nav ul {
  list-style: none;
  padding: 0;
}

nav li {
  padding: 10px;
}

nav li a,
#logout-button.link-style {
  color: white;
  text-decoration: none;
  background: none;
  border: none;
  cursor: pointer;
  padding: 10px;
  display: block;
  text-align: left;
}

nav li a:hover,
#logout-button.link-style:hover {
  text-decoration: underline;
}

.username {
  color: white;
  padding: 10px;
  display: block;
  text-align: left;
  font-weight: bold;
}

.avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  margin-right: 10px;
  vertical-align: middle;
  position: absolute;
  top: 10px;
  right: 10px;
  z-index: 999;
}

.user-info {
  display: flex;
  align-items: center;
}

.avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  margin-right: 10px;
  vertical-align: middle;
}

.avatar2 {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  margin-right: 10px;

  z-index: 1001;
}

.username {
  color: white;
  font-weight: bold;
}

.active-link {
  font-weight: bold;
  text-decoration: underline;
}
</style>
