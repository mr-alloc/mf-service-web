<template>
  <div class="modifiable-title-container">
    <input class="blink-input" ref="input" type="text"
           :value="state.value ?? props.title" v-on:focusout="methods.focusOut" :disabled="state.isHold"/>
  </div>
</template>
<script setup lang="ts">
import {reactive, ref} from "vue";

const input = ref<HTMLInputElement | null>(null);
const props = defineProps({
  id: String,
  title: String,
  beforeChange: Function
});
const state = reactive({
  value: props.title,
  isHold: false
});
const methods = {
  focusOut(event: FocusEvent) {
    state.value = input.value?.value;
    if (props.beforeChange && state.value !== props.title) {
      state.isHold = true;
      const modifiedValue = state.value;
      props.beforeChange(state.value, (isRollback: boolean) => {
        if (isRollback) {
          state.value = props.title;
          state.isHold = false;
          return;
        }
        state.value = modifiedValue;
        state.isHold = false;
      });
    }
  }
}
</script>
<style scoped lang="scss">
@import "@/assets/main";

.modifiable-title-container {
  display: flex;
  align-items: center;
  width: 100%;

  input {
    font-size: 1.5rem;
    font-weight: bold;
    border: none;
    background-color: transparent;
    color: black;

    &:hover {
      cursor: default;
    }

    &:focus {
      cursor: text;
    }
  }
}
</style>
