<script setup lang="ts">

import {FontAwesomeIcon} from "@fortawesome/vue-fontawesome";
import {faCalendarPlus} from "@fortawesome/free-solid-svg-icons";
import PopupUtil from "@/utils/PopupUtil";
import {inject} from "vue";

const emitter = inject("emitter");
</script>

<template>
  <div class="mission-options">
    <div class="option-item-wrapper" v-on:click="PopupUtil.popupCreateMission(emitter)">
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
