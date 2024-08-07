<template>
  <div class="calendar-week-container">
    <div class="background-area">
      <CalendarDay v-for="day in props.days" :key="day.timestamp" :day="day" :timestamp="day.timestamp" :holidays="holidays"/>
    </div>
    <UseElementSize ref="scheduleArea" class="schedule-area" v-slot="{ width }">
      <div class="which-day-position">
        <div class="day-position" v-for="day in props.days" :key="day.timestamp"
             v-on:click="() => calendarStore.selectDate(day)"
             :class="{
               selected: calendarStore.timestamp === day.timestamp,
               holiday: holidays.has(day.value.format('MM-DD'))
             }">
          <span class="specify-day-description">{{ ex(holidays.get(day.value.format('MM-DD'))?.name).str() }}</span>
        </div>
      </div>
      <TransitionGroup name="fade">
        <div v-for="(geometry, index) in props.geometries" v-show="geometry"
             v-on:click="($event) => methods.clickSchedule(geometry, $event)"
             :key="index" class="schedule-item"
             :style="{
               left: geometry.x * (width / 7) +'px',
               top: ((geometry.y * 20) - 20) +'px',
               width: ((width / 7) * geometry.width)+'px'
             }">
          <div class="schedule-item-title" :class="MissionType.fromValue(geometry.mission.mission.type).simpleName">
            <span class="title-text">{{ geometry.mission.mission.name }}</span>
          </div>
        </div>
      </TransitionGroup>
    </UseElementSize>
  </div>
</template>
<script setup lang="ts">
import CalendarDay from "@/components/main/CalendarDay.vue";
import CalendarDate from "@/classes/CalendarDate";
import {inject, ref} from "vue";
import {WeekScheduleGeometry} from "@/classes/WeekScheduleGeometry";
import {UseElementSize} from "@vueuse/components";
import {useCalendarStore} from "@/stores/CalendarStore";
import type CalendarAnniversary from "@/classes/CalendarAnniversary";
import MissionType from '@/constant/MissionType'
import type { CalendarHoliday } from '@/classes/api-spec/mission/GetMemberCalendar'
import { ex } from '../../utils/Undefinable'

const emitter: any = inject('emitter');
const calendarStore = useCalendarStore();
const scheduleArea = ref<HTMLDivElement | null>(null);
const props = defineProps<{
  days: Array<CalendarDate>,
  week: number,
  geometries: Array<WeekScheduleGeometry>
  holidays: Map<string, CalendarHoliday>
}>();
const methods = {
  clickSchedule(geometry: WeekScheduleGeometry, event: MouseEvent) {
    event.stopPropagation();
    const mission = geometry.mission;

    emitter.emit('openMissionDetail', mission)

  },
  getAnniversaryName(timestamp: number) {
    const anniversaries = calendarStore.anniversaryMap.get(timestamp) as CalendarAnniversary [] ?? [];
    return anniversaries.map(anniversary => anniversary.name).join(' · ');
  }
}

</script>
<style scoped lang="scss">
@import "@assets/main";

.calendar-week-container {
  position: relative;
  overflow: hidden;
  display: flex;
  flex: 1 1 0%;
  -webkit-box-flex: 1;

  .background-area {
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    display: flex;
  }

  .schedule-area {
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    height: calc(100% - 20px);
    margin-top: 20px;

    .which-day-position {
      position: absolute;
      top: -20px;
      left: 0;
      bottom: 0;
      right: 0;
      display: flex;

      .day-position {
        user-select: none;
        border: 0.5px solid $standard-light-gray-in-white;
        transition: $duration, border 0s, transform .1s, position 0s;
        display: flex;
        flex-direction: column;
        overflow: hidden;
        flex: 1 1 0;

        &.selected {
          background-color: #c185e54f;
        }

        .specify-day-description {
          text-wrap: nowrap;
          overflow: hidden;
          padding-left: 30px;
          width: 100%;
          height: 20px;
          font-size: .72rem;
          font-weight: bold;
          color: black;
        }


        &.holiday .specify-day-description {
          color: $soft-red;
        }
      }
    }

    .schedule-item {
      position: absolute;
      display: inline-block;
      padding: 2px 5px;
      text-wrap: nowrap;

      &:hover {
        cursor: pointer;

        .schedule-item-title {
          background-color: #4c4c4c;
        }
      }

      .schedule-item-title {
        background-color: $soft-dark;
        color: white;
        line-height: 1;
        border-radius: 3px;
        padding: 2px 5px;
        font-size: .84rem;

        .title-text {
          user-select: none;
        }

        &.schedule {
          background-color: #0a900a;
        }

        &.mission {
          background-color: #113caa;
        }
      }
    }
  }
}
</style>
