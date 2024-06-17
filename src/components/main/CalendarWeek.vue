<template>
  <div class="calendar-week-container">
    <div class="background-area">
      <CalendarDay v-for="day in props.days" :key="day.timestamp" :day="day" :timestamp="day.timestamp"/>
    </div>
    <UseElementSize ref="scheduleArea" class="schedule-area" v-slot="{ width }">
      <div class="which-day-position">
        <div class="day-position" v-for="day in props.days" :key="day.timestamp"
             v-on:click="() => calendarStore.selectDate(day)"
             :class="{ selected: calendarStore.timestamp === day.timestamp }">
          <span class="specify-day-description"></span>
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
          <div class="schedule-item-title">
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
import {ref} from "vue";
import {WeekScheduleGeometry} from "@/classes/WeekScheduleGeometry";
import {UseElementSize} from "@vueuse/components";
import {useCalendarStore} from "@/stores/CalendarStore";
import PopupUtil from "@/utils/PopupUtil";

const calendarStore = useCalendarStore();
const scheduleArea = ref<HTMLDivElement | null>(null);
const props = defineProps<{
  days: Array<CalendarDate>,
  week: number,
  geometries: Array<WeekScheduleGeometry>
}>();
const methods = {
  clickSchedule(geometry: WeekScheduleGeometry, event: MouseEvent) {
    event.stopPropagation();
    const mission = geometry.mission.mission;
    PopupUtil.popupMissionDetail(mission);

  }
}
</script>
<style scoped lang="scss">
@import "@/assets/main";

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
        flex: 1 1 0%;

        &.selected {
          background-color: #c185e54f;
        }

        .specify-day-description {
          padding-left: 30px;
          width: 100%;
          height: 20px;
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
      }
    }
  }
}
</style>
