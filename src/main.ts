import '../public/assets/main.scss'

import {createApp} from 'vue'
import {createPinia} from 'pinia'

import App from './App.vue'
import router from './router'
import {library} from "@fortawesome/fontawesome-svg-core";
import {far} from "@fortawesome/free-regular-svg-icons";
import {fas} from "@fortawesome/free-solid-svg-icons";

import CreateMission from "@/components/popup-form/CreateMission.vue";
import BlinkInput from "@/components/global/BlinkInput.vue";
import SimpleButton from "@/components/global/SimpleButton.vue";
import BlinkSelect from "@/components/global/BlinkSelect.vue";
import mitt from "mitt";
import CreatedFamily from "@/components/popup-form/CreateFamily.vue";
import InviteFamily from "@/components/popup-form/InviteFamily.vue";
import FamilyMembers from "@/components/main/FamilyMembers.vue";
import JoinRequests from "@/components/main/JoinRequests.vue";
import FamilyInviteCode from "@/components/global/FamilyInviteCode.vue";
import MissionDetail from "@/components/popup-form/MissionDetail.vue";
import CreateAnniversary from "@/components/popup-form/CreateAnniversary.vue";
import {GesturePlugin} from "@vueuse/gesture";

const emitter = mitt();
const app = createApp(App)

app.use(createPinia())
app.use(router)
app.use(GesturePlugin)
//fontawesome regular icons
library.add(far)
library.add(fas)

// Popup components
app.component("CreateMission", CreateMission)
app.component("CreateFamily", CreatedFamily)
app.component("InviteFamily", InviteFamily)

// Global components
app.component("BlinkInput", BlinkInput)
app.component("SimpleButton", SimpleButton)
app.component("BlinkSelect", BlinkSelect)
app.component("FamilyMembers", FamilyMembers)
app.component("JoinRequests", JoinRequests)
app.component("FamilyInviteCode", FamilyInviteCode)
app.component("MissionDetail", MissionDetail)
app.component("CreateAnniversary", CreateAnniversary)


app.provide("emitter", emitter)


app.mount('#app')

