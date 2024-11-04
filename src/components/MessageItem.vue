<template>
  <li class="message-item">
    <img class="message-image" :src="imageSrc" alt="Message Image" />
    <span class="message-header">
      <slot name="author"></slot>
    </span>
    <span>: </span>
    <span class="message-content">
      <slot name="content"></slot>
    </span>
  </li>
</template>

<script setup lang="ts">
const props = defineProps<{
  imageSrc: string;
}>();
</script>

<style scoped>
.message-item {
  margin-bottom: 1rem;
  padding: 1rem;
  border: 1px solid #ccc;
  border-radius: 8px;
  background-color: var(--color-background-soft);
  transition: box-shadow 0.3s ease;
  width: 200px;
}

.message-item:hover {
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}

.message-header {
  font-weight: bold;
  color: var(--color-heading);
  margin-bottom: 0.5rem;
}

.message-content {
  color: var(--color-text);
}

.message-image {
  border-radius: 50%; /* Round styling for the image */
  width: 50px; /* Adjust size as needed */
  height: 50px; /* Adjust size as needed */
  object-fit: cover; /* Ensures the image covers the area */
}
</style>
