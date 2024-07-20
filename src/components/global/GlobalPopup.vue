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
  },
  clickPopup(event: MouseEvent) {
    event.stopPropagation();
  },
  clickInnerPopup(event: MouseEvent) {
    event.stopPropagation();
  },
  clickInnerBackground(event: MouseEvent) {
    event.stopPropagation();
  },
  clickPopupArea(event: MouseEvent) {
    // backgroundStore.doIfHasPopup(popup => {
    //   if (!popup.hasButtonProxy()) {
    //     event.stopPropagation();
    //   }
    // })
  }
}
const props = defineProps({
  componentName: String,
  componentProps: Object
});
</script>

<template>
  <div class="global-popup-area" v-on:click="methods.clickPopupArea">
    <Transition name="fall-fade">
      <div class="global-popup-wrapper" v-show="backgroundStore.needPopup"
           :class="[backgroundStore.popupInfo?.type, { 'prepare': backgroundStore.isPopupPrepare }]"
           v-on:click="($event) => methods.clickPopup($event)">
        <div class="popup-header">
          <div class="popup-icon">
            <FontAwesomeIcon :icon="methods.getPopupIcon(backgroundStore.popupInfo?.type)"/>
          </div>
          <div class="popup-title">{{ backgroundStore.popupInfo?.title }}</div>
        </div>
        <div class="popup-body">
          <span class="popup-message"
                v-show="!backgroundStore.popupInfo?.includeBodyComponent">{{
              backgroundStore.popupInfo?.message
            }}</span>
          <Component :is="backgroundStore.popupInfo?.componentName" v-bind="backgroundStore.popupInfo?.componentProps"
                     v-if="backgroundStore.popupInfo?.includeBodyComponent"/>
          <div class="progress-curtain" v-show="backgroundStore.isPopupPrepare">
            <FontAwesomeIcon icon="spinner" spin size="3x"/>
          </div>
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
    <Transition name="fall-fade">
      <div class="inner-background" v-show="backgroundStore.needPopup && backgroundStore.needInnerPopup"
           v-on:click="($event) => methods.clickInnerBackground($event)">
        <div class="inner-popup-wrapper"
             :class="[backgroundStore.innerPopupInfo?.type]" v-on:click="($event) => methods.clickInnerPopup($event)">
          <div class="popup-header">
            <div class="popup-icon">
              <FontAwesomeIcon :icon="methods.getPopupIcon(backgroundStore.innerPopupInfo?.type)"/>
            </div>
            <div class="popup-title">{{ backgroundStore.innerPopupInfo?.title }}</div>
          </div>
          <div class="popup-body">
          <span class="popup-message"
                v-show="!backgroundStore.innerPopupInfo?.includeBodyComponent">{{
              backgroundStore.innerPopupInfo?.message
            }}</span>
          </div>
          <div class="popup-footer">
            <ul class="option-button-group">
              <li class="popup-process-button" v-for="(button, index) in backgroundStore.innerPopupInfo?.buttons"
                  v-bind:key="index">
                <button type="button" v-on:click="button.action()">{{ button.name }}</button>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>
<style scoped lang="scss">
@import '@assets/main.scss';

.global-popup-area {
  position: relative;

  .global-popup-wrapper, .inner-background > .inner-popup-wrapper {
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

  .inner-background {
    width: 100%;
    height: 100%;
    position: fixed;
    top: 0;
    left: 0;
    display: flex;
    justify-content: center;
    align-items: center;

    .inner-popup-wrapper {
      z-index: 1;
      transition: transform 0s;
    }
  }

  .prepare {
    .popup-body {
      position: relative;

      .progress-curtain {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        background-color: white;
      }
    }
  }
}
</style>
