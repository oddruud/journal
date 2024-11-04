<template>
  <div>
    <DiaryEntries
      :startDate="state.startDate"
      :endDate="state.endDate"
      :maxEntries="1"
    />
    <h2>Today</h2>

    <!-- Add prompt section -->
    <div
      v-if="!state.isRecording && !state.transcription"
      class="prompt-section"
    >
      <div class="prompt-text">{{ state.currentPrompt }}</div>
      <button @click="generateNewPrompt" class="prompt-button">
        New Prompt
      </button>
    </div>

    <button
      @click="toggleRecording"
      :disabled="state.isLoading"
      class="record-button"
    >
      {{ state.isRecording ? 'Stop Recording' : 'Start Recording' }}
    </button>

    <DiaryEntry
      v-if="state.transcription"
      :currentDateTime="currentDateTime"
      :title="state.title"
      :displayedTranscription="state.displayedTranscription"
      :keyWords="state.keyWords"
      :isPositive="state.isPositive"
      :imageSrc="state.imageSrc"
      :id="state.id"
    />

    <div v-if="state.isRecording" class="recording-indicator">
      <div>Recording... {{ state.timer }} seconds</div>
    </div>
    <div>
      <canvas ref="canvas" width="300" height="100"></canvas>
    </div>

    <div v-if="state.isLoading" class="loading-indicator">
      Processing... {{ state.timer }} seconds
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import DiaryEntry from '../components/DiaryEntry.vue'
import DiaryEntries from '../components/DiaryEntries.vue'

export default defineComponent({
  components: {
    DiaryEntry,
    DiaryEntries,
  },
  setup() {
    const getYesterdayDate = () => {
      const yesterday = new Date()
      yesterday.setDate(yesterday.getDate() - 1)
      return yesterday.toISOString().split('T')[0] // Format as YYYY-MM-DD
    }

    const getYesterdayDateEnd = () => {
      const endOfYesterday = new Date()
      endOfYesterday.setDate(endOfYesterday.getDate() - 1)
      endOfYesterday.setHours(23, 59, 59, 999) // Set to end of the day
      return endOfYesterday.toISOString() // Full ISO string
    }

    const canvas = ref<HTMLCanvasElement | null>(null)
    const ctx = ref<CanvasRenderingContext2D | null>(null)
    const state = reactive({
      mediaRecorder: null as MediaRecorder | null,
      audioChunks: [] as Blob[],
      audioUrl: null as string | null,
      isRecording: false,
      audioBlob: null as Blob | null,
      transcription: '',
      title: '',
      id: '',
      keyWords: '',
      imageSrc: '',
      isPositive: false,
      isLoading: false,
      timer: 0,
      timerInterval: null as number | null,
      displayedTranscription: '',
      revealInterval: null as number | null,
      backend: (window as any).config.backEndUrl,
      startDate: getYesterdayDate(),
      endDate: getYesterdayDateEnd(),
      currentPrompt: 'Tell me about your day...',
      prompts: [
        'Tell me about your day...',
        'What made you smile today?',
        'What challenged you today?',
        'What are you grateful for today?',
        'What did you learn today?',
        'What was the most interesting conversation you had today?',
        'What was the best part of your day?',
        'What would you do differently if you could repeat today?',
        'What are you looking forward to tomorrow?',
        'Who made a positive impact on your day?',
      ],
      audioContext: null as AudioContext | null,
      analyser: null as AnalyserNode | null,
      dataArray: null as Uint8Array | null,
      bufferLength: 0,
    })

    const currentDateTime = ref(new Date().toLocaleString())

    const toggleRecording = async () => {
      if (state.isRecording) {
        await stopRecording()
      } else {
        await startRecording()
      }
    }

    const startRecording = async () => {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      state.audioContext = new (window.AudioContext ||
        window.webkitAudioContext)()
      state.analyser = state.audioContext.createAnalyser()
      const source = state.audioContext.createMediaStreamSource(stream)
      source.connect(state.analyser)
      state.analyser.fftSize = 256
      state.bufferLength = state.analyser.frequencyBinCount
      state.dataArray = new Uint8Array(state.bufferLength)

      state.mediaRecorder = new MediaRecorder(stream)
      state.audioChunks = []
      state.mediaRecorder.start()
      state.isRecording = true
      state.transcription = ''
      state.displayedTranscription = ''
      state.timer = 0
      startTimer()

      state.mediaRecorder.ondataavailable = event => {
        state.audioChunks.push(event.data)
      }

      state.mediaRecorder.onstop = () => {
        state.audioBlob = new Blob(state.audioChunks, { type: 'audio/wav' })
        state.audioUrl = URL.createObjectURL(state.audioBlob)
        stopTimer()
        state.audioContext?.close()
      }

      drawAudioLevels()
    }

    const stopRecording = async () => {
      state.mediaRecorder?.stop()
      state.isRecording = false
      state.isLoading = true
      state.timer = 0
      startTimer()

      const timeOut = new Promise(resolve => setTimeout(resolve, 100))
      await timeOut

      const formData = new FormData()
      formData.append('audio', state.audioBlob!, 'recording.wav')

      try {
        const response = await fetch(`${state.backend}/process-diary-entry`, {
          method: 'POST',
          body: formData,
        })

        const answerString = await response.text()
        const answerJSON = JSON.parse(answerString)
        state.transcription = answerJSON.content
        state.title = answerJSON.title
        state.keyWords = answerJSON.KeyWords
        state.isPositive = answerJSON.Positive
        state.id = answerJSON.id
        state.imageSrc = state.backend + '/image?name=' + answerJSON.ImageName

        console.log('answer: ', answerString)
        revealTranscription()
      } catch (e) {
        console.log(e)
      } finally {
        state.isLoading = false
      }
    }

    const startTimer = () => {
      state.timerInterval = window.setInterval(() => {
        state.timer += 1
      }, 1000)
    }

    const stopTimer = () => {
      if (state.timerInterval !== null) {
        clearInterval(state.timerInterval)
        state.timerInterval = null
      }
    }

    const revealTranscription = () => {
      let index = 0
      state.displayedTranscription = ''
      state.revealInterval = window.setInterval(() => {
        if (index < state.transcription.length) {
          state.displayedTranscription += state.transcription[index]
          index++
        } else {
          if (state.revealInterval !== null) {
            clearInterval(state.revealInterval)
          }
        }
      }, 30)
    }

    const generateNewPrompt = () => {
      const currentIndex = state.prompts.indexOf(state.currentPrompt)
      let newIndex
      do {
        newIndex = Math.floor(Math.random() * state.prompts.length)
      } while (newIndex === currentIndex && state.prompts.length > 1)

      state.currentPrompt = state.prompts[newIndex]
    }

    const drawAudioLevels = () => {
      //canvas.value = this.$refs.audioVisualizer as HTMLCanvasElement
      if (!canvas.value) {
        console.error('Canvas element not found')
        return
      }
      const canvasCtx = canvas.value.getContext('2d')
      if (!canvasCtx) {
        console.error('Failed to get canvas context')
        return
      }

      const draw = () => {
        requestAnimationFrame(draw)

        state.analyser?.getByteTimeDomainData(state.dataArray!)

        if (!canvas.value) {
          console.error('Canvas element not found')
          return
        }

        // Clear the canvas with transparency
        canvasCtx.clearRect(0, 0, canvas.value.width, canvas.value.height)

        canvasCtx.lineWidth = 2
        canvasCtx.strokeStyle = 'rgb(255,255, 255)'

        canvasCtx.beginPath()

        const sliceWidth = (canvas.value.width * 1.0) / state.bufferLength
        let x = 0

        for (let i = 0; i < state.bufferLength; i++) {
          const v = state.dataArray![i] / 128.0
          const y = (v * canvas.value.height) / 2

          if (i === 0) {
            canvasCtx.moveTo(x, y)
          } else {
            canvasCtx.lineTo(x, y)
          }

          x += sliceWidth
        }

        canvasCtx.lineTo(canvas.value.width, canvas.value.height / 2)
        canvasCtx.stroke()
      }

      draw()
    }

    onMounted(() => {
      console.log('onMounted')
      const authStore = useAuthStore()
      const router = useRouter()
      if (!authStore.isLoggedIn) {
        router.push('/login') // Redirect to login if not logged in
      }

      if (!canvas.value) {
        console.error('Canvas element not found')
      } else {
        const canvasCtx = canvas.value.getContext('2d')
        if (!canvasCtx) {
          console.error('Failed to get canvas context')
        }
      }
    })

    return {
      canvas,
      ctx,
      state,
      currentDateTime,
      toggleRecording,
      startRecording,
      stopRecording,
      startTimer,
      stopTimer,
      revealTranscription,
      generateNewPrompt,
      drawAudioLevels,
    }
  },
})
</script>

<style scoped>
button {
  padding: 10px 15px;
  font-size: 16px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  margin: 5px;
}

button:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}

button:not(:disabled) {
  background-color: #4caf50;
  color: white;
}

button:not(:disabled):hover {
  background-color: #45a049;
}

button:not(:disabled):active {
  background-color: #3e8e41;
}

.prompt-section {
  margin: 20px 0;
  padding: 20px;
  background-color: #f5f5f5;
  border-radius: 10px;
  text-align: center;
}

.prompt-text {
  font-size: 1.2em;
  color: #333;
  margin-bottom: 15px;
  font-style: italic;
}

.prompt-button {
  background-color: #8e44ad;
  color: white;
  padding: 8px 15px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 0.9em;
  transition: background-color 0.3s;
}

.prompt-button:hover {
  background-color: #732d91;
}

.record-button {
  margin-top: 15px;
}

.recording-indicator {
  color: #e74c3c;
  font-weight: bold;
  margin-top: 10px;
}

.loading-indicator {
  color: #3498db;
  font-weight: bold;
  margin-top: 10px;
}
</style>
