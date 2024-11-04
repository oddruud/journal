import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { UserInfo } from '../types/UserInfo' // Use type-only import

export const useAuthStore = defineStore('auth', () => {
  const isLoggedIn = ref(!!localStorage.getItem('isLoggedIn'))
  const userInfoJsonString = localStorage.getItem('userInfo') || '{}' // Provide default value

  const userInfo = ref<UserInfo | null>(JSON.parse(userInfoJsonString)) // Allow null

  function login(user: UserInfo) {
    isLoggedIn.value = true
    userInfo.value = user // Store user information
    localStorage.setItem('isLoggedIn', 'true') // Save login state
    localStorage.setItem('userInfo', JSON.stringify(user)) // Save user information
  }

  function logout() {
    isLoggedIn.value = false
    userInfo.value = null // Clear user information
    localStorage.removeItem('isLoggedIn') // Remove login state
    localStorage.removeItem('userInfo') // Remove user information
  }

  return { isLoggedIn, userInfo, login, logout }
})
