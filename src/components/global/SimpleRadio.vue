<template>
  <div class="simple-radio-container">
    <label v-show="props.label" v-if="props.label">{{ props.label }}</label>
    <div class="radio-selector">
      <input type="hidden" :id="props.id" :name="props.name"
             :value="props.options?.[props.currentIndex!]?.value ?? state.value" v-model="state.value"/>
      <ul class="option-button-group">
        <li class="radio-button" :key="index" v-for="(option, index) in props.options"
            :style="{ backgroundColor: `#${option.color}` }"
            :class="{ selected: (state.value === '' && index === props?.currentIndex) || (option.value === state.value) }"
            v-on:click="methods.selectValue(option.value, option)">
          {{ option.text }}
        </li>
        <li class="radio-button" v-if="props.etcOption" :class="{ selected: state.etcSelected }"
            v-on:click="methods.clickEtc(props.etcOption?.value ?? props.defaultEtcValue ?? '')"
            v-on:focusout="state.etcSelected && methods.selectValue(state.value)"
        >{{ props.etcOption?.text }}
        </li>
      </ul>
      <Transition name="bounce">
        <div class="etc-input-area" v-show="state.etcSelected">
          <input type="text" v-model="state.etcValue" v-on:focusout="methods.selectEtcValue()"
                 :placeholder="props.etcPlaceholder"/>
        </div>
      </Transition>
    </div>
  </div>
</template>
<script setup lang="ts">
import SelectOption from "@/classes/SelectOption";
import {reactive} from "vue";

const state = reactive({
  value: '',
  etcSelected: false,
  etcValue: ''
})

const props = defineProps({
  id: String,
  name: String,
  options: Array<SelectOption>,
  label: String,
  defaultEtcValue: String,
  etcOption: SelectOption,
  etcValueFunction: Function,
  etcPlaceholder: String,
  currentIndex: Number,
  beforeChange: Function,
  afterChange: Function
})

const methods = {
  clickEtc(etcValue: string) {
    state.etcSelected = !state.etcSelected;
    //재선택을 위한 값 할당
    if (state.etcSelected) {
      state.value = props.etcValueFunction && props.etcValueFunction(state.etcValue);
    } else {
      state.value = '';
    }
  },
  selectValue(value: string, option?: SelectOption) {
    if (option) {
      const afterChange = () => {
        if (state.value == value) {
          state.value = '';
        } else {
          state.value = value;
        }
        state.etcSelected = false;
        props.afterChange && props.afterChange(option);
      }

      if (props.beforeChange) {
        props.beforeChange(option, afterChange);
      } else {
        afterChange();
      }
    }
  },
  selectEtcValue() {
    state.value = props.etcValueFunction && props.etcValueFunction(state.etcValue);
  }
}

defineExpose({
  value: state.value
})
</script>
<style scoped lang="scss">
@import "@assets/main.scss";

.simple-radio-container {
  padding: 0;
  width: 100%;

  .radio-selector {

    .option-button-group {
      list-style: none;
      padding: 0;
      display: flex;
      justify-content: space-evenly;
      align-items: flex-start;
      width: 100%;

      .radio-button {
        padding: 3px 5px;
        border-radius: 5px;
        border: 1px $standard-gray-in-white solid;
        display: inline-block;
        transition: .2s;
        cursor: pointer;


        &:hover {
          background-color: rgb(0, 0, 0, .3);
        }

        &.selected {
          box-shadow: inset 3px 3px 8px rgb(0, 0, 0, .3);
          background-color: rgb(0, 0, 0, .3);
          transform: scale(.9);
        }
      }
    }

    .etc-input-area {
      border-bottom: 1px $signature-purple solid;
      width: 100px;
      margin: 3px 5px;

      input {

        background-color: $standard-light-gray-in-white;
      }
    }
  }
}

</style>
