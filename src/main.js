import './assets/main.css'
import './assets/fonts.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'

const app = createApp(App)

import Toast from 'vue-toastification'
import 'vue-toastification/dist/index.css'

app.use(createPinia())
app.use(router)
app.use(Toast)

app.mount('#app')
