// MUST be first — sets up globalThis.process before any upstream module loads.
import '@/process-polyfill'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import { i18n } from '@/i18n'
import './style.css'
import { useConfigStore } from '@/stores/config'

const app = createApp(App)
app.use(createPinia())
app.use(i18n)

const store = useConfigStore()
store.loadFromHash()
store.startHashSync()

app.mount('#app')
