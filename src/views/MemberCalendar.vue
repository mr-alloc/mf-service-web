<template>
  <div class="calendar-container" v-show="state.thisMonth">
    <div class="calendar-title">
      <span class="title-text">{{ state.calendarTitle }}</span>
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
      <Transition name="fade">
        <ul class="calendar-row member-calendar" v-show="state.calendar">
          <li class="each-day-item" v-for="(date, index) in state.calendar" :key="index"
              :class="{ 'this-month': date.get('month') === state.thisMonth.getMonth()}">
            <div class="item-header">
              <span class="date">{{ date.get('date') == 1 ? date.format('M/D') : date.format('D') }}</span>
              <span class="mission-count"
                    v-show="state.memberCalendarMap.get(date.format('YYYY-MM-DD'))?.length ?? 0 > 0">
                {{ state.memberCalendarMap.get(date.format('YYYY-MM-DD'))?.length }}
              </span>
            </div>
            <div class="item-body">
              <ul class="daily-schedules">
                <li class="each-schedule"
                    v-for="(mission, index) in state.memberCalendarMap.get(date.format('YYYY-MM-DD')) ?? []"
                    :key="index"
                >
                  <span class="schedule-title">
                  {{ `${methods.toTimeString(mission.deadLine)} ${mission.missionName}` }}
                  </span>
                </li>
              </ul>
            </div>
          </li>
        </ul>
      </Transition>
    </div>
  </div>
</template>

<script setup lang="ts">
import {inject, onMounted, reactive} from "vue";
import moment, {type Moment} from "moment-timezone";
import {FontAwesomeIcon} from "@fortawesome/vue-fontawesome";
import {call} from "@/utils/NetworkUtil";
import Mission from "@/constant/api-meta/Mission";

const emitter = inject("emitter");

type CalendarItem = {
  deadLine: number,
  missionId: number,
  missionName: string,
}

const state = reactive({
  calendarTitle: '',
  thisMonth: new Date(),
  calendar: [] as Array<Moment>,
  startDate: moment(),
  endDate: moment(),
  memberCalendarMap: new Map<string, Array<CalendarItem>>()
})
const methods = {
  setMonth(month: number) {
    state.thisMonth.setMonth(state.thisMonth.getMonth() + month);
    methods.drawCalendar();
  },
  drawCalendar() {
    state.calendarTitle = state.thisMonth.getFullYear() + "년 " + (state.thisMonth.getMonth() + 1) + "월"
    const startOfThisMonth = moment(state.thisMonth).startOf('month');
    const startOfCalendar = startOfThisMonth.subtract(startOfThisMonth.day(), 'days');
    state.startDate = startOfCalendar.clone();
    // print start of this month's day and days

    const endOfThisMonth = moment(state.thisMonth).endOf('month');
    const endOfCalendar = endOfThisMonth.add(7 - endOfThisMonth.day(), 'days');
    state.endDate = endOfCalendar.clone();
    let interval = 0;
    state.calendar = [];
    while (interval < endOfCalendar.diff(startOfCalendar, 'days')) {
      const cloned = startOfCalendar.clone();
      const date = cloned.add(interval, 'days');
      state.calendar.push(date);
      interval++;
    }

    call(Mission.GetMemberCalendar, {
          startDate: state.startDate.format('YYYY-MM-DD'),
          endDate: state.endDate.format('YYYY-MM-DD')
        },
        (res) => {
          const {memberCalendar} = res.data;
          state.memberCalendarMap = new Map<string, Array<CalendarItem>>();

          memberCalendar.forEach((mission: CalendarItem) => {
            const date = moment(new Date(mission.deadLine * 1000)).tz('Asia/Seoul').format('YYYY-MM-DD')
            if (state.memberCalendarMap.has(date)) {
              state.memberCalendarMap.get(date)?.push(mission);
            } else {
              state.memberCalendarMap.set(date, [mission]);
            }
          })
        },
        (spec, error) => {
          console.log(error);
        });

  },
  toTimeString(time: number) {
    return moment(new Date(time * 1000)).tz('Asia/Seoul').format('HH:mm');
  }
}
onMounted(() => {
  methods.drawCalendar();

  emitter.on("drawMemberCalendar", () => {
    methods.drawCalendar();
  });
})
</script>

<style lang="scss">
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
      height: 30px;
      flex-shrink: 0;

      li {
        font-weight: bold;
      }

      li:nth-child(1) {
        background-color: #f8dddd;
      }

      li:nth-child(7) {
        background-color: #d1dbee;
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

      .each-day-item {
        border-right: 1px solid $standard-light-gray-in-white;
        border-bottom: 1px solid $standard-light-gray-in-white;
        transition: $duration;
        display: flex;
        flex-direction: column;
        background-color: rgb(0, 0, 0, .2);
        overflow: hidden;

        &.this-month {
          background-color: white;
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
          }

          .mission-count {
            border-radius: 15px;
            color: white;
            background-color: crimson;
            font-weight: bold;
            padding: 0 3px;
            margin: 0 5px;
          }
        }

        .item-body {
          flex-grow: 1;

          display: flex;
          flex-direction: column;

          .daily-schedules {
            list-style: none;
            padding: 0;
            flex-grow: 1;

            .each-schedule {
              border-radius: 5px;
              text-align: left;
              padding: 0 3px;
              flex-grow: 1;
              transition: $duration;
              cursor: pointer;
              overflow: hidden;
              line-height: 1;

              .schedule-title {
                font-size: .74rem;
                white-space: nowrap;

              }
              &:hover {
                background-color: rgb(0, 0, 0, .2);
                position: absolute;
              }
            }

          }
        }

        &:hover {
          //background-color: rgb(0, 0, 0, .2)
        }
      }
    }
  }
}
</style>
