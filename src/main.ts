import { createApp } from 'vue'
import {createPinia} from "pinia";
import './style.css'
import App from './App.vue'
import router from './router'

import {
    Ripple,
    Input,
    initTE,
} from "tw-elements";

initTE({Ripple, Input});

createApp(App).use(router).use(createPinia()).mount('#app')
