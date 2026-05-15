import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import './style.css'
import { useConfigStore } from '@/stores/config'

const app = createApp(App)
app.use(createPinia())

const store = useConfigStore()
store.loadFromHash()
store.startHashSync()

app.mount('#app')
