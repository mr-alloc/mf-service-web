<template>
  <div class="calendar-container">
    <div class="calendar-title">
      <span class="title-text">{{ `${state.localMonth.format("YYYY년 MM월")} 달력` }}</span>
      <div class="calendar-control">
        <button class="control-button" type="button" v-on:click="methods.setMonth(-1)">
          <FontAwesomeIcon icon="caret-left"/>
        </button>
        <button class="control-button" type="button" v-on:click="methods.setMonth(+1)">
          <FontAwesomeIcon icon="caret-right"/>
        </button>
      </div>
    </div>
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
    <Transition name="fade">
      <div class="calendar-controller" v-show="calendarStore.timestamp > 0">
        <ul class="calendar-feature-group">
          <li class="feature-item" v-on:click="methods.createMission">
            <FontAwesomeIcon :icon="faPlus"/>
            <span class="description">미션추가</span>
          </li>
          <li class="feature-item">
            <FontAwesomeIcon :icon="faRecycle"/>
            <span class="description">루틴추가</span>
          </li>
          <li class="feature-item" v-on:click="methods.createAnniversary">
            <FontAwesomeIcon :icon="faCalendarDay"/>
            <span class="description">휴가/기념일 지정</span>
          </li>
          <li class="feature-item" v-on:click="calendarStore.resetSelected">
            <FontAwesomeIcon :icon="faRectangleXmark"/>
            <span class="description">선택취소</span>
          </li>
        </ul>
      </div>
    </Transition>
  </div>
</template>
<script setup lang="ts">
import CalendarWeek from "@/components/main/CalendarWeek.vue";
import DateUtil from "@/utils/DateUtil";
import moment from "moment-timezone";
import {inject, onMounted, reactive} from "vue";
import DayOfWeek from "@/constant/DayOfWeek";
import {useCalendarStore} from "@/stores/CalendarStore";
import CalendarDate from "@/classes/CalendarDate";
import {FontAwesomeIcon} from "@fortawesome/vue-fontawesome";
import {faPlus} from "@fortawesome/free-solid-svg-icons/faPlus";
import {faRecycle} from "@fortawesome/free-solid-svg-icons/faRecycle";
import {faCalendarDay} from "@fortawesome/free-solid-svg-icons/faCalendarDay";
import {faRectangleXmark} from "@fortawesome/free-regular-svg-icons/faRectangleXmark";
import PopupUtil from "@/utils/PopupUtil";


const emitter: any = inject('emitter');
const calendarStore = useCalendarStore();
const state = reactive({
  calendarWeeks: new Map<number, Array<CalendarDate>>(),
  selected: 0,
  startOfCalendar: 0,
  startOfMonth: 0,
  endOfMonth: 0,
  endOfCalendar: 0,
  localMonth: moment(),
  thisMonthKey: '',
  y: 0,
});
const methods = {
  createAnniversary(event: MouseEvent) {
    PopupUtil.popupCreateAnniversary(emitter);
  },
  createMission(day: CalendarDate) {
    PopupUtil.popupCreateMission(emitter, calendarStore.timestamp);
  },
  setMonth(month: number) {
    state.localMonth.add(month, 'month');
    this.fetchCalenderSchedules();
  },
  fetchCalendar() {
    state.calendarWeeks = DateUtil.getCalendarWeeks(state.localMonth, (soc, som, eom, eoc) => {
      state.startOfCalendar = soc.unix();
      state.startOfMonth = som.unix();
      state.endOfMonth = eom.unix();
      state.endOfCalendar = eoc.unix();
    });

    state.thisMonthKey = state.localMonth.format(DateUtil.YYYYMM);
  },
  fetchMissionAndAnniversary() {
    //미션,공휴일
    calendarStore.fetchOwnCalendar(state.startOfCalendar, state.startOfMonth, state.endOfMonth, state.endOfCalendar);
    //기념일
    calendarStore.fetchOwnAnniversaries();
  },
  fetchCalenderSchedules() {
    this.fetchCalendar();
    this.fetchMissionAndAnniversary();
  }
}
onMounted(() => {
  methods.fetchCalendar();
  methods.fetchMissionAndAnniversary();

  emitter.on('selectDate', (selectedDate: CalendarDate) => {
    //재클릭시 초기화
    if (selectedDate.timestamp === state.selected) {
      state.selected = 0;
      return;
    }
    state.selected = selectedDate.timestamp;
  });

  emitter.on('drawCalendar', () => {
    methods.fetchMissionAndAnniversary();
  });
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

  .calendar-title {
    margin: 10px 0 0;
    height: 60px;
    flex-shrink: 0;
    padding: 0 20px;
    display: flex;
    flex-direction: row;

    .title-text {
      font-size: 2rem;
      font-weight: bold;
      flex-shrink: 0;
    }

    .calendar-control {
      display: flex;
      flex-direction: row;
      justify-content: flex-end;
      margin-top: 10px;
      flex-grow: 1;
      align-items: center;

      .control-button {
        margin-left: 10px;
        padding: 3px 10px;
        border-radius: 5px;
        transition: $duration;
        cursor: pointer;
        height: 30px;

        &:hover {
          background-color: rgb(0, 0, 0, .2);
        }
      }
    }
  }

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

  .calendar-controller {
    position: fixed;
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
    width: max-content;
    padding: 10px 20px;
    flex-shrink: 0;
    background-color: white;
    border-top: 1px solid $standard-light-gray-in-white;
    bottom: 100px;
    left: 50%;
    transform: translate(-50%, 50%);
    box-shadow: $standard-box-shadow;
    border-radius: 5px;
    z-index: 1;
    transition: $duration;

    .panel-header {
      font-size: .84rem;
      font-weight: bold;
      padding: 5px 0;
      border-bottom: 1px solid $standard-light-gray-in-white;
    }

    .calendar-feature-group {
      display: flex;
      flex-direction: row;
      justify-content: center;
      padding: 2px;

      .feature-item {
        display: flex;
        cursor: pointer;
        transition: $duration;
        border-radius: 5px;
        width: 2.5rem;
        height: 2.5rem;
        justify-content: center;
        align-items: center;
        margin: 0 2px;
        position: relative;

        .description {
          font-size: .84rem;
          position: absolute;
          z-index: -1;
          opacity: 0;
          background-color: $standard-clean-black;
          color: white;
          border-radius: 5px;
          top: -30px;
          left: 50%;
          transform: translateX(-50%);
          transition: $duration;
          width: max-content;
          padding: 2px 5px;

          &:after {
            border-top: 10px solid $standard-clean-black;
            border-left: 10px solid transparent;
            border-right: 10px solid transparent;
            border-bottom: 0 solid transparent;
            border-radius: 10px;
            content: "";
            position: absolute;
            top: 90%;
            left: 50%;
            transform: translateX(-50%);
          }
        }

        &:hover {
          background-color: rgb(0, 0, 0, .2);

          .description {
            z-index: 1;
            opacity: 1;
          }
        }
      }
    }
  }
}
</style>
