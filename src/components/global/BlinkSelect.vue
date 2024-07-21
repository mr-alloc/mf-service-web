<template>
  <div class="blink-select-container">
    <label v-if="props.title" :for="props.id" class="select-title">{{ props.title }}</label>
    <div class="option-selector" id="select-values" :class="{ blink: state.selectMode}">
      <div class="selected-value" v-on:click="methods.clickSelector()">
        <span class="value-text">{{ state.selectOption.text }}</span>
      </div>
      <Transition name="bounce">
        <ul class="select-option-wrapper" v-show="state.selectMode">
          <li v-for="(option, index) in props.options"
              :key="option.value" class="select-option" v-on:click="methods.selectOption(index)"
              :class="{ selected: option.value === select?.value }">
            <span class="option-text">{{ option.text }}</span>
          </li>
        </ul>
      </Transition>
    </div>
    <select :id="props.id" class="select-values" ref="select" style="display: none;" :name="props.name">
      <option v-for="(option) in props.options"
              :key="option.value" :value="option.value">{{ option.text }}
      </option>
    </select>
  </div>
</template>
<script setup lang="ts">
import SelectOption from "@/classes/SelectOption";
import {onMounted, reactive, ref} from "vue";

const select = ref<HTMLSelectElement | null>(null);

const props = defineProps({
  title: String,
  options: Array<SelectOption>,
  name: String,
  id: String,
  currentIndex: Number,
  beforeChange: Function
});
const state = reactive({
  selectMode: false,
  selectOption: props.options?.[0] as SelectOption,
});

const methods = {
  clickSelector() {
    state.selectMode = !state.selectMode;
  },
  selectOption(index: number) {
    state.selectMode = false;

    const afterChange = () => {
      if (props.options?.[index].value === state.selectOption.value) return;

      Array.from(select.value?.options!).filter((opt, idx) => idx === index).forEach(opt => opt.selected = true);
      state.selectOption = props.options?.[index] as SelectOption;
    }

    if (props.beforeChange) {
      props.beforeChange(props.options?.[index], afterChange);
    } else {
      afterChange();
    }
  }
}
defineExpose({
  getValue: () => state.selectOption.value
})
onMounted(() => {
  state.selectOption = props.options?.[0] as SelectOption;
  if (props.currentIndex) {
    state.selectOption = props.options?.[props.currentIndex] as SelectOption;
    Array.from(select.value?.options!).filter((opt, idx) => idx === props.currentIndex).forEach(opt => opt.selected = true);
  }
})
</script>
<style scoped lang="scss">
@import "@assets/main.scss";

$option-height: 25px;
.blink-select-container {
  padding: 0;

  .option-selector {
    display: flex;
    flex-direction: row;
    border-radius: 10px;
    border: 1px $standard-gray-in-white solid;
    transition: all .2s ease-in-out;
    position: relative;

    &:hover {
      cursor: pointer;
      background-color: $standard-light-gray-in-white;
    }

    .selected-value {
      height: 30px;
      flex-grow: 1;
      padding: 3px 8px;
      display: flex;
      align-items: center;

      .value-text {
        width: 100%;
        user-select: none;
        text-overflow: ellipsis;
      }
    }

    .select-option-wrapper {
      width: max-content;
      flex-grow: 1;
      list-style: none;
      position: absolute;
      z-index: 1;
      top: 35px;
      padding: 0;
      color: $standard-light-gray-in-white;
      background-color: $signature-purple;
      border: 1px $light-signature-purple solid;
      overflow: hidden;
      border-radius: 10px;
      overflow-y: scroll;

      .select-option {
        padding: 0px 5px;
        transition: .2s;
        height: $option-height;


        &.selected {
          background-color: $text-signature-purple;
        }

        &:hover {
          background-color: $text-signature-purple;
        }
      }
    }


    &.blink {

    }
  }


}
</style>
