<script setup lang="ts">

import {FontAwesomeIcon} from "@fortawesome/vue-fontawesome";
import {inject} from "vue";
import type {DefaultButtonValue} from "@/classes/DefaultButtonValue";

const emitter = inject("emitter");
const props = defineProps({
  buttons: Array<DefaultButtonValue>
});
</script>

<template>
  <ul class="option-button-group">
    <li class="option-item-wrapper"
        v-for="(button, index) in props.buttons" :key="index" v-on:click="button.clickBehavior">
      <div class="option-item">
        <div class="option-icon">
          <FontAwesomeIcon :icon="button.icon" size="xl"/>
        </div>
        <div class="option-title">
          <span>{{ button.title }}</span>
        </div>
      </div>
    </li>
  </ul>
</template>

<style scoped lang="scss">
@import "@/assets/main";

.option-button-group {
  width: max-content;
  display: flex;
  margin: 15px 0;
  list-style: none;
  padding: 0 20px;

  .option-item-wrapper {
    width: 60px;
    height: 60px;
    border: 1px solid $signature-purple;
    border-radius: 50%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    margin: 10px;
    transition: $duration;

    &:hover {
      background-color: $signature-purple;
      cursor: pointer;

      .option-item {
        transform: scale(.9);

        .option-icon {
          color: white;
        }

        .option-title {
          color: white;
        }
      }

    }

    .option-item {
      transition: $duration;


      .option-icon {
        height: 30px;
        display: flex;
        align-items: center;
        justify-content: center;
        color: $signature-purple

      }

      .option-title {
        text-align: center;
        font-size: .64rem;
        font-weight: bold;
        color: $signature-purple;
        user-select: none;
      }
    }
  }
}
</style>
