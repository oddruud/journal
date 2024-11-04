<template>
  <div :class="['side-menu', { 'is-open': isOpen }]">
    <button @click="toggleMenu" class="toggle-button">
      {{ isOpen ? 'Close' : 'Open' }} Menu
    </button>
    <nav v-if="isOpen">
      <ul>
        <li>
          <RouterLink to="/" v-slot="{ isActive }">
            <span :class="{ 'active-link': isActive }">Home</span>
          </RouterLink>
        </li>
        <li>
          <RouterLink to="/chat" v-slot="{ isActive }">
            <span :class="{ 'active-link': isActive }">Chat</span>
          </RouterLink>
        </li>
        <li>
          <RouterLink to="/product" v-slot="{ isActive }">
            <span :class="{ 'active-link': isActive }">Product</span>
          </RouterLink>
        </li>
        <li>
          <RouterLink to="/overview" v-slot="{ isActive }">
            <span :class="{ 'active-link': isActive }">Overview</span>
          </RouterLink>
        </li>
        <li v-if="authStore.isLoggedIn">
          <RouterLink to="/diary_entry" v-slot="{ isActive }">
            <span :class="{ 'active-link': isActive }">Diary Entry</span>
          </RouterLink>
        </li>
        <li v-if="authStore.isLoggedIn">
          <RouterLink to="/diary_timeline" v-slot="{ isActive }">
            <span :class="{ 'active-link': isActive }">Diary Timeline</span>
          </RouterLink>
        </li>
      </ul>
    </nav>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { RouterLink } from 'vue-router'
import { useAuthStore } from '../stores/auth'

const isOpen = ref(false)
const authStore = useAuthStore()

const toggleMenu = () => {
  isOpen.value = !isOpen.value
}
</script>

<style scoped>
.side-menu {
  width: 250px;
  transition: transform 0.3s ease;
  transform: translateX(-80%);
  position: fixed;
  top: 0;
  left: 0;
  height: 100%;
  background-color: rgba(51, 51, 51, 0.8);
  color: white;
  overflow: hidden;
  z-index: 1000;
}

.side-menu.is-open {
  transform: translateX(0);
}

.toggle-button {
  background-color: #007bff;
  color: white;
  border: none;
  padding: 10px;
  cursor: pointer;
  width: 50px;
  position: absolute;
  top: 0;
  left: 100%;
  transform: translateX(-100%);
  z-index: 1001;
}

nav ul {
  list-style: none;
  padding: 0;
}

nav li {
  padding: 10px;
}

nav li a {
  color: white;
  text-decoration: none;
}

nav li a:hover {
  text-decoration: underline;
}

nav li span {
  color: white;
  text-decoration: none;
  padding: 5px 10px;
  display: inline-block;
  transition: background-color 0.3s ease;
}

nav li span:hover {
  background-color: rgba(255, 255, 255, 0.1);
  border-radius: 5px;
}

.active-link {
  font-weight: bold;
  text-decoration: underline;
  background-color: rgba(255, 255, 255, 0.2);
  border-radius: 5px;
}
</style>
