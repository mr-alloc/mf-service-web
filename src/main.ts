import './assets/main.scss'

import {createApp} from 'vue'
import {createPinia} from 'pinia'

import App from './App.vue'
import router from './router'
import {library} from "@fortawesome/fontawesome-svg-core";
import {far} from "@fortawesome/free-regular-svg-icons";
import {fas} from "@fortawesome/free-solid-svg-icons";

const app = createApp(App)

app.use(createPinia())
app.use(router)
//fontawesome regular icons
library.add(far)
library.add(fas)

app.mount('#app')
