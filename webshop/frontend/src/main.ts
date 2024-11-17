import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'
import "@/assets/index.css"
import { useOrderStore } from "@/store/order";

const app = createApp(App)

app.use(createPinia())
app.use(router)

useOrderStore().loadShoppingCart();

app.mount('#app')
