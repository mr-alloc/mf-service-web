<script setup lang="ts">

const props = defineProps({
  label: String,
  id: String,
  name: String,
  placeHolder: String,
  isHold: Boolean
});
</script>

<template>
  <div class="blink-textarea-container">
    <label :for="props.id">{{ props.label }}</label>
    <div class="text-area-wrapper">
      <textarea class="blink-input" :id="props.id" :name="props.name" :placeholder="props.placeHolder"
                :class="{ hold: props.isHold }"></textarea>
    </div>
  </div>
</template>

<style scoped lang="scss">
@import "@/assets/main";

.blink-textarea-container {
  padding: 0 20px;
  margin: 20px auto;
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;

  .text-area-wrapper {

    textarea {
      width: 100%;
      height: 150px;
      padding: 12px 20px;
      box-sizing: border-box;
      border: 2px solid #ccc;
      outline: none !important;
      border-radius: 4px;
      background-color: #f8f8f8;
      font-size: 16px;
      resize: none;
    }
  }
}
</style>
