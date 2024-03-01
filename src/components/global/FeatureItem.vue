<template>
  <li class="item-wrapper" v-on:click="methods.executeClickProxy()">
    <div class="menu-icon">
      <FontAwesomeIcon :icon="props.icon" class="fa-2x"/>
    </div>
    <div class="menu-name">
      <span>미션 생성</span>
    </div>
  </li>
</template>
<script setup lang="ts">
import {FontAwesomeIcon} from "@fortawesome/vue-fontawesome";

const props = defineProps({
  icon: Array<string>,
  clickBehavior: Function,
})
const methods = {
  executeClickProxy() {
    props.clickBehavior && props.clickBehavior();
  }
}
</script>
<style scoped lang="scss">
@import '@/assets/main.scss';

.item-wrapper {
  width: 100%;
  height: 40px;
  display: flex;
  flex-direction: row;
  border-radius: 10px;
  transition: .2s;

  &:hover {
    cursor: pointer;
    scale: 1.1;
    box-shadow: $standard-box-shadow;

    .menu-icon {
      color: $signature-purple;
    }
  }

  .menu-icon {
    width: 40px;
    flex-shrink: 0;
    display: flex;
    justify-content: center;
    align-items: center;
    transition: .2s;
    color: $standard-weight-gray-in-white;
  }

  .menu-name {
    flex-grow: 1;
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 3px 5px;
    color: $standard-clean-black;
    font-size: .82rem;
    user-select: none;
  }
}
</style>
