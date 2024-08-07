<template>
  <div class="container-wrapper">
    <LeftHeader/>
    <div class="container">
      <RouterView v-slot="{ Component }">
        <Transition name="fade">
          <Component :is="Component"/>
        </Transition>
      </RouterView>
    </div>
    <div class="background"
         :class="[{ curtain: backgroundStore.needCurtainManager }, { popup: backgroundStore.needBackground || backgroundStore.needPopup}]"
         v-show="backgroundStore.needBackground" v-on:click="methods.clickBackground">
      <InitNickname v-show="backgroundStore.needNicknameInitializer"/>
      <LoadingSpinner v-show="backgroundStore.needCurtainManager" :title="backgroundStore.loadingInfo.title"
                      :content="backgroundStore.loadingInfo.content"/>
      <GlobalPopup/>
    </div>
  </div>
</template>
<script setup lang="ts">
import {RouterView} from 'vue-router'
import {useBackgroundStore} from "@/stores/BackgroundStore";
import InitNickname from "@/components/global/NicknameInitializer.vue";
import LeftHeader from "@/components/global/LeftHeader.vue";
import LoadingSpinner from "@/components/global/LoadingSpinner.vue";
import GlobalPopup from "@/components/global/GlobalPopup.vue";

const backgroundStore = useBackgroundStore();
const methods = {
  clickBackground(event: MouseEvent) {
    // backgroundStore.doIfHasPopup((popup: CurrentPopup) => {
    //   if (!popup.hasButtonProxy()) {
    //     backgroundStore.returnGlobalPopup();
    //   }
    // })
  }
}

</script>
<style scoped lang="scss">
@import '@assets/main';

.container-wrapper {
  background: white;
  width: 100%;
  margin: 0 auto;
  display: flex;
  flex-direction: row;

  .container {
    flex-grow: 1;
  }

  .background {
    z-index: 4;

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

    &.popup {
      width: 100%;
      height: 100%;
      position: absolute;
      top: 0;
      left: 0;
      display: flex;
      justify-content: center;
      align-items: center;
    }
  }
}
</style>
