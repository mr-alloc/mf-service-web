<script setup lang="ts">
import {onMounted, reactive, ref} from "vue";
import SelectImageOption from "@/classes/api-spec/SelectImageOption";

const select = ref<HTMLSelectElement | null>(null);
const props = defineProps({
  id: String,
  name: String,
  title: String,
  options: Array<SelectImageOption>,
  defaultOptionName: String,
  allowNoImage: Boolean,
  defaultSelected: Number,
  currentSelectedId: Number,
  beforeChange: Function
});
const defaultOption = new SelectImageOption(0, props.defaultOptionName ?? "없음", props.allowNoImage ? "NO_IMAGE" : "");
const state = reactive({
  isSelectMode: false,
  currentSelected: props.options?.[props.options?.findIndex(option => option.id === props.currentSelectedId)] ?? defaultOption
});
const methods = {
  clickSelector() {
    state.isSelectMode = !state.isSelectMode;
  },
  selectOption(index: number) {
    state.isSelectMode = false;
    props.beforeChange && props.beforeChange(props.options?.[index]);
  },
  selectOptionById(id: number) {
    const index = props.options?.findIndex(option => option.id === id)!;
    if (index === -1) {
      state.currentSelected = defaultOption;
      return;
    }
    state.currentSelected = props.options?.[index]!;
  }
}

onMounted(() => {
  if (props.defaultSelected) {
    methods.selectOptionById(props.defaultSelected);
  }

});
</script>
<template>
  <div class="simple-selector-container" :class="{ 'no-label': !props.title }">
    <label :for="props.id" v-if="props.title">{{ props.title }}</label>
    <div class="option-item current-selected-area pushable"
         :class="{ 'no-image': state.currentSelected.id === 0 || state.currentSelected.image === 'NO_IMAGE', 'blink': state.isSelectMode }"
         v-on:click="methods.clickSelector()"
    >
      <div class="item-image-area" :class="{ collapse: !state.currentSelected.image }">
        <div class="option-image-frame">
          <img v-if="state.currentSelected.image" :src="state.currentSelected.image" :alt="state.currentSelected.name"/>
        </div>
      </div>
      <div class="option-title">
        <span class="title-text">{{ state.currentSelected.name }}</span>
      </div>
    </div>
    <Transition name="down-fade">
      <div class="select-item-area" v-show="state.isSelectMode">
        <ul class="option-item-group">
          <li class="option-item" v-on:click="methods.selectOption(props.options?.length!)">
            <div class="item-image-area collapse">
              <div class="option-image-frame">
              </div>
            </div>
            <div class="option-title">
              <span class="title-text">{{ defaultOption.name }}</span>
            </div>
          </li>
          <li class="option-item" v-for="(option, index) in props.options" :key="index"
              v-on:click="methods.selectOption(index)">
            <input type="hidden" name="optionId" :value="option.id"/>
            <div class="item-image-area">
              <div class="option-image-frame">
                <img :src="option.image" :alt="option.name"/>
              </div>
            </div>
            <div class="option-title">
              <span class="title-text">{{ option.name }}</span>
            </div>
          </li>
        </ul>
        <select ref="select" :id="props.id" :name="props.id" :style="{ display: 'none' }">
          <option v-for="(option, index) in props.options" :key="index" :value="option.id"
                  :selected="props.currentSelectedId === option.id">{{ option.name }}
          </option>
        </select>
      </div>
    </Transition>
  </div>
</template>

<style scoped lang="scss">
@import "@/assets/main";

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

    &.no-image {

      .option-image-frame {
        width: 0;

        img {
          display: none;
        }
      }

    }

  }

  .select-item-area {
    position: absolute;
    border: 1px $standard-light-gray-in-white solid;
    border-radius: 10px;
    overflow: hidden;
    top: 60px;

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

}

</style>
