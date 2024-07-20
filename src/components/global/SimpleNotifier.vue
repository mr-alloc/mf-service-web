<script setup lang="ts">
import {FontAwesomeIcon} from "@fortawesome/vue-fontawesome";
import {AlertType, useAlertStore} from "@/stores/AlertStore";
import {reactive} from "vue";

const notificationStore = useAlertStore();

const methods = {
  getNoticeIcon(type: AlertType) {
    switch (type) {
      case AlertType.INFO:
        return ["fas", "triangle-exclamation"];
      case AlertType.WARNING:
        return ["fas", "circle-exclamation"];
      case AlertType.SUCCESS:
        return ["far", "circle-check"];
      case AlertType.GUIDE:
        return ["fas", "flag"];
      default:
        return ["fas", "hands-clapping"];
    }
  },
  dismissAlert(index: number) {
    notificationStore.notifications.splice(index, 1);
  }
}

const state = reactive({
  notifications: notificationStore.notifications
})
</script>
<template>
  <div class="notifications-wrapper">
    <TransitionGroup name="list" tag="ul" class="notice-message-list">
      <li class="message-item" v-for="(notification, index) in state.notifications"
          :key="notification.timestamp">
        <div class="message-header">
          <div class="message-icon" :class="[notification.type]">
            <FontAwesomeIcon :icon="methods.getNoticeIcon(notification.type)" class="fa-sm"/>
            <span class="message-title">{{ notification.title }}</span>
          </div>
          <div class="close-box" v-on:click="methods.dismissAlert(index)">
            <FontAwesomeIcon :icon="['fas', 'xmark']" class="fa-1x"/>
          </div>
        </div>
        <div class="message-body">
          <div class="message-content">
            <span>{{ notification.message }}</span>
          </div>
        </div>
      </li>
    </TransitionGroup>
  </div>
</template>

<style scoped lang="scss">
@import '@assets/main.scss';

.notifications-wrapper {
  width: 250px;
  max-height: 300px;
  z-index: 2;
  position: absolute;
  bottom: 0px;

  .all-clear {
    display: flex;
    height: 40px;
    justify-content: center;
    align-items: center;
    transition: .5s;

    .alert-cleaner {
      border: 1px $standard-gray-in-white solid;
      background-color: rgba(0, 0, 0, 0.62);
      border-radius: 10px;
      padding: 0;
      width: 45px;
      height: 21px;
      display: flex;
      justify-content: center;
      align-items: center;
      color: $standard-light-gray-in-white;
      font-size: .64rem;

      span {

        padding: 3px;
      }
    }
  }

  .notice-message-list {
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
    height: 100%;
    padding: 0px;

    .message-item {
      z-index: 2;
      background-color: rgba(0, 0, 0, 0.62);
      color: $standard-light-gray-in-white;
      width: 250px;
      display: flex;
      flex-direction: column;
      border-radius: 10px;
      transition: .5s, scale .2s;
      margin-bottom: 10px;
      box-shadow: $standard-box-shadow;
      border: 1px $standard-weight-gray-in-white solid;
      user-select: none;

      &:hover {
        .message-header {

          .close-box {
            opacity: 1;
          }
        }
      }

      .message-header {
        height: 25px;
        display: flex;
        flex-direction: row;
        padding: 5px 5px 0px;
        transition: .2s;
        color: $standard-gray-in-white;
        flex-shrink: 0;

        &:hover {
          color: $standard-weight-gray-in-white;
        }

        .message-icon {
          flex-grow: 1;
          display: flex;
          align-items: center;
          transition: .2s;
          color: #f6e0c0;

          &.warning {
            color: #e74444;
          }

          &.info {
            color: #f6cb70;
          }

          &.success {
            color: #4daf73;
          }

          &.guide {
            color: $light-signature-purple;
          }


          .message-title {
            padding: 0 8px;
            color: white;
          }
        }


        .close-box {
          width: 20px;
          flex-shrink: 0;
          display: flex;
          justify-content: center;
          align-items: center;
          transition: .2s;
          color: $standard-gray-in-white;
          position: relative;
          right: -13px;
          top: -13px;
          border-radius: 50%;
          border: 1.4px #787878 solid;
          background-color: #333333;
          opacity: 0;

          &:hover {
            cursor: pointer;
          }
        }
      }

      .message-body {
        display: flex;
        flex-direction: row;
        flex-grow: 1;


        .message-content {
          flex-grow: 1;
          display: flex;
          align-items: center;
          padding: 2px 8px;
          font-size: .82rem;
          text-overflow: ellipsis;

        }
      }
    }
  }
}

</style>
