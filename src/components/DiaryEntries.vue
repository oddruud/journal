<template>
  <div class="diary-entries">
    <ul>
      <DiaryEntry
        v-for="entry in entries.slice(0, props.maxEntries)"
        :currentDateTime="entry.created_at"
        :title="entry.title"
        :displayedTranscription="entry.content"
        :imageSrc="`${imageSrcBase}${entry.image_url}`"
        :keyWords="entry.keywords"
        :dayOfWeek="getDayOfWeek(entry.created_at)"
        :key="entry.id"
        :id="entry.id"
      />
    </ul>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, defineProps } from 'vue'
import DiaryEntry from './DiaryEntry.vue'

interface Entry {
  id: number
  created_at: string
  title: string
  content: string
  image_url: string
  keywords: string
}

const props = defineProps<{
  startDate: string // New prop for the API URL
  endDate: string
  maxEntries: number // New prop to specify the maximum number of entries
}>()

const baseUrl = window.config.backEndUrl
const imageSrcBase = `${baseUrl}/image?name=`
const diaryEntriesEndPoint = `${baseUrl}/diary-entries-by-date-range?start_date=${props.startDate}&end_date=${props.endDate}`
const entries = ref<Entry[]>([]) // Explicitly define the type of entry

const getDayOfWeek = (dateString: string): string => {
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', { weekday: 'long' })
}

const fetchEntries = async () => {
  try {
    const response = await fetch(diaryEntriesEndPoint) // Use the apiUrl prop
    if (!response.ok) {
      throw new Error('Network response was not ok')
    }
    entries.value = await response.json() // Store the fetched entries
    console.log(entries.value)
  } catch (error) {
    console.error('Error fetching diary entries:', error)
  }
}

onMounted(() => {
  fetchEntries()
})
</script>

<style scoped>
.diary-entries {
  padding: 1rem;
}

.diary-entries h2 {
  margin-bottom: 1rem;
}

.diary-entries ul {
  list-style-type: none;
  padding: 0;
}
</style>
