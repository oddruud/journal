import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useSettingsStore = defineStore('settings', () => {
  const isNightMode = ref(false);

  const toggleTheme = () => {
    isNightMode.value = !isNightMode.value;
    document.documentElement.setAttribute('data-theme', isNightMode.value ? 'night' : 'day');
  };

  return { isNightMode, toggleTheme };
}); 