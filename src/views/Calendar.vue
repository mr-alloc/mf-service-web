<template>
  <div class="calendar-container">
    <div class="day-of-weeks">
      <div class="day" v-for="day in DayOfWeek.values()" :key="day.value">{{ day.alias }}</div>
    </div>
    <div class="week-wrapper">
      <CalendarWeek :days="days" :key="week"
                    v-for="([week, days]) in state.calendarWeeks.entries()"
                    :week="week"
                    :geometries="calendarStore.calendarScheduleMap.get(state.thisMonthKey)?.get(week) ?? []"
      />
    </div>
  </div>
</template>
<script setup lang="ts">
import CalendarWeek from "@/components/main/CalendarWeek.vue";
import DateUtil from "@/utils/DateUtil";
import moment from "moment-timezone";
import {onMounted, reactive} from "vue";
import DayOfWeek from "@/constant/DayOfWeek";
import {useCalendarStore} from "@/stores/CalendarStore";
import type CalendarDate from "@/classes/CalendarDate";

const calendarStore = useCalendarStore();
const state = reactive({
  calendarWeeks: new Map<number, Array<CalendarDate>>(),
  startOfCalendar: 0,
  endOfCalendar: 0,
  thisMonthKey: '',
});

onMounted(() => {
  state.calendarWeeks = DateUtil.getCalendarWeeks(moment(), (soc, som, eom, eoc) => {
    state.startOfCalendar = soc.unix();
    state.endOfCalendar = eoc.unix();
  })
  //미션,공휴일
  calendarStore.fetchOwnCalendar(state.startOfCalendar, state.endOfCalendar);
  //기념일
  calendarStore.fetchOwnAnniversaries();
  state.thisMonthKey = calendarStore.thisMonthKey;
})
</script>
<style scoped lang="scss">
@import "@/assets/main";

.calendar-container {
  display: flex;
  height: 100%;
  background-color: #fff;
  flex-direction: column;
  user-select: none;

  .day-of-weeks {
    display: flex;
    flex-direction: row;
    padding: 5px 0;

    .day {
      flex: 1 1 0%;
      font-weight: bold;
      text-align: center;
    }
  }

  .week-wrapper {
    margin: 0;
    overflow: hidden;
    -webkit-box-flex: 1;
    -webkit-flex: 1 1 0%;
    flex: 1 1 0%;
    display: flex;
    -webkit-box-orient: vertical;
    -webkit-box-direction: normal;
    flex-direction: column;

  }
}
</style>
