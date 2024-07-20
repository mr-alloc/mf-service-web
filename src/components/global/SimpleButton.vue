<template>
  <div class="simple-button" :class="[
      { loading: status.isLoading },
      { disable: !props.submittable || status.isDisable },
      { hide: status.isHide }
      ]">
    <button class="btn-primary" type="button" v-on:click="methods.clickBehaviorProxy()" :disabled="status.isHide">
      <FontAwesomeIcon v-if="status.isLoading" class="fa-1x" :icon="faSpinner" spin />
      <span v-else>{{ props.buttonName }}</span>
    </button>
  </div>
</template>

<script setup lang="ts">
import {FontAwesomeIcon} from "@fortawesome/vue-fontawesome";
import {faSpinner} from "@fortawesome/free-solid-svg-icons";
import {reactive} from "vue";

const props = defineProps({
  clickBehavior: Function,
  buttonName: String,
  submittable: Boolean,
});

const status = reactive({
  isLoading: false,
  isDisable: false,
  isHide: false
})

const methods = {
  async clickBehaviorProxy() {
    if (!props.submittable) return;
    const isSuccess = props.clickBehavior && await props.clickBehavior();
    this.changeToLoading(isSuccess);
  },
  changeToLoading(doLoading: boolean) {
    status.isDisable = doLoading;
    status.isLoading = doLoading;
  }
}
</script>

<style scoped lang="scss">
@import '@assets/main.scss';
.simple-button {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  padding: 15px 0;

  button {
    height: 50px;
    width: 100%;
  }

  &.disable button {
    cursor: default;
    background-color: lightgray;

    &:hover {
      cursor: default;
      background-color: lightgray;
    }
  }
}

</style>
