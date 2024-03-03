import './assets/main.scss'

import {createApp} from 'vue'
import {createPinia} from 'pinia'

import App from './App.vue'
import router from './router'
import {library} from "@fortawesome/fontawesome-svg-core";
import {far} from "@fortawesome/free-regular-svg-icons";
import {fas} from "@fortawesome/free-solid-svg-icons";

import CreateMission from "@/views/authorized/CreateMission.vue";
import BlinkInput from "@/components/global/BlinkInput.vue";
import SimpleButton from "@/components/global/SimpleButton.vue";
import BlinkSelect from "@/components/global/BlinkSelect.vue";
import mitt from "mitt";

const emitter = mitt();
const app = createApp(App)

app.use(createPinia())
app.use(router)
//fontawesome regular icons
library.add(far)
library.add(fas)

app.component("CreateMission", CreateMission)

app.component("BlinkInput", BlinkInput)
app.component("SimpleButton", SimpleButton)
app.component("BlinkSelect", BlinkSelect)
app.provide("emitter", emitter)


app.mount('#app')

