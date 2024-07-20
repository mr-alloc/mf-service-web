<script setup lang="ts">

import {reactive, ref} from "vue";

const textarea = ref<HTMLTextAreaElement | null>(null);
const props = defineProps({
  label: String,
  id: String,
  name: String,
  placeHolder: String,
  isHold: Boolean,
  defaultValue: String,
  onInput: Function
});

const state = reactive({
  value: props.defaultValue ?? ""
});
defineExpose({
  getValue: () => state.value,
  getInput: () => textarea.value
});
</script>

<template>
  <div class="blink-textarea-container">
    <label v-if="props.label" :for="props.id">{{ props.label }}</label>
    <div class="text-area-wrapper">
      <textarea class="blink-input" ref="textarea" :id="props.id" :name="props.name" :placeholder="props.placeHolder"
                v-on:input="props.onInput" v-model="state.value"
                :class="{ hold: props.isHold }"></textarea>
    </div>
  </div>
</template>
<style scoped lang="scss">
@import "@assets/main";

.blink-textarea-container {
  padding: 5px 8px;
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;

  .text-area-wrapper {

    textarea {
      width: 100%;
      padding: 5px 8px;
      border: 1px solid #ccc;
      outline: none !important;
      border-radius: 4px;
      font-size: .92rem;
      resize: vertical;
      background-color: white;
    }
  }
}
</style>
