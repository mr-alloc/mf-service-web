<template>
  <div class="blink-select-container">
    <label :for="props.id" class="select-title">{{ props.title }}</label>
    <div class="option-selector" id="select-values" :class="{ blink: state.selectMode}">
      <div class="selected-value" v-on:click="methods.clickSelector()">
        <span class="value-text">{{ select?.options[select?.selectedIndex].innerText }}</span>
      </div>
      <Transition name="bounce">
        <ul class="select-option-wrapper" v-show="state.selectMode">
          <li v-for="option in props.options"
              :key="option.value" class="select-option" v-on:click="methods.selectValue(option.value)"
              :class="{ selected: option.value === select?.value }">
            <span class="option-text">{{ option.text }}</span>
          </li>
        </ul>
      </Transition>
    </div>
    <select :id="props.id" class="select-values" ref="select" style="display: none;" :name="props.name">
      <option v-for="option in props.options" :key="option.value" :value="option.value">{{ option.text }}</option>
    </select>
  </div>
</template>
<script setup lang="ts">
import SelectOption from "@/classes/SelectOption";
import {reactive, ref} from "vue";

const select = ref<HTMLSelectElement | null>(null);
const state = reactive({
  selectMode: false,
})

const props = defineProps({
  title: String,
  options: Array<SelectOption>,
  name: String,
  id: String
})

const methods = {
  clickSelector() {
    state.selectMode = !state.selectMode;
  },
  selectValue(value: string) {
    const selectElement: HTMLSelectElement = select.value!;
    selectElement.value = value;
    state.selectMode = false;
  }
}
</script>
<style scoped lang="scss">
@import "@/assets/main.scss";

$option-height: 25px;
.blink-select-container {
  width: 100%;
  margin: 20px 0;
  padding: 0 20px;

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
