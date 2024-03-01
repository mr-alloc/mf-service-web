<template>
  <div class="container-wrapper">
    <LeftHeader/>
    <Transition name="fade">
      <div class="container" v-show="true">
        <RouterView/>
      </div>
    </Transition>
    <div class="background" :class="[{ curtain: backgroundStore.needCurtainManager }]"
         v-show="backgroundStore.needBackground">
      <InitNickname v-show="backgroundStore.needNicknameInitializer"/>
      <LoadingSpinner v-show="backgroundStore.needCurtainManager" :title="backgroundStore.loadingInfo.title"
                      :content="backgroundStore.loadingInfo.content"/>
    </div>
  </div>
</template>
<script setup lang="ts">
import {RouterView} from 'vue-router'
import {useBackgroundStore} from "@/stores/BackgroundStore";
import InitNickname from "@/components/global/InitNickname.vue";
import LeftHeader from "@/components/global/LeftHeader.vue";
import LoadingSpinner from "@/components/global/LoadingSpinner.vue";

const backgroundStore = useBackgroundStore();
const methods = {
}

</script>
<style lang="scss">
@import '@/assets/main.scss';

.container-wrapper {
  background: white;
  min-width: 968px;
  margin: 0 auto;
  display: flex;
  flex-direction: row;

  .container {
    flex-grow: 1;
  }

  .background {

    &.curtain {
      position: absolute;
      background: rgba(0, 0, 0, .5);
      width: 100%;
      height: 100%;
      backdrop-filter: blur(2px);
      display: flex;
      justify-content: center;
      align-items: center;
    }
  }
}
</style>
