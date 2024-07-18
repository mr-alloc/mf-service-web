<script setup lang="ts">

import PageButtonGroup from "@/components/PageButtonGroup.vue";
import {DefaultButtonValue} from "@/classes/DefaultButtonValue";
import {inject, reactive} from "vue";
import PopupUtil from "@/utils/PopupUtil";
import TemporalUtil from '@/utils/TemporalUtil'


const emitter = inject("emitter");
const state = reactive({
  buttons: [
    new DefaultButtonValue("미션 생성", ["fas", "calendar-plus"], () =>
      PopupUtil.popupCreateMission(emitter, TemporalUtil.getEpochSecond(false)))
  ]
});
</script>

<template>
  <div class="mission-page-container">
    <div class="on-going-summary">
      <ul class="summary-list">
        <li class="summary-item">
          <span class="item-title">사야해</span>
          <span class="item-count">312389</span>
        </li>
        <li class="summary-item">
          <span class="item-title">해야해</span>
          <span class="item-count">321902</span>
        </li>
      </ul>
    </div>
    <PageButtonGroup :buttons="state.buttons as Array<DefaultButtonValue>"/>
  </div>
</template>

<style scoped lang="scss">
.mission-page-container {
  width: 768px;
  margin: 0 auto;
  padding: 20px 0;

  .on-going-summary {
    padding: 12px 15px;

    .summary-list {
      list-style: none;
      display: flex;
      flex-direction: row;
      padding: 0;
      width: max-content;
      margin: 0 auto;

      .summary-item {
        display: flex;
        flex-direction: column;
        border-radius: 5px;
        background-color: #2c3e50;
        color: white;
        text-align: center;
        width: 100px;
        margin: 0 10px;
        padding: 20px 0;
        user-select: none;

        .item-title {
          padding: 5px 0;
          font-weight: bold;
          font-size: 1.4rem;
        }

        .item-count {
          padding: 5px 0;
          font-weight: bold;
        }
      }
    }
  }
}
</style>
