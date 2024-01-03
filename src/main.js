import { createApp } from "vue";
import App from "./App.vue";
import store from "./store";
import ElementPlus from "element-plus";
import "element-plus/dist/index.css";
import "./assets/index.css";
import * as ElementPlusIconsVue from "@element-plus/icons-vue";

window.__VUE_PROD_HYDRATION_MISMATCH_DETAILS__ = false;

const app = createApp(App).use(store).use(ElementPlus);

for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component);
}

app.mount("#app");
