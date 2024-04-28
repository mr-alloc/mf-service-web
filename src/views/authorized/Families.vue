<script setup lang="ts">

import FamilySelector from "@/components/header/FamilySelector.vue";
</script>

<template>
  <div class="families-container">
    <h1>패밀리 정보</h1>
    <FamilySelector/>
  </div>
</template>

<style scoped lang="scss">
@import "@/assets/main";

.families-container {
  max-width: 768px;
  margin: 0 auto;
}
</style>
