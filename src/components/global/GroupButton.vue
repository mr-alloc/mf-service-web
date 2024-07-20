<template>
  <div class="group-button-container">
    <ul class="option-button-group">
      <li class="option-item-wrapper"
          :class="{ selected: state.selected.has(option.value) }"
          v-on:click="methods.selectOption(option)"
          v-for="option in props.options" :key="option.value">
        <span class="option-item">{{ option.text }}</span>
      </li>
    </ul>
  </div>
</template>
<script setup lang="ts">
import SelectOption from "@/classes/SelectOption";
import {reactive} from "vue";

const props = defineProps<{
  options: Array<SelectOption>,
  defaultSelected?: String,
  afterChange: (options: Set<string>) => void,
  isMultiSelect?: boolean
}>();

const state = reactive({
  selected: new Set<string>()
});

const methods = {
  selectOption(option: SelectOption) {
    if (props.isMultiSelect) {
      if (state.selected.has(option.value)) {
        state.selected.delete(option.value);
      } else {
        state.selected.add(option.value);
      }
    } else {
      if (state.selected.has(option.value)) {
        state.selected = new Set<string>();
      } else {
        state.selected = new Set<string>([option.value]);
      }
    }
    props.afterChange(state.selected);
  },
  resetValues() {
    state.selected = new Set<string>();
  }
}

defineExpose({
  resetValues: () => methods.resetValues
});
</script>
<style scoped lang="scss">
@import "@assets/main";

.group-button-container {
  display: flex;
  justify-content: center;
  width: 100%;
  padding: 5px 0;

  .option-button-group {
    width: 100%;
    display: flex;
    flex-direction: row;

    .option-item-wrapper {
      flex: 1 1 30%;
      transition: $duration;
      border-top: 1px solid $standard-gray-in-white;
      border-bottom: 1px solid $standard-gray-in-white;
      border-left: 0.5px solid $standard-gray-in-white;
      border-right: 0.5px solid $standard-gray-in-white;
      display: flex;
      justify-content: center;
      align-items: center;

      &.selected {
        box-shadow: inset 3px 3px 8px rgb(0, 0, 0, .3);
        background-color: rgb(0, 0, 0, .3);

        .option-item {
          transform: scale(.9);
        }
      }

      &:first-child {
        border-top-left-radius: 10px;
        border-bottom-left-radius: 10px;
        border-left: 1px solid $standard-gray-in-white;
      }

      &:last-child {
        border-top-right-radius: 10px;
        border-bottom-right-radius: 10px;
        border-right: 1px solid $standard-gray-in-white;
      }

      &:hover {
        cursor: pointer;
      }
    }

  }
}
</style>
