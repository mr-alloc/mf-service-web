<template>
  <div class="loading-spinner-wrapper">
    <div class="message-title">
      <span>{{ props.title }}</span>
    </div>
    <div class="spinner-area">
      <span class="content">{{ props.content }}</span>
      <span class="spinner">
        <FontAwesomeIcon v-if="status.isLoading" class="fa-1x" :icon="faSpinner" spin/>
      </span>
    </div>
  </div>
</template>
<script setup lang="ts">
import {faSpinner} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/vue-fontawesome";
import {reactive} from "vue";

const status = reactive({
  isLoading: true
})

const props = defineProps({
  title: String,
  content: String
})
</script>
<style scoped lang="scss">
@import '@assets/main.scss';

.loading-spinner-wrapper {
  width: 250px;
  border-radius: 5px;
  padding: 5px 8px;
  background-color: white;

  .message-title {
    span {
      font-weight: bold;
      font-size: .91rem;
      display: block;
      border-bottom: 1px $standard-light-gray-in-white solid;
    }
  }

  .spinner-area {
    display: flex;
    flex-direction: column;

    .content {
      padding: 5px 8px;
      flex-grow: 1;
      display: block;
      font-size: .85rem;
    }

    .spinner {
      flex-shrink: 0;
      height: 50px;
      display: flex;
      justify-content: center;
      align-items: center;
      color: $standard-weight-gray-in-white;
    }
  }
}
</style>
