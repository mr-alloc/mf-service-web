<template>
  <div class="each-day-item">
    <div class="item-header">
      <span class="date" :class="{ today: state.today.format('MMD') === state.now.format('MMD') }">
        {{ methods.getCalendarDate() }}
      </span>
    </div>
    <div class="item-body">
    </div>
  </div>
</template>
<script setup lang="ts">
import TemporalUtil from "@/utils/TemporalUtil";
import {inject, reactive} from "vue";
import moment from "moment-timezone";
import type CalendarDate from "@/classes/CalendarDate";
import {useCalendarStore} from "@/stores/CalendarStore";

const emitter: any = inject('emitter');
const calendarStore = useCalendarStore();
const props = defineProps<{
  timestamp: number,
  day: CalendarDate
}>();

const state = reactive({
  today: TemporalUtil.toMoment(props.timestamp, true),
  now: moment(),
});

const methods = {
  getCalendarDate() {
    return state.today.day() === 1
        ? state.today.format('M/D')
        : state.today.format('D');

  }
}
</script>
<style scoped lang="scss">
@import "@/assets/main";

.each-day-item {
  user-select: none;
  border: 0.5px solid $standard-light-gray-in-white;
  transition: $duration, border 0s, transform .1s, position 0s;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  flex: 1 1 0%;

  &.selected {
    background-color: $super-light-signature-purple;
  }

  &:hover {
    cursor: pointer;
  }

  .item-header {
    text-align: left;
    font-weight: bold;
    font-size: .72rem;
    user-select: none;
    height: 20px;
    flex-shrink: 0;
    display: flex;
    flex-direction: row;
    align-items: center;
    padding: 3px 5px;

    .date {
      font-weight: bold;
      padding: 0 5px;
      flex-shrink: 0;
      line-height: 1;

      &.today {
        background-color: $signature-purple;
        border-radius: 5px;
        color: white;
        padding: 2px 5px;
      }
    }
  }


  .item-body {
    flex-grow: 1;

    display: flex;
    flex-direction: column;
  }
}
</style>
