<template>
  <div class="calendar-week-container">
    <div class="background-area">
      <CalendarDay v-for="day in props.days" :key="day.timestamp" :day="day" :timestamp="day.timestamp"/>
    </div>

    <UseElementSize ref="scheduleArea" class="schedule-area" v-slot="{ width }">
      <div v-for="(geometry, index) in props.geometries"
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
    </UseElementSize>
  </div>
</template>
<script setup lang="ts">
import CalendarDay from "@/components/main/CalendarDay.vue";
import CalendarDate from "@/classes/CalendarDate";
import {ref} from "vue";
import {WeekScheduleGeometry} from "@/classes/WeekScheduleGeometry";
import {UseElementSize} from "@vueuse/components";

const scheduleArea = ref<HTMLDivElement | null>(null);
const props = defineProps<{
  days: Array<CalendarDate>,
  week: number,
  geometries: Array<WeekScheduleGeometry>
}>();
</script>
<style scoped lang="scss">
@import "@/assets/main";

.calendar-week-container {
  position: relative;
  overflow: hidden;
  border-bottom: rgb(241, 243, 244) 1px solid;
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
    //pointer-events: none;
    z-index: 3;
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    height: calc(100% - 20px);
    margin-top: 20px;

    .schedule-item {
      position: absolute;
      display: inline-block;
      padding: 2px 5px;
      text-wrap: nowrap;

      .schedule-item-title {
        background-color: $soft-dark;
        color: white;
        line-height: 1;
        border-radius: 3px;
        padding: 2px 5px;
        font-size: .84rem;
      }
    }
  }
}
</style>
