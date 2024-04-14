<script setup lang="ts">
import {FontAwesomeIcon} from "@fortawesome/vue-fontawesome";
import {useRouter} from "vue-router";
import {useLeftMenuStore} from "@/stores/LeftMenuStore";

const leftMenuStore = useLeftMenuStore();
const props = defineProps({
  title: String,
  icon: Array<String>,
  allocatedPath: String,
  clickBehavior: Function,
  isCurrentMenu: Boolean,
  rotate: Number
});

const router = useRouter();
const methods = {
  clickBehavior() {
    if (props.allocatedPath) {
      router.push(props.allocatedPath);
      return;
    }

    if (props.clickBehavior) {
      props.clickBehavior();
      return;
    }

  }
}
</script>

<template>
  <div class="collapsible-menu" :class="{ collapse: leftMenuStore.state.isCollapsed, active: props.isCurrentMenu }"
       v-on:click="methods.clickBehavior()">
    <div class="icon-wrapper">
      <FontAwesomeIcon class="fa-xl" :rotation="props.rotate" :icon="props.icon"/>
    </div>
    <Transition name="fade">
      <div class="title-wrapper" v-show="!leftMenuStore.state.isCollapsed">
        <span class="menu-title">{{ props.title }} </span>
      </div>
    </Transition>
  </div>
</template>
<style scoped lang="scss">
@import '@/assets/main.scss';

.collapsible-menu {
  position: relative;
  display: flex;
  flex-direction: row;
  align-items: center;
  cursor: pointer;
  transition: $duration;
  border-radius: 5px;
  color: $standard-gray-in-white;
  margin: 5px 0;

  &:hover {

    .icon-wrapper {
      border-color: $signature-purple;
      background-color: $signature-purple;
      color: white;
    }

    .title-wrapper {
      color: $signature-purple;
    }
  }

  .icon-wrapper {
    flex-shrink: 0;
    width: 35px;
    height: 35px;
    border-radius: 10px;
    border: 1px solid $standard-gray-in-white;
    display: flex;
    justify-content: center;
    align-items: center;
    transition: $duration;
  }

  .title-wrapper {
    position: absolute;
    left: 35px;
    transition: $duration;
    flex-grow: 1;
    font-size: 1.2rem;
    width: 170px;

    .menu-title {
      display: block;
      text-align: center;
      user-select: none;
    }
  }


  &.collapse {

    .title-wrapper {
    }
  }

  &.active {

    .icon-wrapper {
      border-color: $signature-purple;
      background-color: $signature-purple;
      color: white;
    }

    .title-wrapper {
      color: $signature-purple;
    }
  }
}

@keyframes collapse-in {
  0% {
    width: 100%;
  }

  100% {
    max-width: 0;
  }
}
</style>
