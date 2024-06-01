<template>
  <div class="datepicker-container">
    <div class="collapse-controller">
      <button type="button" class="btn-primary" v-on:click="methods.toggleCollapse()">
        <FontAwesomeIcon v-show="!state.isSelectMode" class="fa-1x" :icon="faCalendarAlt"/>
        <span class="btn-content">{{ state.isSelectMode ? '취소' : '다른날짜 선택' }}</span>
      </button>
    </div>
    <Transition name="down-fade">
      <div class="mini-calendar-area" v-show="state.isSelectMode">
        <PeriodIndicator :start="state.startTimestamp" :end="state.endTimestamp"/>
        <ul class="schedule-mode-group">
          <li :key="mode.value" class="mode-item" :class="{ selected: state.scheduleMode.value === mode.value }"
              v-for="mode in ScheduleMode.values().filter(sh => sh.value != ScheduleMode.SINGLE.value)"
              v-on:click="methods.changeScheduleMode(mode)">{{ mode.alias }}
          </li>
        </ul>
        <div class="calendar" v-show="state.scheduleMode.isIn(ScheduleMode.MULTIPLE, ScheduleMode.PERIOD)">
          <div class="title">{{ state.thisMonth }}월</div>
          <ul class="days-name-group">
            <li class="day-name" :key="day.value" v-for="(day) in DayOfWeek.values()">{{ day.alias }}</li>
          </ul>
          <ul class="days-item-group">
            <li class="day"
                :class="{
                  hide: !calendarDay.isSameMonth(state.thisMonth),
                  contain: state.selected.has(calendarDay.timestamp),
                  today: DateUtil.toString(moment()) === calendarDay.dateStr,
                  range: state.startTimestamp <= calendarDay.timestamp && state.endTimestamp >= calendarDay.timestamp,
                  start: state.startTimestamp === calendarDay.timestamp,
                  end: state.endTimestamp === calendarDay.timestamp
                }"
                v-for="(calendarDay, index) in state.calendarDays as Array<CalendarDay>"
                :key="index" v-on:click="() => methods.selectDay(calendarDay)">
              <span class="day-text">{{ calendarDay.day }}</span>
            </li>
          </ul>
        </div>
        <div class="repeat-option" v-show="state.scheduleMode.isIn(ScheduleMode.REPEAT)">
          <!--          <SimpleRadio :options="RepeatOption.selectOptions()" :after-change="methods.selectRepeatOption" />-->
          <GroupButton :options="RepeatOption.selectOptions()"/>
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
import DayOfWeek from "@/constant/DayOfWeek";
import ScheduleMode from "@/constant/ScheduleMode";
import moment from "moment-timezone";
import PeriodIndicator from "@/components/global/PeriodIndicator.vue";
import RepeatOption from "@/constant/RepeatOption";
import type SelectOption from "@/classes/SelectOption";
import GroupButton from "@/components/global/GroupButton.vue";

const props = defineProps({
  timestamp: Number,
  defaultSelect: Number
});
const state = reactive({
  scheduleMode: ScheduleMode.values()[0],
  repeatOption: RepeatOption.NONE,
  thisMonth: TemporalUtil.toMoment(props.timestamp!, true).month() + 1,
  isSelectMode: false,
  calendarDays: [] as Array<CalendarDay>,
  selected: new Set<number>(),
  firstStamp: 0,
  secondStamp: 0,
  startTimestamp: 0,
  endTimestamp: 0
});
const methods = {
  toggleCollapse() {
    state.isSelectMode = !state.isSelectMode;
  },
  selectRangeSchedule(calendarDay: CalendarDay) {
    //이미 번위가 정해져 있지만, 다른 날짜를 선택할 경우 모두 초기화
    if (
        state.startTimestamp > 0 && state.endTimestamp > 0 &&
        state.startTimestamp !== calendarDay.timestamp &&
        state.endTimestamp !== calendarDay.timestamp) {
      state.startTimestamp = 0;
      state.endTimestamp = 0;
      state.firstStamp = 0;
      state.secondStamp = 0;
      state.repeatOption = RepeatOption.NONE;
    }

    //첫번 째 값을 다시 클릭
    if (state.firstStamp === calendarDay.timestamp) {
      if (state.startTimestamp > 0 && state.endTimestamp === 0) {
        state.firstStamp = 0;
        state.startTimestamp = 0;
      } else if (state.firstStamp < state.secondStamp) {
        state.firstStamp = state.endTimestamp;
        state.startTimestamp = state.endTimestamp;
        state.secondStamp = 0;
        state.endTimestamp = 0;
      } else {
        state.firstStamp = state.startTimestamp;
        state.secondStamp = 0;
        state.endTimestamp = 0;
      }
      return;
    }
    //두번 째 값 다시 클릭
    else if (state.secondStamp === calendarDay.timestamp) {
      if (state.firstStamp < state.secondStamp) {
        state.secondStamp = 0;
        state.endTimestamp = 0;
      } else {
        state.startTimestamp = state.endTimestamp;
        state.secondStamp = 0;
        state.endTimestamp = 0;
      }
      return;
    }

    if (state.firstStamp === 0) {
      state.firstStamp = calendarDay.timestamp;
      state.startTimestamp = calendarDay.timestamp;
    } else if (state.secondStamp === 0) {
      if (state.firstStamp < calendarDay.timestamp) {
        state.secondStamp = calendarDay.timestamp;
        state.endTimestamp = calendarDay.timestamp;
      } else {
        state.secondStamp = calendarDay.timestamp;
        state.endTimestamp = state.startTimestamp;
        state.startTimestamp = calendarDay.timestamp;
      }
    }
  }
  ,
  selectDay(calendarDay: CalendarDay) {
    switch (state.scheduleMode.value) {
      case ScheduleMode.MULTIPLE.value:
        if (state.selected.has(calendarDay.timestamp)) {
          state.selected.delete(calendarDay.timestamp);
        } else {
          state.selected.add(calendarDay.timestamp);
        }
        break;
      case ScheduleMode.PERIOD.value:
        methods.selectRangeSchedule(calendarDay);
        const start = state.startTimestamp > 0 ? TemporalUtil.toMoment(state.startTimestamp, true).format(DateUtil.DEFAULT_DATE_FORMAT) : "선택되지 않음";
        const end = state.endTimestamp > 0 ? TemporalUtil.toMoment(state.endTimestamp, true).format(DateUtil.DEFAULT_DATE_FORMAT) : "선택되지 않음";

        console.log('start', start, 'end', end);
        break;
    }
  },
  changeScheduleMode(scheduleMode: ScheduleMode) {
    //모드 변경감지(기존 선택값 초기화)
    if (state.scheduleMode.value !== scheduleMode.value) {
      state.selected.clear();
      state.firstStamp = 0;
      state.endTimestamp = 0;
      state.startTimestamp = 0;
      state.endTimestamp = 0;
      state.repeatOption = RepeatOption.NONE;
    }
    state.scheduleMode = scheduleMode;
  },
  selectRepeatOption(selectOption: SelectOption) {
    state.repeatOption = RepeatOption.fromValue(parseInt(selectOption.value));
  }
}

defineExpose({
  selected: state.selected
})
onMounted(() => {
  const momentValue = TemporalUtil.toMoment(props.timestamp ?? TemporalUtil.getEpochSecond(), true);
  state.calendarDays = DateUtil.getCalendarDays(momentValue);
  if (props.defaultSelect) {
    state.selected.add(TemporalUtil.toMoment(props.defaultSelect, true).date());
  }
});
</script>
<style scoped lang="scss">
@import '@/assets/main';

.datepicker-container {
  margin: 10px 0;
  width: 270px;

  .collapse-controller {

    button {
      width: 100%;

      .btn-content {
        margin: 0 5px;
      }
    }

  }

  .mini-calendar-area {
    padding: 5px 8px;

    .schedule-mode-group {
      display: flex;
      justify-content: space-evenly;
      margin: 5px 0;

      .mode-item {
        padding: 3px 5px;
        cursor: pointer;
        transition: $duration;
        line-height: 1;

        &.selected {
          font-weight: bold;
          border-bottom: 2px $signature-purple solid;
        }
      }
    }


    .title {
      font-weight: bold;
      text-align: center;
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
        width: 35px;
        height: 35px;
        display: flex;
        justify-content: center;
        align-items: center;

        .day-text {
          font-size: .84rem;
          border-radius: 5px;
          text-align: center;
          padding: 5px;
          transition: $duration;
          display: flex;
          justify-content: center;
          align-items: center;
          width: 30px;
          height: 30px;
          line-height: 1;

          &:hover {
            background-color: $standard-gray-in-white;
            cursor: pointer;
          }
        }

        &.hide {
          opacity: 0;

          &:hover {
            background-color: unset;
            cursor: unset;
          }
        }

        &.contain {
          .day-text {
            background-color: $signature-purple;
            color: white;
          }
        }

        &.today {
          .day-text {
            border-radius: 50%;
            border: 2px $signature-purple solid;
            font-weight: bold;
            color: black;

            &:hover {
              background-color: white;
              cursor: pointer;
            }
          }
        }

        &.range {
          .day-text {
            background-color: $little-light-signature-purple;
            color: white
          }
        }

        &.start {
          .day-text {
            background-color: $signature-purple !important;
            border-radius: 5px !important;
            color: white
          }
        }

        &.end {
          .day-text {
            background-color: $signature-purple !important;
            border-radius: 5px !important;
            color: white
          }
        }
      }
    }

    .repeat-option {
      display: flex;
      justify-content: center;
      align-items: center;
    }
  }
}
</style>
