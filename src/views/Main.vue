<script setup lang="ts">

</script>

<template>
  <div class="main-container">
    <div class="draggable-carousel-container">
      <ul class="carousel">
        <li class="item"></li>
        <li class="item"></li>
        <li class="item"></li>
      </ul>
    </div>
  </div>
</template>

<style scoped lang="scss">
@import "@/assets/main";

.main-container {

  .draggable-carousel-container {

    .carousel {
      display: flex;
      flex-direction: row;
      width: 400px;
      height: 350px;
      touch-action: pan-x;

      .item {
        width: 400px;

        &:nth-child(1) {
          background-color: crimson;
        }

        &:nth-child(2) {
          background-color: royalblue;
        }

        &:nth-child(3) {
          background-color: gold;
        }
      }

    }
  }
}
</style>
