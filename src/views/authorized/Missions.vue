<script setup lang="ts">

import MissionOptions from "@/components/MissionOptions.vue";
</script>

<template>
  <div class="mission-page-container">
    <div class="on-going-summary">
      <ul class="summary-list">
        <li class="summary-item">
          <span class="item-title">사야해</span>
          <span class="item-count">312389</span>
        </li>
        <li class="summary-item">
          <span class="item-title">해야해</span>
          <span class="item-count">321902</span>
        </li>
      </ul>
    </div>
    <MissionOptions/>
  </div>
</template>

<style scoped lang="scss">
.mission-page-container {
  width: 768px;
  margin: 0 auto;
  padding: 20px 0;

  .on-going-summary {
    padding: 12px 15px;

    .summary-list {
      list-style: none;
      display: flex;
      flex-direction: row;
      padding: 0;
      width: max-content;
      margin: 0 auto;

      .summary-item {
        display: flex;
        flex-direction: column;
        border-radius: 5px;
        background-color: #2c3e50;
        color: white;
        text-align: center;
        width: 100px;
        margin: 0 10px;
        padding: 20px 0;
        user-select: none;

        .item-title {
          padding: 5px 0;
          font-weight: bold;
          font-size: 1.4rem;
        }

        .item-count {
          padding: 5px 0;
          font-weight: bold;
        }
      }
    }
  }
}
</style>
