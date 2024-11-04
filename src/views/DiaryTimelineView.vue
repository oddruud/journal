<template>
    <div class="diary-timeline">
      <h1>Diary Timeline</h1>
      <DiaryEntries :startDate="formattedStartDateWeek" :endDate="formattedEndDateWeek" :maxEntries="4"/>
    </div>
  </template>
  
  <script setup lang="ts">
  import DiaryEntries from '../components/DiaryEntries.vue';
  import { useRouter } from 'vue-router';
  import { useAuthStore } from '../stores/auth'; // Import the auth store
  
  const authStore = useAuthStore(); // Initialize the auth store
  const router = useRouter();
  
  if (!authStore.isLoggedIn) {
    router.push('/login'); // Redirect to login page if not logged in
  }
  
  // Calculate the date range for the last 7 days
  const endDateWeek = new Date(); // Today's date
  const startDateWeek = new Date();
  endDateWeek.setDate(endDateWeek.getDate() + 1); 
  startDateWeek.setDate(endDateWeek.getDate() - 7); // 7 days ago
  
  // Format dates to "YYYY-MM-DD"
  const formatDate = (date: Date) => date.toISOString().slice(0, 10);
  const formattedEndDateWeek = formatDate(endDateWeek);
  const formattedStartDateWeek = formatDate(startDateWeek);

  console.log(formattedStartDateWeek, formattedEndDateWeek);
  </script>
  
  <style scoped>
  .diary-timeline {
    padding: 1rem;
  }
  
  .diary-timeline h1 {
    margin-bottom: 1rem;
  }
  </style> 