import('preline')
import "vue-toastification/dist/index.css";

import './assets/main.css'
import VueVirtualScroller from 'vue-virtual-scroller'
import { createHead } from '@unhead/vue'
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { createI18n } from 'vue-i18n'
import { getStartingLocale } from './utils/i18n'

import VueLazyload from '@jambonn/vue-lazyload'
import App from './App.vue'
import router from './router'
import Toast from "vue-toastification";
import vue3GoogleLogin from 'vue3-google-login'
import messages from '@intlify/unplugin-vue-i18n/messages'
import piniaPluginPersistedstate from "pinia-plugin-persistedstate";

const pinia = createPinia();

// Language Configuration
export const i18n = createI18n({
  legacy: false,
  globalInjection: true,
  locale: getStartingLocale(),
  fallbackLocale: 'en',
  availableLocales: ['es', 'en'],
  messages
})

const app = createApp(App)
const head = createHead()

document.documentElement.classList.add('dark')

const options_toast = {
  transition: "Vue-Toastification__fade",
  maxToasts: 3,
  newestOnTop: true,
}

pinia.use(piniaPluginPersistedstate);

app.use(head)
app.use(pinia)
app.use(router)
app.use(i18n)
app.use(Toast, options_toast)
app.use(vue3GoogleLogin, {
  clientId: '467066531682-q8p3ve3pc59cqnfjqn9vftpbmplclum3.apps.googleusercontent.com'
})
app.use(VueLazyload, {
  preLoad: 1.5
})

app.mount('#app')
