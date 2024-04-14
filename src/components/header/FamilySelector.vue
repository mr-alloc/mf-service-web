<script setup lang="ts">
import SelectFamilyOption from "@/classes/SelectFamilyOption";
import {useMemberInfoStore} from "@/stores/MemberInfo";
import {useOwnFamiliesStore} from "@/stores/OwnFamiliesStore";
import {setSelectedFamilyId} from "@/utils/LocalCache";
import {inject, reactive} from "vue";
import {faCaretDown} from "@fortawesome/free-solid-svg-icons";
import {useLeftMenuStore} from "@/stores/LeftMenuStore";
import SelectItem from "@/components/global/SelectItem.vue";
import {FontAwesomeIcon} from "@fortawesome/vue-fontawesome";

const memberInfoStore = useMemberInfoStore();
const ownFamiliesStore = useOwnFamiliesStore();
const emitter = inject("emitter")!;

const methods = {
  changeFamily(item: SelectFamilyOption) {
    setSelectedFamilyId(item.id);
    memberInfoStore.fetchMemberInfo(item.title);
    emitter.emit("drawMemberCalendar");
  },
  showOptions() {
    state.selectMode = !state.selectMode;
  },
  selectOption(item: SelectFamilyOption) {
    state.selectedItem = item;
    state.selectMode = false;
    methods.changeFamily(item);
  },
  selectDefaultOption() {
    state.selectedItem = notSelectedOption;
    state.selectMode = false;
    methods.changeFamily(notSelectedOption);
  }
}

const leftMenuStore = useLeftMenuStore();
const notSelectedOption = new SelectFamilyOption(0, "", "NO_IMAGE", "본캐 선택");
const state = reactive({
  selectMode: false,
  defaultOption: notSelectedOption,
  selectedItem: notSelectedOption
});
</script>
<template>
  <div class="select-container" :class="{ collapse: leftMenuStore.state.isCollapsed }">
    <div class="current-selected-item" :class="{ 'no-image': state.selectedItem.image === 'NO_IMAGE' }"
         v-on:click="methods.showOptions()">
      <div class="item-image-area">
        <span class="image-frame" :style="{ backgroundColor: `#${state.selectedItem.frameColor}` }">
          <img v-if="state.selectedItem.image && state.selectedItem.image !== 'NO_IMAGE'" class="select-item-image"
               :src="state.selectedItem.image" alt="선택 옵션의 이미지"/>
        </span>
        <Transition name="fade">
          <span class="toggle-icon" v-show="leftMenuStore.state.isCollapsed">
              <FontAwesomeIcon :icon="faCaretDown"/>
          </span>
        </Transition>
      </div>
      <Transition name="fade">
        <div class="item-title-wrapper" :class="{ collapse: leftMenuStore.state.isCollapsed }"
             v-show="!leftMenuStore.state.isCollapsed">
          <span class="item-title">{{ state.selectedItem.title }}</span>
        </div>
      </Transition>
    </div>
    <Transition name="down-fade">
      <ul class="select-items" v-show="state.selectMode">
        <li class="select-each-item">
          <SelectItem v-on:click="methods.selectDefaultOption()"
                      :content="state.defaultOption"/>
        </li>
        <li class="select-each-item" v-for="(item, index) in ownFamiliesStore.toSelectItemValue()" :key="index">
          <SelectItem :content="item" v-on:click="methods.selectOption(item)"/>
        </li>
      </ul>
    </Transition>
  </div>
</template>
<style scoped lang="scss">
@import "@/assets/main";

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
