import { createApp } from "vue";
import App from "./App.vue";
import "./assets/index.css";
import { createPinia } from "pinia";
import router from "@/router.ts";

createApp(App)
  .use(createPinia())
  .use(router)
  .mount("#app");
