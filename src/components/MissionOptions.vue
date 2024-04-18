<script setup lang="ts">

import {FontAwesomeIcon} from "@fortawesome/vue-fontawesome";
import {faCalendarPlus} from "@fortawesome/free-solid-svg-icons";
import {useMemberInfoStore} from "@/stores/MemberInfo";
import {useBackgroundStore} from "@/stores/BackgroundStore";
import {AlertType, useAlertStore} from "@/stores/AlertStore";
import {inject} from "vue";
import {CurrentPopup, PopupType} from "@/stores/status/CurrentPopup";

const memberInfoStore = useMemberInfoStore();
const backgroundStore = useBackgroundStore();
const alertStore = useAlertStore();
const emitter = inject("emitter")!;
const methods = {
  popupCreateMission() {
    const createMissionPopup = new CurrentPopup(PopupType.NORMAL, "미션 생성")
        .addBodyComponent("CreateMission", {})
        .addButton("생성", () => {
          emitter.emit("validateCreateMissionForm")
        })
        .addCancelButton("취소", () => {
          backgroundStore.returnGlobalPopup()
          emitter.off("validateCreateMissionForm")
        }, () => {
          alertStore.alert(AlertType.WARNING, "미션생성 취소", "이 메세지가 사라지기 전까지 한번 더 취소 버튼을 누르시면 취소되요!", 5)
          return 5;
        });
    backgroundStore.useGlobalPopup(createMissionPopup);
  },
}
</script>

<template>
  <div class="mission-options">
    <div class="option-item-wrapper" v-on:click="methods.popupCreateMission()">
      <div class="option-item">
        <div class="option-icon">
          <FontAwesomeIcon :icon="faCalendarPlus" size="xl"/>
        </div>
        <div class="option-title">
          <span>미션 생성</span>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
@import "@/assets/main";

.mission-options {
  width: max-content;
  display: flex;
  margin: 0 auto;

  .option-item-wrapper {
    width: 60px;
    height: 60px;
    border: 1px solid $signature-purple;
    border-radius: 50%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    transition: $duration;

    &:hover {
      background-color: $signature-purple;
      cursor: pointer;

      .option-item {
        transform: scale(.9);

        .option-icon {
          color: white;
        }

        .option-title {
          color: white;
        }
      }

    }

    .option-item {
      transition: $duration;


      .option-icon {
        height: 30px;
        display: flex;
        align-items: center;
        justify-content: center;
        color: $signature-purple

      }

      .option-title {
        text-align: center;
        font-size: .64rem;
        font-weight: bold;
        color: $signature-purple;
        user-select: none;
      }
    }
  }
}
</style>
