<template>
  <div class="multiple-datepicker-container">
    <label class="title" v-if="props.label" :for="props.id">{{ props.title }}</label>
    <div class="collapse-controller">
      <IconButton icon="calendar-alt" size="2x" :click-behavior="methods.toggleCollapse"/>
    </div>
    <div class="mini-calendar-area">
      <ul class="days-item-group">
        <li class="day"></li>
      </ul>
    </div>
  </div>
</template>
<script setup lang="ts">
import IconButton from "@/components/global/IconButton.vue";
import {reactive} from "vue";
import moment from "moment-timezone";

const props = defineProps({
  id: String,
  title: String,
  name: String,
  label: String,
  year: Number,
});
const state = reactive({
  isCollapsed: false,
  year: props.year ?? moment().year(),
  month: moment().month(),
});
const methods = {
  toggleCollapse() {
    state.isCollapsed = !state.isCollapsed;
  }
}
</script>
<style scoped lang="scss">
@import '@/assets/main';

</style>
