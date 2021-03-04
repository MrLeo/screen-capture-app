import { createApp } from 'vue'
import App from './App.vue'
import './registerServiceWorker'
import router from './router'
import store from './store'

process.on('unhandledRejection', error => {
  console.error(error)
})

createApp(App)
  .use(store)
  .use(router)
  .mount('#app')
