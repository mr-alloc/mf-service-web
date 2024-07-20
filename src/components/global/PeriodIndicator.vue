<template>
  <div class="period-indicator-container">
    <div class="period-range">
      <div class="period" v-if="props.start && props.start > 0">
        <span class="period-text">{{ TemporalUtil.toMoment(props.start, true).format("YY년 MM월 DD일") }}</span>
      </div>
      <div class="period" v-if="props.end && props.end > 0">
        <span class="period-text">{{ TemporalUtil.toMoment(props.end, true).format("YY년 MM월 DD일") }}</span>
      </div>
    </div>
    <div class="total-days-count" v-if="props.start || props.end">
      <span class="count-text">{{
          `${props.end === 0 ? 1 : (((props.end ?? 0) - (props.start ?? 0)) / TemporalUtil.SECONDS_IN_DAY) + 1}일`
        }}</span>
    </div>
  </div>
</template>
<script setup lang="ts">
import {reactive} from "vue";
import TemporalUtil from "../../utils/TemporalUtil";

const props = defineProps({
  start: Number,
  end: Number,
});
const state = reactive({
  totalDays: 0,
});
</script>
<style scoped lang="scss">
@import "@assets/main";

.period-indicator-container {
  user-select: none;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: row;

  .period-range {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;

    .period {
      display: flex;
      justify-content: center;
      align-items: center;
      flex-direction: row;
      width: 120px;


      .period-text {
        font-size: .84rem;
        font-weight: bold;
        color: black;
      }
    }
  }

  .total-days-count {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: row;

    .count-text {
      font-size: 1.5rem;
      font-weight: bold;
      color: black;
    }
  }
}
</style>
