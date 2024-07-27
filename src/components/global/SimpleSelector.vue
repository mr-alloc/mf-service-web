<script setup lang="ts">
import {onMounted, reactive, ref} from "vue";
import SelectImageOption from "@/classes/api-spec/SelectImageOption";
import LocalAsset from "@/constant/LocalAsset";

const select = ref<HTMLSelectElement | null>(null);
const props = defineProps({
  id: String,
  name: String,
  title: String,
  options: Array<SelectImageOption>,
  defaultOptionName: String,
  allowNoImage: Boolean,
  defaultSelected: Number,
  currentIndex: Number,
  beforeChange: Function
});
const state = reactive({
  isSelectMode: false,
  selectedOption: SelectImageOption.ofDefault()
});
const methods = {
  clickSelector() {
    state.isSelectMode = !state.isSelectMode;
  },
  selectOption(index: number) {
    state.isSelectMode = false;

    const afterChange = () => {
      //동일한 값 선택
      if (props.options?.[index].id === state.selectedOption.id) return;

      Array.from(select.value?.options!).filter((opt, idx) => idx === index).forEach(opt => opt.selected = true);
      state.selectedOption = props.options?.[index] as SelectImageOption;
    }

    if (props.beforeChange) {
      props.beforeChange(props.options?.[index], afterChange);
    } else {
      afterChange();
    }
  }
}
defineExpose({
  getValue: () => state.selectedOption.id
});
onMounted(() => {
  state.selectedOption = props.options?.[0] as SelectImageOption;
  if (props.currentIndex) {
    Array.from(select.value?.options!).filter((opt, idx) => idx === props.currentIndex).forEach(opt => opt.selected = true);
  }
})
</script>
<template>
  <div class="simple-selector-container" :class="{ 'no-label': props.title === undefined }">
    <label :for="props.id" v-if="props.title">{{ props.title }}</label>
    <div class="option-item current-selected-area pushable"
         :class="{
            'no-image': state.selectedOption?.image === LocalAsset.DEFAULT_NO_IMAGE,
            'blink': state.isSelectMode
        }" v-on:click="methods.clickSelector()">
      <div class="item-image-area"
           :class="{ collapse: state.selectedOption?.image === LocalAsset.DEFAULT_NO_IMAGE }">
        <div class="option-image-frame">
          <img
              v-if="state.selectedOption?.image !== LocalAsset.DEFAULT_NO_IMAGE"
              :src="state.selectedOption?.image"
              :alt="state.selectedOption?.name"/>
        </div>
      </div>
      <div class="option-title">
        <span class="title-text">{{ state.selectedOption?.name }}</span>
      </div>
    </div>
    <Transition name="down-fade">
      <div class="select-item-area" v-show="state.isSelectMode">
        <ul class="option-item-group">
          <li class="option-item" v-for="(option, index) in props.options" :key="index"
              :class="{ 'no-image': option.image === LocalAsset.DEFAULT_NO_IMAGE }"
              v-on:click="methods.selectOption(index)">
            <div class="item-image-area">
              <div class="option-image-frame">
                <img v-if="option.image !== LocalAsset.DEFAULT_NO_IMAGE" :src="option.image" :alt="option.name"/>
              </div>
            </div>
            <div class="option-title">
              <span class="title-text">{{ option.name }}</span>
            </div>
          </li>
        </ul>
        <select ref="select" :id="props.id" :name="props.id" :style="{ display: 'none' }">
          <option v-for="(option, index) in props.options" :key="index" :value="option.id">{{ option.name }}</option>
        </select>
      </div>
    </Transition>
  </div>
</template>

<style scoped lang="scss">
@import "@assets/main";

.simple-selector-container {
  padding: 0;
  margin: 0 auto;
  position: relative;

  .current-selected-area {
    display: flex;
    flex-direction: row;
    width: max-content;
    padding: 3px 8px;
    border-radius: 5px;
    border: 1px solid transparent;
  }

  .select-item-area {
    position: absolute;
    border: 1px $standard-light-gray-in-white solid;
    border-radius: 10px;
    overflow: hidden;
    top: 60px;
    z-index: 1;

    .option-item-group {
      list-style: none;
      width: max-content;
      padding: 0;
      background-color: white;

      .option-item {

        &:hover {
          cursor: pointer;
          background-color: rgb(0, 0, 0, .1);
        }
      }
    }
  }

  &.no-label {
    .select-item-area {
      top: 35px;
    }
  }
}

.option-item {
  display: flex;
  transition: $duration;
  flex-direction: row;
  padding: 0.2rem 0.3rem;
  justify-content: center;
  align-items: center;

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

  &.no-image {
    .item-image-area {
      width: 0;

      .option-image-frame {
        width: 0;

        img {
          display: none;
        }
      }
    }
  }
}

</style>
