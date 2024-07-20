<script setup lang="ts">
import {useOwnFamiliesStore} from "@/stores/OwnFamiliesStore";
import {inject, reactive} from "vue";
import {faCaretDown} from "@fortawesome/free-solid-svg-icons";
import SelectItem from "@/components/global/SelectFamilyItem.vue";
import {FontAwesomeIcon} from "@fortawesome/vue-fontawesome";
import {useLeftMenuStore} from "@/stores/LeftMenuStore";
import SelectFamilyOption from "@/classes/SelectFamilyOption";
import {getSelectedFamilyId} from "@/utils/LocalCache";

const emitter = inject("emitter")!;
const ownFamiliesStore = useOwnFamiliesStore();
const leftMenuStore = useLeftMenuStore();

const props = defineProps({
  allowCollapse: Boolean
});
const state = reactive({
  isSelectMode: false,
  isCollapsed: leftMenuStore.state.isCollapsed
});

const methods = {
  showSelector() {
    state.isSelectMode = !state.isSelectMode;
  },
  selectFamily(emitter: any, item: SelectFamilyOption = ownFamiliesStore.selectorState.defaultOption as SelectFamilyOption) {
    if (getSelectedFamilyId() === item?.id) {
      state.isSelectMode = false;
      return;
    }
    ownFamiliesStore.selectorState.selectedOption = item;
    state.isSelectMode = false;

    ownFamiliesStore.changeFamily(emitter);
  }
}
</script>
<template>
  <div class="select-container" :class="{ collapse: leftMenuStore.state.isCollapsed }">
    <div class="current-selected-item"
         :class="{ 'no-image': ownFamiliesStore.selectorState.selectedOption.image === 'NO_IMAGE' }"
         v-on:click="methods.showSelector()">
      <div class="item-image-area">
        <span class="image-frame"
              :style="{ backgroundColor: `#${ownFamiliesStore.selectorState.selectedOption.frameColor}` }">
          <img
              v-if="ownFamiliesStore.selectorState.selectedOption.image && ownFamiliesStore.selectorState.selectedOption.image !== 'NO_IMAGE'"
              class="select-item-image"
              :src="ownFamiliesStore.selectorState.selectedOption.image" alt="선택 옵션의 이미지"/>
        </span>
        <Transition name="fade">
          <span class="toggle-icon" v-show="props.allowCollapse && leftMenuStore.state.isCollapsed">
              <FontAwesomeIcon :icon="faCaretDown"/>
          </span>
        </Transition>
      </div>
      <Transition name="fade">
        <div class="item-title-wrapper" :class="{ collapse: props.allowCollapse && leftMenuStore.state.isCollapsed }"
             v-show="!leftMenuStore.state.isCollapsed || !props.allowCollapse">
          <span class="item-title">{{
              ownFamiliesStore.selectorState.selectedOption.id === 0 ? '패밀리 선택' : ownFamiliesStore.selectorState.selectedOption.title
            }}</span>
        </div>
      </Transition>
    </div>
    <Transition name="down-fade">
      <ul class="select-items" v-show="state.isSelectMode">
        <li class="select-each-item">
          <SelectItem v-on:click="methods.selectFamily(emitter)"
                      :content="ownFamiliesStore.selectorState.defaultOption"/>
        </li>
        <li class="select-each-item" v-for="(item, index) in ownFamiliesStore.toSelectItemValue()" :key="index">
          <SelectItem :content="item" v-on:click="methods.selectFamily(emitter, item)"/>
        </li>
      </ul>
    </Transition>
  </div>
</template>
<style scoped lang="scss">
@import "@assets/main";

.select-container {
  position: relative;

  .current-selected-item {
    margin: 5px 0;
    height: 35px;
    padding: 0 3px;
    transition: .2s;
    display: flex;
    flex-direction: row;
    border-radius: 5px;
    position: relative;

    &.no-image {
      .item-image-area {
        width: 0;
      }

      .item-title-wrapper {
        left: 0;
        width: 100%;
      }
    }

    .item-image-area {
      display: flex;
      justify-content: center;
      align-items: center;
      position: relative;
      width: calc(35px - 6px);


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

      .toggle-icon {
        font-size: .6rem;
        flex-shrink: 0;
        display: flex;
        justify-content: center;
        align-items: center;
        position: absolute;
        top: 22px;
        left: 22px;
      }
    }

    .item-title-wrapper {
      display: flex;
      justify-content: center;
      align-items: center;
      flex-grow: 1;
      position: absolute;
      left: 35px;
      height: 100%;
      width: calc(205px - 6px - 35px);


      .item-title {
        font-size: .92rem;
        font-weight: bold;
        text-overflow: ellipsis;
        user-select: none;
        align-items: center;
        justify-content: center;
      }
    }

    &:hover {
      background-color: rgb(0, 0, 0, .2);
      cursor: pointer;
    }

    &.collapse {
      position: relative;

      .current-selected-item {
        width: 100%;

        .item-image-area {
          width: 100%;

          .toggle-icon {
            position: absolute;
            top: 18px;
            left: 23px;
            font-size: .7rem;
          }
        }
      }
    }
  }

  .select-items {
    list-style: none;
    padding: 0;
    border: 1px $standard-light-gray-in-white solid;
    border-radius: 5px;
    overflow: hidden;
    position: absolute;
    background-color: white;
    top: 35px;
    z-index: 4;
    width: max-content;
    max-height: 180px;
    overflow-y: scroll;

    .select-each-item {
      display: flex;
      flex-direction: column;
    }
  }
}
</style>
