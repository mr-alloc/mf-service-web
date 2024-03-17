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
          <li class="each-day-item" v-for="(date, index) in state.calendar" :key="index">
            <div class="item-header">
              {{ date.get('date') == 1 ? date.format('M월 D일') : date.format('D일') }}
            </div>
            <div class="item-body">
              <ul class="daily-schedules">
                <li class="each-schedule">
                  <span>심심한 일정</span>
                </li>
              </ul>
              <div class="more-button">
                <span>+9</span>
              </div>
            </div>
          </li>
        </ul>
      </Transition>
    </div>
  </div>
</template>

<script setup lang="ts">
import {onMounted, reactive} from "vue";
import moment, {type Moment} from "moment";
import {FontAwesomeIcon} from "@fortawesome/vue-fontawesome";

const state = reactive({
  calendarTitle: '',
  thisMonth: new Date(),
  calendar: [] as Array<Moment>,
  startDate: moment(),
  endDate: moment()
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
  }
}
onMounted(() => {
  methods.drawCalendar()
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
      display: flex;
      flex-direction: row;
      flex-wrap: wrap;
      flex-grow: 1;

      .each-day-item {
        border-right: 1px solid $standard-light-gray-in-white;
        border-bottom: 1px solid $standard-light-gray-in-white;
        transition: $duration;
        cursor: pointer;
        display: flex;
        flex-direction: column;


        .item-header {
          text-align: left;
          font-weight: bold;
          font-size: .64rem;
          user-select: none;
          height: 15px;
          flex-shrink: 0;
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
              width: 100%;
              border-radius: 5px;
              margin: 3px 0;
              text-align: left;
              padding: 0 3px;
              flex-grow: 1;
              font-size: .74rem;
              transition: $duration;

              &:hover {
                background-color: rgb(0, 0, 0, .2);
              }
            }

          }


          .more-button {
            font-size: .64rem;
            display: flex;
            flex-direction: row;
            justify-content: flex-end;
            height: 15px;
            flex-shrink: 0;
            padding: 0 3px;
            transition: $duration;
            border-radius: 5px;

            span {
              font-weight: bold;
            }


            &:hover {
              background-color: rgb(0, 0, 0, .2);
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
