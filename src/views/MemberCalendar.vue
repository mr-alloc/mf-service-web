<template>
  <div class="calendar-container" v-show="state.thisMonth">
    <div class="calendar-title">
      <span class="title-text">{{ methods.getCalendarTitle() }}</span>
    </div>
    <ul class="calendar-row calendar-header">
      <li>일</li>
      <li>월</li>
      <li>화</li>
      <li>수</li>
      <li>목</li>
      <li>금</li>
      <li>토</li>
    </ul>
    <ul class="calendar-row member-calender">
      <li class="each-day-item">
        <div class="item-header">
        </div>
        <div class="item-body">
        </div>
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import {onMounted, reactive} from "vue";

const state = reactive({
  thisMonth: new Date(),
  calendar: []
})
const methods = {
  getCalendarTitle() {
    return state.thisMonth.getFullYear() + "년 " + (state.thisMonth.getMonth() + 1) + "월";
  }
}
onMounted(() => {
  const today = new Date();
  const firstDay = new Date(today.getFullYear(), today.getMonth(), 1);
  const lastDay = new Date(today.getFullYear(), today.getMonth() + 1, 0);

  const firstDayOfWeek = firstDay.getDay();
  const lastDayOfWeek = lastDay.getDay();



})
</script>

<style lang="scss">
@import '@/assets/main.scss';

.calendar-container {
  height: 100%;
  min-width: 648px;
  margin: 0 auto;

  .calendar-title {
    margin: 10px 0 0px;

    .title-text {
      font-size: 2rem;
      font-weight: bold;

    }
  }

  .calendar-row {
    padding: 0;
    display: flex;
    flex-direction: row;
    width: 100%;
    list-style: none;

    li {
      padding: 3px;
      flex: 1 1 14%;
      text-align: center;
    }
  }

  .calendar-header {
    border-top: 1px solid $standard-light-gray-in-white;
    border-bottom: 1px solid $standard-light-gray-in-white;

    li:nth-child(1) {
      background-color: #f8dddd;
    }

    li:nth-child(7) {
      background-color: #d1dbee;
    }
  }

  .member-calender {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;

    li {

    }
  }
}
</style>
