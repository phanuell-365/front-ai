import {createApp} from 'vue'
import {createPinia} from "pinia";
import './style.css'
import './assets/material-icons/material-icons.css'
import App from './App.vue'
import router from './router'

createApp(App).use(router).use(createPinia()).mount('#app')
