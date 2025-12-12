import { createApp } from 'vue';
import './style.css';
import App from './App.vue';
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap";
import router from "./router";
import "tom-select/dist/css/tom-select.css";

createApp(App).use(router).mount('#app');
