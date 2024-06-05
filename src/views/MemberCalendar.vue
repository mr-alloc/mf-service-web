<template>
  <div class="calendar-container" v-show="state.timestamp > 0">
    <div class="calendar-title">
      <span class="title-text">{{ `${state.calendarTitle} 달력` }}</span>
      <div class="calendar-control">
        <button class="control-button" type="button" v-on:click="methods.setMonth(-1)">
          <FontAwesomeIcon icon="caret-left"/>
        </button>
        <button class="control-button" type="button" v-on:click="methods.setMonth(+1)">
          <FontAwesomeIcon icon="caret-right"/>
        </button>
      </div>
    </div>
    <div class="calendar-wrapper">
      <ul class="calendar-row calendar-header">
        <li>일</li>
        <li>월</li>
        <li>화</li>
        <li>수</li>
        <li>목</li>
        <li>금</li>
        <li>토</li>
      </ul>
      <ul class="calendar-row member-calendar" v-show="state.calendar">
        <li class="each-day-item" v-for="(day, index) in state.calendar as Array<CalendarDay>" :key="index"
            v-on:click="methods.selectDate(day)" :id="`calendar-${day.dateStr}`"
            :class="{
              holiday: calendarStore.holidaysMap.has(DateUtil.to(day.value, 'MM-DD')),
              anniversary: calendarStore.anniversaryMap.has(day.dateStr),
              selected: calendarStore.timestamp === day.timestamp
            }">
          <div class="item-header">
            <span class="date" :class="{ today: DateUtil.toString(moment()) === day.dateStr }">
              {{ day.day == 1 ? day.value.format('M/D') : day.value.format('D') }}
            </span>
            <div class="day-description">
              <span class="mission-count"
                    v-show="calendarStore.memberCalendarMap.get(day.dateStr)?.length ?? 0 > 0">
                {{ calendarStore.memberCalendarMap.get(day.dateStr)?.length }}
              </span>
              <span class="holiday-name" v-show="calendarStore.holidaysMap.has(DateUtil.to(day.value, 'MM-DD'))">
                {{ calendarStore.holidaysMap.get(DateUtil.to(day.value, 'MM-DD'))?.name }}
              </span>
              <span class="anniversary-name"
                    :class="{ slash: calendarStore.holidaysMap.has(DateUtil.to(day.value, 'MM-DD'))}"
                    v-if="calendarStore.anniversaryMap.has(day.dateStr)">
                {{
                  `${calendarStore.anniversaryMap.get(day.dateStr)?.[0].name}` + (calendarStore.anniversaryMap.get(day.dateStr)!.length > 1 ? `${calendarStore.anniversaryMap.get(day.dateStr)!.length - 1}개` : ``)
                }}
              </span>
            </div>
          </div>
          <div class="item-body">
            <TransitionGroup class="daily-schedules" tag="ul" name="fade">
              <li class="each-schedule"
                  v-for="(mission, index) in calendarStore.memberCalendarMap.get(day.dateStr) ?? []"
                  :key="index" v-on:click="methods.clickSchedule($event, mission)"
              >
                <div class="schedule-title">
                  <span class="status" :class="[MissionStatus.fromCode(mission.status)?.simpleName]"
                        :style="{ backgroundColor: `#${MissionStatus.fromCode(mission.status)?.color}` }">{{
                      MissionStatus.fromCode(mission.status)?.name
                    }}</span>
                  <span class="title-text">{{ mission.name }}</span>
                </div>
              </li>
            </TransitionGroup>
          </div>
        </li>
      </ul>
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
  </div>
</template>

<script setup lang="ts">
import {inject, onMounted, reactive} from "vue";
import moment from "moment-timezone";
import {FontAwesomeIcon} from "@fortawesome/vue-fontawesome";
import {type IMission,} from "@/classes/api-spec/mission/GetMemberCalendar"
import DateUtil from "@/utils/DateUtil";
import PopupUtil from "@/utils/PopupUtil";
import TemporalUtil from "@/utils/TemporalUtil";
import MissionStatus from "@/constant/MissionStatus";
import {useCalendarStore} from "@/stores/CalendarStore";
import CalendarDay from "@/classes/CalendarDay";
import {faPlus} from "@fortawesome/free-solid-svg-icons/faPlus";
import {faRecycle} from "@fortawesome/free-solid-svg-icons/faRecycle";
import {faCalendarDay} from "@fortawesome/free-solid-svg-icons/faCalendarDay";
import {faRectangleXmark} from "@fortawesome/free-regular-svg-icons/faRectangleXmark";


const emitter = inject("emitter");
const calendarStore = useCalendarStore();
const state = reactive({
  calendarTitle: '',
  timestamp: TemporalUtil.getEpochSecond(false),
  calendar: [] as Array<CalendarDay>,
  startDate: moment(),
  endDate: moment(),
  selectedDate: ''
})
const methods = {
  createAnniversary(event: MouseEvent) {
    PopupUtil.popupCreateAnniversary(emitter);
  },
  createMission(day: CalendarDay) {
    PopupUtil.popupCreateMission(emitter, day.timestamp);
  },
  setMonth(month: number) {
    const localMoment = TemporalUtil.toMoment(state.timestamp + TemporalUtil.getOffsetSecond(), true);
    localMoment.add(month, 'month');
    state.timestamp = localMoment.utc(false).unix();
    methods.drawCalendar();
  },
  drawCalendar() {
    const localMoment = TemporalUtil.toMoment(state.timestamp + TemporalUtil.getOffsetSecond(), true);
    state.calendarTitle = localMoment.format("YY년 MM월");

    state.calendar = DateUtil.getCalendarDays(localMoment, (calendarStart, monthStart, monthEnd, calendarEnd) => {
      state.startDate = calendarStart;
      state.endDate = calendarEnd;
    });

    calendarStore.fetchOwnCalendar();
    calendarStore.fetchOwnAnniversaries(localMoment);

  },
  clickSchedule(e: MouseEvent, mission: IMission) {
    e.stopPropagation();
    PopupUtil.popupMissionDetail(mission);
  },
  selectDate(day: CalendarDay) {
    calendarStore.selectDate(day);
  },
}
onMounted(() => {
  methods.drawCalendar();

  emitter.on("drawMemberCalendar", () => {
    methods.drawCalendar();
  });
})
</script>

<style scoped lang="scss">
@import '@/assets/main.scss';

.calendar-container {
  height: 100%;
  min-width: 648px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;

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

  .calendar-wrapper {
    display: flex;
    flex-direction: column;
    flex-grow: 1;
    position: relative;


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
      border: 0.5px solid $standard-light-gray-in-white;
      height: 30px;
      flex-shrink: 0;

      li {
        font-weight: bold;
      }

      li:nth-child(1) {
        color: crimson;
      }

      li:nth-child(7) {
        color: #5da8fa;
      }

      li:not(:last-child) {
        border-right: 1px solid $standard-light-gray-in-white;
      }
    }

    .member-calendar {
      display: grid;
      grid-template-columns: repeat(7, minmax(0, 1fr));
      grid-auto-rows: 1fr;
      flex-wrap: wrap;
      flex-grow: 1;
      position: relative;

      .each-day-item {
        border: 0.5px solid $standard-light-gray-in-white;
        transition: $duration, border 0s, transform .1s, position 0s;
        display: flex;
        flex-direction: column;
        //background-color: rgb(0, 0, 0, .2);
        overflow: hidden;
        top: 0;
        left: 0;

        &:hover {
          cursor: pointer;
        }

        &.range {
          background-color: $super-light-signature-purple;
        }

        &.selected {
          background-color: $little-light-signature-purple !important;
          position: relative;
          z-index: 1;
        }

        &.start::before, &.end::before {
          position: absolute;
          top: 0;
          left: 50%;
          padding: 2px 4px;
          font-weight: bold;
          font-size: .64rem;
          border-radius: 5px;
          transform: translate(-50%, 3px);
          background-color: $standard-clean-black;
          line-height: 1;
          color: white;
        }

        &.start::before {
          content: '시작일';
        }

        &.end::before {
          content: '종료일';
        }

        &.holiday {
          background-color: #f8dddd;
          color: crimson;

          .item-header {
            display: flex;
            flex-direction: row;

            .holiday-name {
              font-weight: bold;
              margin-left: 5px;
            }
          }
        }

        &.anniversary {
          background-color: $soft-light-sky-blue;
        }


        .item-header {
          text-align: left;
          font-weight: bold;
          font-size: .64rem;
          user-select: none;
          height: 15px;
          flex-shrink: 0;

          .date {
            font-weight: bold;

            &.today {
              background-color: $signature-purple;
              border-radius: 5px;
              color: white;
              padding: 2px 8px;
            }
          }

          .day-description {
            display: flex;
            flex-direction: row;

            .mission-count {
              border-radius: 15px;
              color: white;
              background-color: crimson;
              font-weight: bold;
              padding: 1px 4px;
              margin: 0 5px;
            }
          }
        }

        .item-body {
          flex-grow: 1;

          display: flex;
          flex-direction: column;

          .daily-schedules {
            list-style: none;
            padding: 2px;
            flex-grow: 1;
            text-align: center;
            flex-wrap: wrap;

            .each-schedule {
              text-align: left;
              flex-grow: 1;
              line-height: 1;
              display: flex;
              flex-direction: row;
              overflow: hidden;
              padding: 0;
              margin: 0 2px;
              border-radius: 5px;
              transition: $duration;
              align-items: flex-start;

              .schedule-title {
                font-size: .74rem;
                white-space: nowrap;
                border-radius: 5px;
                cursor: pointer;
                transition: $duration;
                padding: 2px 2px;
                display: flex;
                width: max-content;
                justify-content: center;
                align-items: center;

                .status {
                  font-weight: bold;
                  padding: 2px 3px;
                  border-radius: 5px;
                  font-size: .64rem;

                  &.always {
                    color: crimson;
                  }

                  &.completed {
                    color: #016401;
                  }
                }

                .title-text {
                  padding: 0 5px;
                }

              }

              &:hover {
                background-color: rgb(0, 0, 0, .2);
              }
            }
          }
        }
      }
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
}
</style>
