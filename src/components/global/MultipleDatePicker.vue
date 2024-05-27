<template>
  <div class="multiple-datepicker-container">
    <label class="title" v-if="props.label" :for="props.id">{{ props.label }}</label>
    <div class="collapse-controller">
      <button type="button" class="btn-primary" v-on:click="methods.toggleCollapse()">
        <FontAwesomeIcon class="fa-1x" :icon="faCalendarAlt"/>
        <span class="btn-content">{{ state.isSelectMode ? '닫기' : '날짜 선택' }}</span>
      </button>
    </div>
    <Transition name="down-fade">
      <div class="mini-calendar-area" v-show="state.isSelectMode">
        <div class="calendar-info">
          <div class="title"></div>
          <ul class="days-name-group">
            <li class="day-name">일</li>
            <li class="day-name">월</li>
            <li class="day-name">화</li>
            <li class="day-name">수</li>
            <li class="day-name">목</li>
            <li class="day-name">금</li>
            <li class="day-name">토</li>
          </ul>
          <ul class="days-item-group">
            <li class="day"
                :class="{ hide: !calendarDay.isSameMonth(state.thisMonth), contain: state.selected.has(calendarDay.day) }"
                v-for="(calendarDay, index) in state.calendarDays as Array<CalendarDay>"
                :key="index" v-on:click="() => methods.selectDay(calendarDay)">{{ calendarDay.day }}
            </li>
          </ul>
        </div>
      </div>
    </Transition>
  </div>
</template>
<script setup lang="ts">
import {onMounted, reactive} from "vue";
import type CalendarDay from "@/classes/CalendarDay";
import TemporalUtil from "@/utils/TemporalUtil";
import DateUtil from "@/utils/DateUtil";
import {faCalendarAlt} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/vue-fontawesome";

const props = defineProps({
  id: String,
  label: String,
  name: String,
  timestamp: Number,
});
const state = reactive({
  thisMonth: TemporalUtil.toMoment(props.timestamp!, true).month(),
  isSelectMode: false,
  calendarDays: [] as Array<CalendarDay>,
  selected: new Set<number>()
});
const methods = {
  toggleCollapse() {
    state.isSelectMode = !state.isSelectMode;
  },
  selectDay(calendarDay: CalendarDay) {
    if (calendarDay.isSameMonth(state.thisMonth!)) {
      if (state.selected.has(calendarDay.day))
        state.selected.delete(calendarDay.day);
      else
        state.selected.add(calendarDay.day);
    }
  }
}
onMounted(() => {
  const momentValue = TemporalUtil.toMoment(props.timestamp ?? TemporalUtil.getEpochSecond(), false);
  state.calendarDays = DateUtil.getCalendarDays(momentValue);
});
</script>
<style scoped lang="scss">
@import '@/assets/main';

.multiple-datepicker-container {

  .collapse-controller {

    button {
      width: 100%;

      .btn-content {
        margin: 0 5px;
      }
    }

  }

  .mini-calendar-area {

    .calendar-info {


      .title {

      }

      .days-name-group {
        display: grid;
        grid-template-columns: repeat(7, 1fr);

        .day-name {
          font-size: .84rem;
          text-align: center;
          padding: 5px;
          font-weight: bold;

          &:first-child {
            color: crimson;
          }

          &:last-child {
            color: royalblue;
          }
        }


      }

      .days-item-group {
        display: grid;
        grid-template-columns: repeat(7, 1fr);

        .day {
          padding: 2px 5px;
          font-size: .84rem;
          border-radius: 5px;
          width: 30px;
          text-align: center;
          transition: $duration;
          margin: 1px;

          &.hide {
            opacity: 0;

            &:hover {
              background-color: unset;
              cursor: unset;
            }
          }

          &.contain {
            background-color: $standard-weight-gray-in-white;

            &:hover {
              background-color: $standard-weight-gray-in-white;
            }
          }

          &:hover {
            background-color: $standard-gray-in-white;
            cursor: pointer;
          }
        }
      }
    }
  }
}
</style>
