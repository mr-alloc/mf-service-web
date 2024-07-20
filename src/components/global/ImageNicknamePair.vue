<script setup lang="ts">
import SelectImageOption from "@/classes/api-spec/SelectImageOption";

const props = defineProps({
  option: SelectImageOption
})
</script>

<template>
  <div class="nickname-image-pair-container">
    <div class="item-image-area">
      <div class="option-image-frame">
        <img :src="option?.image" :alt="option?.name"/>
      </div>
    </div>
    <div class="option-title">
      <span class="title-text">{{ option?.name }}</span>
    </div>
  </div>
</template>

<style scoped lang="scss">
@import "@assets/main";

.nickname-image-pair-container {
  display: flex;
  transition: $duration;
  flex-direction: row;
  padding: 0.2rem 0.3rem;

  .item-image-area {
    width: 30px;
    display: flex;
    justify-content: center;

    .option-image-frame {
      width: 1.5rem;
      height: 1.5rem;
      display: flex;
      justify-content: center;
      align-items: center;
      border-radius: 50%;
      overflow: hidden;

      img {
        width: 100%;
        height: 100%;
        user-select: none;
      }
    }

    &.collapse {
      width: 0;
    }
  }

  .option-title {
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 0 8px;

    .title-text {
      font-weight: bold;

    }
  }

}
</style>
