import { createApp } from 'vue'
import {io} from 'socket.io-client'
import App from './App.vue'
import './index.css'

const app = createApp(App)
app.config.globalProperties.$socket = io(location.hostname + ':3001');
app.mount('#app')
