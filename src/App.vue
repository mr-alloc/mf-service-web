<template>
  <LeftHeader />
  <Transition name="fade">
    <div class="container" v-show="true" >
      <RouterView />
    </div>
  </Transition>
  <div class="background" v-show="backgroundStore.needBackground">
    <InitNickname  />
  </div>
</template>
<script setup lang="ts">
import {RouterLink, RouterView, useRouter} from 'vue-router'
import  { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { faUser } from "@fortawesome/free-solid-svg-icons";
import { useMemberInfoStore } from "@/stores/MemberInfo";
import InitNickname from "@/components/global/InitNickname.vue";
import {useBackgroundStore} from "@/stores/BackgroundStore";
import LeftHeader from "@/components/global/LeftHeader.vue";

const router = useRouter();
const memberInfoStore = useMemberInfoStore();
let backgroundStore = useBackgroundStore();


const methods = {
}

</script>
<style lang="scss">
@import '@/assets/main.scss';
.container {
  flex-grow: 1;
}
</style>
