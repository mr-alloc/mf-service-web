<template>
  <div class="select-container">
    <div class="current-selected-item" v-on:click="methods.showOptions()">
      <SelectItem class="current-item" :content="state.selectedItem"/>
      <span class="toggle-icon">
        <FontAwesomeIcon class="fa-xl" :icon="faCaretDown"/>
      </span>
    </div>
    <Transition name="down-fade">
      <ul class="select-items" v-show="state.selectMode">
        <li class="select-each-item">
          <SelectItem v-on:click="methods.selectDefaultOption()"
                      :content="new SelectItemValue(0, '', 'NO_IMAGE', '본캐 선택')"/>
        </li>
        <li class="select-each-item" v-for="(item, index) in props.items" :key="index">
          <SelectItem :content="item" v-on:click="methods.selectOption(item)"/>
        </li>
      </ul>
    </Transition>
  </div>
</template>
<script setup lang="ts">
import {FontAwesomeIcon} from "@fortawesome/vue-fontawesome";
import SelectItem from "@/components/global/SelectItem.vue";
import SelectItemValue from "@/classes/SelectItemValue";
import {faCaretDown} from "@fortawesome/free-solid-svg-icons";
import {reactive} from "vue";

const props = defineProps({
  items: Array<SelectItemValue>,
  defaultSelectedTitle: String,
  selectFunction: Function
})


const notSelectedOption = new SelectItemValue(0, "", "NO_IMAGE", props.defaultSelectedTitle ?? "");
const state = reactive({
  selectMode: false,
  selectedItem: notSelectedOption
})

const methods = {
  showOptions() {
    state.selectMode = !state.selectMode;
  },
  selectOption(item: SelectItemValue) {
    state.selectedItem = item;
    state.selectMode = false;
    props.selectFunction && props.selectFunction(item);
  },
  selectDefaultOption() {
    state.selectedItem = notSelectedOption;
    state.selectMode = false;
    props.selectFunction && props.selectFunction(notSelectedOption);
  }
}
</script>
<style scoped lang="scss">
@import "@/assets/main";

.select-container {
  position: relative;

  .current-selected-item {
    padding: 0 3px;
    transition: .2s;
    display: flex;
    flex-direction: row;
    border-radius: 5px;

    .current-item {
      flex-grow: 1;

      &:hover {
        background-color: unset;
      }
    }

    .toggle-icon {
      width: 20px;
      flex-shrink: 0;
      display: flex;
      justify-content: center;
      align-items: center;
    }


    &:hover {
      background-color: rgb(0, 0, 0, .2);
      cursor: pointer;
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
    width: 100%;
    max-height: 180px;
    overflow-y: scroll;

    .select-each-item {
      display: flex;
      flex-direction: column;
    }
  }
}
</style>
