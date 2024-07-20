<template>
  <div class="tappable-view-container">
    <ul class="tap-item-group">
      <li class="item-navigator" :class="{ select: state.current === index }"
          v-for="(component, index) in props.components as TabViewComponent []" :key="index"
          v-on:click="state.current = index">
        <span class="navigate-button">{{ component.name }}</span>
        <span class="alert-count" v-if="component.alertCount > 0">{{ component.alertCount }}</span>
      </li>
    </ul>
    <div class="view-area">
      <Transition name="fade">
        <Component v-bind:is="props.components?.[state.current]?.component"/>
      </Transition>
    </div>
  </div>
</template>
<script setup lang="ts">

import {reactive} from "vue";
import {TabViewComponent} from "@/classes/TabViewComponent";

const props = defineProps({
  components: Array<TabViewComponent>
});
const state = reactive({
  current: 0
});
</script>
<style scoped lang="scss">
@import "@assets/main";

.tappable-view-container {
  margin: 1.5rem 0;

  .tap-item-group {
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
    margin: 1.5rem 0;

    .item-navigator {
      transition: $duration;
      background-color: $standard-light-gray-in-white;
      padding: 8px 16px;
      position: relative;
      margin: 0 .21rem;
      border-radius: 10px;

      .navigate-button {
        padding: 3px 5px;
        transition: $duration;
        user-select: none;
      }

      .alert-count {
        z-index: 1;
        position: absolute;
        right: -7px;
        top: -7px;
        font-size: .8rem;
        font-weight: bold;
        background-color: $signature-purple;
        color: white;
        padding: 0 7px;
        border-radius: 30px;
      }

      &:hover:not(.select) {
        background-color: $standard-gray-in-white;
        cursor: pointer;

        .navigate-button {
        }

      }

      &.select {

        .navigate-button {
          color: $signature-purple;
          border-bottom: 2px solid $signature-purple;
        }
      }
    }
  }
}
</style>
