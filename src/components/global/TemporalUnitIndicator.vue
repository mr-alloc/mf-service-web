<template>
  <div class="temporal-unit-container">
    <ul class="temporal-value-group">
      <li class="value-item" v-for="(value, index) in state.unitValues" :key="index">
        {{ value }}
      </li>
    </ul>
    <div class="temporal-unit">
      <span class="unit-text">{{ props.unitText }}</span>
    </div>
  </div>
</template>
<script setup lang="ts">
import type TemporalUnit from "@/constant/TemporalUnit";
import {onMounted, reactive} from "vue";

const props = defineProps<{
  unit: TemporalUnit,
  unitText: string
}>();

const state = reactive({
  unitValues: [] as Array<string>,
  defaultValues: ['0', '0']
});

const methods = {
  calculateUnitValues(value: number) {
    const extracted = props.unit.extractHigherUnit(value);
    const currentUnitValue = Math.floor((value - extracted) / props.unit.seconds);
    state.unitValues = [...`${currentUnitValue}`.padStart(2, '0')];
  }
}

defineExpose({
  calculate: methods.calculateUnitValues
});

onMounted(() => {
  const result = Math.round(0 / props.unit.seconds);
  state.unitValues = result === 0 ? state.defaultValues : [...`${result}`];
});
</script>
<style scoped lang="scss">
@import "@assets/main";

.temporal-unit-container {
  display: flex;
  align-items: center;
  justify-content: center;

  .temporal-value-group {
    display: flex;
    align-items: center;
    justify-content: center;

    .value-item {
      background-color: #353535;
      font-size: 1rem;
      font-weight: bold;
      border-radius: 5px;
      color: #ff7e98;
      padding: 3px 5px;
      line-height: 1;
      margin: 1px;
    }
  }

  .temporal-unit {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0 2px;

    .unit-text {
      font-size: .9rem;
      font-weight: bold;
    }
  }
}
</style>
