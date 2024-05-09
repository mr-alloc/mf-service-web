<script setup lang="ts">
import {FontAwesomeIcon} from "@fortawesome/vue-fontawesome";
import {useBackgroundStore} from "@/stores/BackgroundStore";
import {PopupType} from "@/stores/status/CurrentPopup";

const backgroundStore = useBackgroundStore();
const methods = {
  getPopupIcon(popupType?: PopupType) {
    switch (popupType) {
      case PopupType.NORMAL:
        return ["fas", "flag"];
      case PopupType.WARNING:
        return ["fas", "exclamation-triangle"];
      default:
        return ["fas", "exclamation-circle"];
    }
  }

}
const props = defineProps({
  componentName: String,
  componentProps: Object
});
</script>

<template>
  <Transition name="fall-fade">
    <div class="global-popup-wrapper" v-show="backgroundStore.needPopup" :class="[backgroundStore.popupInfo?.type]">
      <div class="popup-header">
        <div class="popup-icon">
          <FontAwesomeIcon :icon="methods.getPopupIcon(backgroundStore.popupInfo?.type)"/>
        </div>
        <div class="popup-title">{{ backgroundStore.popupInfo?.title }}</div>
      </div>
      <div class="popup-body">
        <span class="popup-message"
              v-show="!backgroundStore.popupInfo?.includeBodyComponent">{{ backgroundStore.popupInfo?.message }}</span>
        <Component :is="backgroundStore.popupInfo?.componentName" v-bind="backgroundStore.popupInfo?.componentProps"
                   v-if="backgroundStore.popupInfo?.includeBodyComponent"/>
      </div>
      <div class="popup-footer">
        <ul class="option-button-group">
          <li class="popup-process-button" v-for="(button, index) in backgroundStore.popupInfo?.buttons"
              v-bind:key="index">
            <button type="button" v-on:click="button.action()">{{ button.name }}</button>
          </li>
        </ul>
      </div>
    </div>
  </Transition>
</template>
<style scoped lang="scss">
@import '@/assets/main.scss';

.global-popup-wrapper {
  background-color: white;
  border: 1px $standard-gray-in-white solid;
  border-radius: 10px;
  padding: 5px;
  display: flex;
  flex-direction: column;
  box-shadow: $standard-box-shadow;

  &.normal {
    .popup-header {

      .popup-icon {
        color: $signature-purple;
      }

    }

  }

  .popup-header {
    display: flex;
    flex-direction: row;
    flex-shrink: 0;

    .popup-icon {
      display: flex;
      justify-content: center;
      align-items: center;
      width: 30px;
      flex-shrink: 0;
    }

    .popup-title {
      flex-grow: 1;
      font-weight: bold;
      padding: 0 5px;
      user-select: none;
    }

  }

  .popup-body {
    padding: 5px 8px;
    flex-grow: 1;
    user-select: none;

    .popup-message {
      width: 300px;
    }
  }

  .popup-footer {
    .option-button-group {
      list-style: none;
      display: flex;
      justify-content: space-evenly;
      padding: 0 5px;

      .popup-process-button {

        button {
          transition: .2s;
          border-radius: 10px;
          user-select: none;

          &:hover {
            cursor: pointer;
            background-color: $standard-gray-in-white;
            transform: scale(.9);
          }
        }
      }
    }
  }
}
</style>
