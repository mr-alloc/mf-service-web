<script setup lang="ts">

import FamilySelector from "@/components/header/FamilySelector.vue";
import FamilyMembers from "@/components/main/FamilyMembers.vue";
import {useOwnFamiliesStore} from "@/stores/OwnFamiliesStore";

const ownFamiliesStore = useOwnFamiliesStore();
</script>

<template>
  <div class="families-container">
    <h1>패밀리 정보</h1>
    <div class="family-selector-wrapper">
      <FamilySelector/>
    </div>
    <FamilyMembers v-show="ownFamiliesStore.hasSelectFamily"/>
  </div>
</template>

<style scoped lang="scss">
@import "@/assets/main";

.families-container {
  max-width: 768px;
  margin: 0 auto;

  .family-selector-wrapper {
    max-width: 230px;
  }
}
</style>
