<template>
  <div class="calendar-week-container">
    <div class="background-area">
      <CalendarDay v-for="day in props.days" :key="day.timestamp" :timestamp="day.timestamp"/>
    </div>
    <div class="schedule-area"></div>
  </div>
</template>
<script setup lang="ts">
import CalendarDay from "@/components/main/CalendarDay.vue";
import CalendarDate from "@/classes/CalendarDate";

const props = defineProps<{
  days: Array<CalendarDate>
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
    pointer-events: none;
    z-index: 3;
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
  }
}
</style>
