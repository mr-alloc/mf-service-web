<template>
  <div class="datepicker-container">
    <div class="collapse-controller">
      <button type="button" class="btn-primary" v-on:click="methods.toggleCollapse()">
        <FontAwesomeIcon v-show="!state.isSelectMode" class="fa-1x" :icon="faCalendarAlt"/>
        <span class="btn-content">{{ state.isSelectMode ? '취소' : '날짜옵션 선택' }}</span>
      </button>
    </div>
    <Transition name="down-fade">
      <div class="mini-calendar-area" v-show="state.isSelectMode">
        <PeriodIndicator v-if="state.scheduleMode.isNotIn(ScheduleMode.REPEAT)" :start="state.startTimestamp"
                         :end="state.endTimestamp"/>
        <ul class="schedule-mode-group">
          <li :key="mode.value" class="mode-item" :class="{ selected: state.scheduleMode.value === mode.value }"
              v-for="mode in ScheduleMode.values().filter(sh => sh.value != ScheduleMode.SINGLE.value)"
              v-on:click="methods.changeScheduleMode(mode)">{{ mode.alias }}
          </li>
        </ul>
        <div class="calendar"
             v-show="state.scheduleMode.isIn(ScheduleMode.MULTIPLE, ScheduleMode.PERIOD) || state.isRepeatStartActive || state.isRepeatEndActive">
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
                  range: state.scheduleMode.isNotIn(ScheduleMode.REPEAT) && state.startTimestamp <= calendarDay.timestamp && state.endTimestamp >= calendarDay.timestamp,
                  start: state.scheduleMode.isNotIn(ScheduleMode.REPEAT) ? state.startTimestamp === calendarDay.timestamp : state.isRepeatStartActive && state.startTimestamp === calendarDay.timestamp,
                  end: state.scheduleMode.isNotIn(ScheduleMode.REPEAT) ? state.endTimestamp === calendarDay.timestamp : state.isRepeatEndActive && state.endTimestamp === calendarDay.timestamp
                }"
                v-for="(calendarDay, index) in state.calendarDays as Array<CalendarDate>"
                :key="index"
                v-on:click="() => calendarDay.isSameMonth(state.thisMonth) && methods.selectDay(calendarDay)">
              <span class="day-text">{{ calendarDay.date }}</span>
            </li>
          </ul>
        </div>
        <div class="repeat-option-container" v-show="state.scheduleMode.isIn(ScheduleMode.REPEAT)">
          <GroupButton ref="repeatOptionButton" :options="RepeatOption.selectOptions()"
                       :after-change="methods.selectRepeatOption"/>
          <div class="option-indicator">
            <div class="weeks-option-specification" v-show="state.repeatOption.value === RepeatOption.WEEK.value">
              <GroupButton ref="weeksRepeatOptionButton" :options="DayOfWeek.selectOptions()"
                           :default-selected="`${state.repeatValues}`" is-multi-select
                           :after-change="methods.selectRepeatDay"/>
            </div>
            <div class="months-option-specification" v-show="state.repeatOption.is(RepeatOption.MONTH)">
              <span class="month-option-key">매월</span>
              <span class="month-option-text">{{ TemporalUtil.toMoment(props.timestamp, true).format("DD일") }}</span>
            </div>
            <div class="years-option-specification" v-show="state.repeatOption.is(RepeatOption.YEAR)">
              <span class="year-option-key">매년</span>
              <span class="year-option-text">{{ TemporalUtil.toMoment(props.timestamp, true).format("MM월 DD일") }}</span>
            </div>
            <div class="repeat-period-option" v-show="!state.isRepeatStartActive && !state.isRepeatEndActive">
              <div class="repeat-time">
                <span class="label-name">시작일</span>
                <StatelessButton :click-behavior="methods.clickRepeatStart"
                                 :title="TemporalUtil.toMoment(state.startTimestamp, true).format('YYYY년 MM월 DD일')"/>
              </div>
              <div class="repeat-time">
                <span class="label-name">종료일</span>
                <StatelessButton :click-behavior="methods.clickRepeatEnd"
                                 :title="state.endTimestamp > 0 ? TemporalUtil.toMoment(state.endTimestamp, true).format('YYYY년 MM월 DD일') : '없음'"/>
              </div>
            </div>
            <StatelessButton v-if="state.isRepeatStartActive || state.isRepeatEndActive" title="범위 선택취소"
                             :click-behavior="methods.cancelRepeatActive"/>
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>
<script setup lang="ts">
import {onMounted, reactive, ref} from "vue";
import type CalendarDate from "@/classes/CalendarDate";
import TemporalUtil from "@/utils/TemporalUtil";
import DateUtil from "@/utils/DateUtil";
import {faCalendarAlt} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/vue-fontawesome";
import DayOfWeek from "@/constant/DayOfWeek";
import ScheduleMode from "@/constant/ScheduleMode";
import PeriodIndicator from "@/components/global/PeriodIndicator.vue";
import RepeatOption from "@/constant/RepeatOption";
import GroupButton from "@/components/global/GroupButton.vue";
import StatelessButton from "@/components/global/StatelessButton.vue";
import PopupUtil from "@/utils/PopupUtil";
import {PopupType} from "@/stores/status/CurrentPopup";
import type IDatePickerOutput from "@/classes/component-protocol/IDatePickerOuput";
import MultipleModeOutput from "@/classes/component-protocol/MultipleModeOutput";
import PeriodModeOutput from "@/classes/component-protocol/PeriodModeOutput";
import RepeatModeOutput from "@/classes/component-protocol/RepeatModeOutput";
import type {GroupButtonExpose} from "@/types/ExposeType";
import {parseInt} from "lodash";
import moment from "moment-timezone";

const repeatOptionButton = ref<GroupButtonExpose | null>(null);
const weeksRepeatOptionButton = ref<GroupButtonExpose | null>(null);
const props = defineProps<{
  timestamp: number,
  afterChangeMode: Function,
}>();
const state = reactive({
  scheduleMode: ScheduleMode.values()[0],
  repeatOption: RepeatOption.NONE,
  thisMonth: TemporalUtil.toMoment(props.timestamp, true).month() + 1,
  isSelectMode: false,
  calendarDays: [] as Array<CalendarDate>,
  selected: new Set<number>(),
  firstStamp: 0,
  secondStamp: 0,
  startTimestamp: 0,
  endTimestamp: 0,
  repeatValues: new Set<number>(),

  isRepeatStartActive: false,
  isRepeatEndActive: false
});
const methods = {
  resetAllValues() {
    state.selected.clear();
    state.firstStamp = 0;
    state.endTimestamp = 0;
    state.startTimestamp = 0;
    state.endTimestamp = 0;
    state.repeatOption = RepeatOption.NONE;
    state.isRepeatStartActive = false;
    state.isRepeatEndActive = false;
    repeatOptionButton.value?.resetValues();
    weeksRepeatOptionButton.value?.resetValues();
  },
  toggleCollapse() {
    state.isSelectMode = !state.isSelectMode;

    if (!state.isSelectMode) {
      methods.resetAllValues();
      state.scheduleMode = ScheduleMode.SINGLE;
    }
  },
  selectRangeSchedule(calendarDay: CalendarDate) {
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
  selectDay(calendarDay: CalendarDate) {
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
        break;
      case ScheduleMode.REPEAT.value:
        if (state.isRepeatStartActive) {
          state.startTimestamp = calendarDay.timestamp;
          state.isRepeatStartActive = false;
        } else if (state.isRepeatEndActive) {

          if (state.startTimestamp >= calendarDay.timestamp) {
            PopupUtil.innerAlert(PopupType.INFO, "종료일 선택 불가", `시작일 ${TemporalUtil.toMoment(state.startTimestamp, true).format("YYYY년 MM월 DD일")} 이후로 선택해주세요.`);
            return;
          }

          //종료는 재선택시 없음
          if (state.endTimestamp == calendarDay.timestamp) {
            state.endTimestamp = 0;
            state.isRepeatEndActive = false;
            return;
          }

          state.endTimestamp = calendarDay.timestamp;
          state.isRepeatEndActive = false;
        }
        break;
    }
  },
  changeScheduleMode(scheduleMode: ScheduleMode) {
    //모드 변경감지(기존 선택값 초기화)
    if (state.scheduleMode.value !== scheduleMode.value) {
      methods.resetAllValues();
      //반복은 시작일 초기화
      if (scheduleMode.isIn(ScheduleMode.REPEAT)) {
        state.startTimestamp = props.timestamp;
      } else if (scheduleMode.isIn(ScheduleMode.MULTIPLE)) {
        state.selected.add(props.timestamp);
      } else if (scheduleMode.isIn(ScheduleMode.PERIOD)) {
        state.startTimestamp = props.timestamp;
        state.firstStamp = props.timestamp;
      }
    }

    state.scheduleMode = scheduleMode;
    props.afterChangeMode && props.afterChangeMode(scheduleMode);
  },
  selectRepeatOption(options: Set<string>) {
    const selected = Array.from(options);
    state.repeatOption = RepeatOption.fromValue(parseInt(selected[0]));
    state.startTimestamp = props.timestamp;
  },
  clickRepeatStart(event: MouseEvent) {
    state.isRepeatStartActive = true;
  },
  clickRepeatEnd(event: MouseEvent) {
    state.isRepeatEndActive = true;
  },
  cancelRepeatActive(event: MouseEvent) {
    state.isRepeatStartActive = false;
    state.isRepeatEndActive = false;
  },
  extractResult(): IDatePickerOutput {
    switch (state.scheduleMode.value) {
      case ScheduleMode.MULTIPLE.value:
        return new MultipleModeOutput(state.selected);
      case ScheduleMode.PERIOD.value:
        return new PeriodModeOutput(state.startTimestamp, state.endTimestamp + (TemporalUtil.SECONDS_IN_DAY - 1));
      case ScheduleMode.REPEAT.value: {
        const repeatValue = state.repeatOption.is(RepeatOption.WEEK) ? Array.from(state.repeatValues) : [props.timestamp];
        return RepeatModeOutput.of(state.repeatOption as RepeatOption, repeatValue, state.startTimestamp, state.endTimestamp);
      }
      default:
        throw new Error("Invalid Schedule Mode");
    }
  },
  selectRepeatDay(options: Set<string>) {
    const selected = Array.from(options).map(value => parseInt(value));
    state.repeatValues = new Set<number>([...selected]);
  }
}

defineExpose({
  getScheduleMode: () => state.scheduleMode,
  extractResult: methods.extractResult
})
onMounted(() => {
  const momentValue = TemporalUtil.toMoment(props.timestamp, true);
  state.calendarDays = DateUtil.getCalendarDays(momentValue);
  state.selected.add(props.timestamp);
});
</script>
<style scoped lang="scss">
@import '@assets/main';

.datepicker-container {
  margin: 10px auto;
  width: 270px;

  .collapse-controller {
    padding: 5px 0;

    button {
      width: 100%;

      .btn-content {
        margin: 0 5px;
      }
    }

  }

  .mini-calendar-area {
    padding: 5px 8px;
    transition: .2s ease 0ms;

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


        &.today {
          .day-text {
            border-radius: 50%;
            border: 2px $signature-purple solid;
            font-weight: bold;
            color: black;

            &:hover {
              cursor: pointer;
            }
          }
        }

        &.contain {
          .day-text {
            background-color: $signature-purple;
            color: white;
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

    .repeat-option-container {
      display: flex;
      justify-content: center;
      align-items: center;
      flex-direction: column;

      .option-indicator {
        width: 100%;

        .months-option-specification {
          display: flex;
          font-weight: bold;

          .month-option-key {
            flex-shrink: 0;
            padding: 0 8px;
          }

          .month-option-text {
            flex-grow: 1;
            color: $signature-purple;
            text-align: center;
          }
        }

        .years-option-specification {
          display: flex;
          font-weight: bold;

          .year-option-key {
            flex-shrink: 0;
            padding: 0 8px;
          }

          .year-option-text {
            flex-grow: 1;
            color: $signature-purple;
            text-align: center;
          }
        }

        .repeat-period-option {
          display: flex;
          justify-content: space-between;
          width: 100%;
          flex: 1 1 50%;

          .repeat-time {
            display: flex;
            flex-direction: column;
            align-items: center;
            width: 50%;

            .label-name {
              font-size: .84rem;
              font-weight: bold;
            }
          }

          .repeat-time {
            font-size: .75rem;
          }

        }
      }
    }
  }
}
</style>
