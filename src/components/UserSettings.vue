<template>
  <div class="user-settings">
    <h2>User Settings</h2>
    <form @submit.prevent="updateSettings">
      <!-- Account Settings Category -->
      <fieldset>
        <legend>Account Settings</legend>
        <div>
          <label for="username">Username:</label>
          <input type="text" id="username" v-model="settings.username" />
        </div>
        <div>
          <label for="email">Email:</label>
          <input type="email" id="email" v-model="settings.email" />
        </div>
      </fieldset>

      <!-- Preferences Category -->
      <fieldset>
        <legend>Preferences</legend>
        <div>
          <label for="nightMode">Night Mode:</label>
          <input
            type="checkbox"
            id="nightMode"
            v-model="settings.isNightMode"
          />
        </div>
      </fieldset>

      <button type="submit">Save Settings</button>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useSettingsStore } from '../stores/settings'
import { useAuthStore } from '../stores/auth'

const settingsStore = useSettingsStore()
const authStore = useAuthStore()

const settings = ref({
  username: authStore.userInfo?.username || '',
  email: authStore.userInfo?.email || '',
  isNightMode: settingsStore.isNightMode,
})

const updateSettings = () => {
  // Update user settings logic here
  console.log('Settings updated:', settings.value)
}
</script>

<style scoped>
.user-settings {
  max-width: 600px;
  margin: 3rem auto;
  padding: 2.5rem;
  border: 1px solid #ccc;
  border-radius: 12px;
  background-color: #f9f9f9;
  box-shadow: 0 6px 18px rgba(0, 0, 0, 0.15);
  font-family: 'Futura', sans-serif;
}

.user-settings h2 {
  text-align: center;
  color: #333;
  font-family: 'Futura', sans-serif;
  font-size: 1.8rem;
  margin-bottom: 2rem;
}

.user-settings form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.user-settings fieldset {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.user-settings div {
  display: flex;
  align-items: center;
}

.user-settings label {
  width: 120px;
  margin-bottom: 0.5rem;
  font-weight: 600;
  color: #555;
  font-family: 'Futura', sans-serif;
}

.user-settings input[type='text'],
.user-settings input[type='email'],
.user-settings input[type='checkbox'] {
  flex: 1;
  margin-bottom: 1.2rem;
  padding: 0.6rem;
  border: 1px solid #bbb;
  border-radius: 6px;
  transition:
    border-color 0.3s,
    box-shadow 0.3s;
}

.user-settings input:focus {
  border-color: #888;
  box-shadow: 0 0 5px rgba(0, 0, 0, 0.1);
  outline: none;
}

.user-settings button[type='submit'] {
  padding: 0.8rem;
  background-color: #0056b3;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition:
    background-color 0.3s,
    transform 0.3s;
  font-family: 'Futura', sans-serif;
}

.user-settings button[type='submit']:hover {
  background-color: #003d7a;
  transform: translateY(-2px);
}

/* New style for legend elements */
.user-settings legend {
  color: black;
  font-weight: bold;
}
</style>
