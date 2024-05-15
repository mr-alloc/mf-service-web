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
              v-on:click="methods.createMission(DateUtil.to(date, 'YYYY-MM-DD'))"
              :class="{
              'this-month': DateUtil.isSameMonth(date, state.thisMonth),
              holiday: state.holidaysMap.has(DateUtil.to(date, 'MM-DD'))
              }">
            <div class="item-header">
              <span class="date" :class="{ today: DateUtil.toString(moment()) === DateUtil.toString(date)}">
                {{ date.get('date') == 1 ? date.format('M/D') : date.format('D') }}
              </span>
              <span class="mission-count"
                    v-show="state.memberCalendarMap.get(DateUtil.toString(date))?.length ?? 0 > 0">
                {{ state.memberCalendarMap.get(DateUtil.toString(date))?.length }}
              </span>
              <span class="holiday-name" v-show="state.holidaysMap.has(DateUtil.to(date, 'MM-DD'))">
                {{ state.holidaysMap.get(DateUtil.to(date, 'MM-DD'))?.name }}
              </span>
            </div>
            <div class="item-body">
              <TransitionGroup class="daily-schedules" tag="ul" name="fade">
                <li class="each-schedule"
                    v-for="(mission, index) in state.memberCalendarMap.get(DateUtil.toString(date)) ?? []"
                    :key="index" v-on:click="methods.clickSchedule($event, mission)"
                >
                  <span class="schedule-title">
                  {{
                      /*`${methods.toTimeString(mission.startDate)}*/
                      `${mission.title}`
                    }}
                  </span>
                </li>
              </TransitionGroup>
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
import {
  CalendarHoliday,
  CalendarMission,
  FamilyMission,
  type IMission,
  RequestBody,
  ResponseBody
} from "@/classes/api-spec/mission/GetMemberCalendar"
import DateUtil from "@/utils/DateUtil";
import CollectionUtil from "@/utils/CollectionUtil";
import PopupUtil from "@/utils/PopupUtil";
import {hasSelectedFamilyId} from "@/utils/LocalCache";
import TemporalUtil from "@/utils/TemporalUtil";


const emitter = inject("emitter");

const state = reactive({
  calendarTitle: '',
  thisMonth: moment(),
  calendar: [] as Array<Moment>,
  startDate: moment(),
  endDate: moment(),
  memberCalendarMap: new Map<string, Array<IMission>>(),
  holidaysMap: new Map<string, CalendarHoliday>()
})
const methods = {
  createMission(startDate?: string) {
    PopupUtil.popupCreateMission(emitter, startDate ?? DateUtil.to(moment(), 'YYYY-MM-DD'));
  },
  setMonth(month: number) {
    state.thisMonth.add(month, 'month');
    methods.drawCalendar();
  },
  drawCalendar() {
    state.calendarTitle = state.thisMonth.get('year') + "년 " + (state.thisMonth.get('month') + 1) + "월"
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


    call<RequestBody, ResponseBody>(Mission.GetMemberCalendar, new RequestBody(state.startDate, state.endDate),
        (res) => {
          const responseBody = ResponseBody.fromJson(res.data, (mission) => {
            return hasSelectedFamilyId()
                ? CalendarMission.fromJson(mission)
                : FamilyMission.fromJson(mission)
          });

          state.memberCalendarMap = CollectionUtil.groupBy<string, IMission>(
              responseBody.calendar,
              (mission) => mission.groupingDate
          );

          state.holidaysMap = CollectionUtil.toMap<string, CalendarHoliday>(
              responseBody.holidays.filter(h => !h.isLunar),
              (holiday) => holiday.date,
          )
        },
        (spec, error) => {
          console.log(error);
        });

  },
  toTimeString(time: number) {
    const schedule = moment(new Date((time + TemporalUtil.getOffsetSecond()) * 1000));
    return schedule.format('HH:mm');
  },
  clickSchedule(e: MouseEvent, mission: IMission) {
    e.stopPropagation();
    PopupUtil.popupMissionDetail(mission);
  }
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

        &.holiday {
          background-color: #f8dddd;
          color: crimson;

          .item-header {

            .holiday-name {
              font-weight: bold;
              margin-left: 5px;
            }
          }
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

          .mission-count {
            border-radius: 15px;
            color: white;
            background-color: crimson;
            font-weight: bold;
            padding: 1px 4px;
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
              text-align: left;
              flex-grow: 1;
              line-height: 1;
              overflow: hidden;
              padding: 0;

              .schedule-title {
                font-size: .74rem;
                white-space: nowrap;
                border-radius: 5px;
                cursor: pointer;
                transition: $duration;
                padding: 0 3px;

                &:hover {
                  background-color: rgb(0, 0, 0, .2);
                }
              }
            }

          }
        }

        &.this-month:hover {
          background-color: rgb(0, 0, 0, .2);
          cursor: pointer;
        }
      }
    }
  }
}
</style>
