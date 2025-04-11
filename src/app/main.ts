import './styles/style.css'

import { createPinia } from 'pinia'
import { createApp } from 'vue'

import App from './App.vue'
import routes from './routes'

const app = createApp(App)
const pinia = createPinia()

app.use(pinia)
app.use(routes)

app.mount('#app')
