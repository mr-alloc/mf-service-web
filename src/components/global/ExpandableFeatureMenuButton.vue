<template>
  <div class="expandable-feature-menu-button">
    <button class="feature-button" :class="{ select: state.isShow }" v-on:click="methods.showFeatures">
      <FontAwesomeIcon :icon="props.icon"/>
    </button>
    <Transition name="down-fade">
      <ul v-show="state.isShow" class="expandable-features">
        <li class="feature-item" v-for="(feature, index) in props.executableFeatures"
            :key="index" v-on:click="(event) => methods.clickFeature(feature, event)">{{ feature.name }}
        </li>
      </ul>
    </Transition>
  </div>
</template>
<script setup lang="ts">
import {FontAwesomeIcon} from "@fortawesome/vue-fontawesome";
import {reactive} from "vue";
import ExecutableFeature from "@/classes/api-spec/ExecutableFeature";

const props = defineProps({
  clickBehavior: Function,
  executableFeatures: Array<ExecutableFeature>,
  icon: Array<string>
});
const state = reactive({
  isShow: false
});
const methods = {
  showFeatures() {
    state.isShow = !state.isShow;
  },
  clickFeature(feature: ExecutableFeature, event: MouseEvent) {
    feature.executeFunction(event);
    state.isShow = false;
  }
}
</script>
<style scoped lang="scss">
@import "@assets/main";

.expandable-feature-menu-button {
  display: flex;
  justify-content: center;
  align-items: center;
  width: max-content;
  padding: 3px;
  position: relative;

  .feature-button {
    border-radius: 5px;
    transition: $duration;


    &.select, &:hover {
      cursor: pointer;
      background-color: $standard-gray-in-white;
    }
  }

  .expandable-features {
    z-index: 1;
    position: absolute;
    right: 3px;
    bottom: -25px;
    border: 1px solid $standard-gray-in-white;
    border-radius: 5px;
    background-color: white;
    width: max-content;
    overflow: hidden;

    .feature-item {
      padding: 3px 5px;

      &:hover {
        cursor: pointer;
        background-color: $standard-light-gray-in-white;
      }
    }
  }
}
</style>
