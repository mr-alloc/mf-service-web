<template>
  <div class="select-item">
    <div class="item-image-area" :class="{ 'no-image': props.content?.image === 'NO_IMAGE' }">
      <span class="image-frame" :style="{ backgroundColor: `#${props.content?.frameColor}` }">
        <img v-if="props.content?.image && props.content?.image !== 'NO_IMAGE'" class="select-item-image"
             :src="props.content?.image"/>
      </span>
    </div>
    <div class="item-title-wrapper">
      <span class="item-title">{{ props.content?.title }}</span>
    </div>
  </div>
</template>
<script setup lang="ts">
import SelectItemValue from "@/classes/SelectItemValue";

const props = defineProps({
  content: SelectItemValue,
})
</script>
<style scoped lang="scss">
@import "@/assets/main";

.select-item {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding: .2rem .3rem;
  cursor: pointer;
  transition: $duration;

  .item-image-area {
    width: 30px;
    display: flex;
    justify-content: center;

    &.no-image {
      width: 0;
    }

    .image-frame {
      width: 1.5rem;
      height: 1.5rem;
      border-radius: 50%;
      display: flex;
      justify-content: center;
      align-items: center;

      .select-item-image {
        width: 2.5rem;
        height: 2.5rem;
        border-radius: 50%;
      }
    }
  }

  .item-title-wrapper {
    display: flex;
    justify-content: center;
    flex-grow: 1;


    .item-title {
      font-size: .92rem;
      font-weight: bold;
      text-overflow: ellipsis;
      user-select: none;
    }
  }

  &:hover {
    background-color: rgb(0, 0, 0, .2);
  }
}

</style>
