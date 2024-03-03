<template>
  <div class="simple-radio-container">
    <label v-show="props.label">{{ props.label }}</label>
    <div class="radio-selector">
      <input type="hidden" :name="props.name" value="1" v-model="state.value"/>
      <ul class="button-group">
        <li class="radio-button" :key="index" v-for="(option, index) in props.options"
            :class="{ selected: option.value === state.value }" v-on:click="methods.selectValue(option.value)">
          {{ option.text }}
        </li>
        <li class="radio-button" v-show="props.etcOption" :class="{ selected: state.etcSelected }"
            v-on:click="methods.selectValue(props.etcOption?.value ?? '0')">{{ props.etcOption?.text }}
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
  name: String,
  options: Array<SelectOption>,
  label: String,
  etcOption: SelectOption,
  etcValueFunction: Function,
  etcPlaceholder: String,
})

const methods = {
  selectValue(value: string) {
    if (props.etcOption?.value === value) {
      state.etcSelected = !state.etcSelected;
      if (state.etcSelected) {
        state.value = props.etcValueFunction && props.etcValueFunction(state.etcValue);
      }
      return;
    }

    if (state.value == value) {
      state.value = '';
      state.etcSelected = false;
      return;
    }
    state.value = value;
    state.etcSelected = false;
  },
  selectEtcValue() {
    state.value = props.etcValueFunction && props.etcValueFunction(state.value);
  }
}
</script>
<style scoped lang="scss">
@import "@/assets/main.scss";

.simple-radio-container {
  padding: 0 20px;
  margin: 20px auto;

  .radio-selector {

    .button-group {
      list-style: none;
      padding: 0;
      display: flex;
      align-items: flex-start;

      .radio-button {
        padding: 3px 5px;
        border-radius: 5px;
        margin: 3px 5px 3px 0;
        border: 1px $standard-gray-in-white solid;
        display: inline-block;
        transition: .2s;
        cursor: pointer;

        &:hover {
          background-color: rgb(0, 0, 0, .3);
        }

        &.selected {
          background-color: rgb(0, 0, 0, .3);
          transform: scale(.9);
        }
      }
    }

    .etc-input-area {
      border-bottom: 1px $signature-purple solid;
      width: 100px;

      input {

        background-color: $standard-light-gray-in-white;
      }
    }
  }
}

</style>
