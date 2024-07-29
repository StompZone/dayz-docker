import 'primeicons/primeicons.css'
import 'primeflex/primeflex.css'
import './css/index.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import { useAppStore } from '@/store'
import PrimeVue from 'primevue/config'
import Aura from '@primevue/themes/aura'
import { createI18n } from 'vue-i18n'
import { locales } from '@/locales'

// Create an instance of our Vue app
const app = createApp(App)

// Add the store
app.use(createPinia())

// Add i18n
const i18n = createI18n(locales)
app.use(i18n)

// A global error handler
app.config.errorHandler = (err, instance, info) => {
    const store = useAppStore()
    store.errorText = err.message
    console.error('GLOBAL ERROR HANDLER!   ', err, instance, info)
}

// Add PrimeVue
app.use(PrimeVue, {
    theme: {
        preset: Aura
    }
})

// Mount it
app.mount('#app')
