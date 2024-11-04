<template>
  <div class="welcome-container">
    <h1>Welcome to Our Diary App!</h1>
    <p>We're glad to have you here. Get started by exploring our features!</p>
    <div class="welcome-items">
      <WelcomeItem>
        <template #icon>
            <ToolingIcon />
        </template>
        <template #heading>
          Explore Your Diary
        </template>
        <p>Keep track of your thoughts and experiences.</p>
      </WelcomeItem>
      <WelcomeItem>
        <template #icon>
            <ToolingIcon />
        </template>
        <template #heading>
          Create New Entries
        </template>
        <p>Start writing your first diary entry today!</p>
      </WelcomeItem>
      <WelcomeItem>
        <template #icon>
            <ToolingIcon />
        </template>
        <template #heading>
          Track Your Progress
        </template>
        <p>See how your thoughts evolve over time.</p>
      </WelcomeItem>
    </div>
  </div>
</template>

<script setup lang="ts">
// Import any necessary components or libraries here
import WelcomeItem from './WelcomeItem.vue';
import DocumentationIcon from './icons/IconDocumentation.vue'
import ToolingIcon from './icons/IconTooling.vue'
import EcosystemIcon from './icons/IconEcosystem.vue'
import CommunityIcon from './icons/IconCommunity.vue'
import SupportIcon from './icons/IconSupport.vue'
</script>

<style scoped>
.welcome-container {
  text-align: center;
  padding: 2rem;
  border-radius: 10px; /* Rounded corners */
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1); /* Subtle shadow */
}

.welcome-container h1 {
  font-size: 2.5rem; /* Larger font size for the heading */
  color: #333; /* Darker text color */
  margin-bottom: 1rem; /* Space below the heading */
}

.welcome-container p {
  font-size: 1.2rem; /* Slightly larger font for the paragraph */
  color: #666; /* Softer text color */
  margin-bottom: 2rem; /* Space below the paragraph */
}

.welcome-items {
  display: flex;
  justify-content: space-around;
  margin-top: 2rem;
}

.welcome-items > WelcomeItem {
  flex: 1; /* Allow items to grow equally */
  margin: 0 1rem; /* Space between items */
  padding: 1.5rem; /* Padding inside each item */
  background-color: #fff; /* White background for items */
  border-radius: 8px; /* Rounded corners for items */
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1); /* Subtle shadow for items */
  transition: transform 0.3s; /* Smooth scaling effect */
}

.welcome-items > WelcomeItem:hover {
  transform: scale(1.05); /* Scale up on hover */
}
</style>
