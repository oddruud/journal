import './assets/main.css'
import './config.ts' // Import the config file
import './shims-vue.d.ts'
import './three-extended.d.ts'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'

const app = createApp(App)

app.use(createPinia())
app.use(router)

app.mount('#app')
