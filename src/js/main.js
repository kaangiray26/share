import { createApp } from 'vue'
import App from '/components/App.vue'
import router from '/router'
import '/registerServiceWorker';

// Import our custom CSS
import '/scss/styles.scss'
import '/assets/styles.css'

createApp(App).use(router).mount('#app')
