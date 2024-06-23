<template>
  <div class="refresh-token-container">
    <FontAwesomeIcon class="fa-3x" :icon="faSpinner" spin/>
  </div>
</template>
<script setup lang="ts">
import {onMounted} from "vue";
import {refreshToken} from "@/utils/LocalCache";
import {faSpinner} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/vue-fontawesome";

onMounted(() => {
  refreshToken();
});
</script>
<style scoped lang="scss">
.refresh-token-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  width: 100%;
  background-color: white;
  position: fixed;
  top: 0;
  left: 0;
}
</style>
