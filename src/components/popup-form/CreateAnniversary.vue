<template>
  <div class="create-anniversary-container">
    <BlinkInput label="휴가/기념일 이름" id="anniversary-name" name="anniversaryName" place-holder="여름 휴가"
                :validate="methods.validateName" warning-message="이름을 입력해주세요."/>
    <BlinkSelect id="repeat-option" title="반복(옵션)" :options="state.repeatOptions" name="missionType"/>
    <MultipleDatePicker v-if="state.isNotPeriod" id="anniversary-date" label="날짜" name="anniversaryDate"
                        :timestamp="startTimestamp"/>
  </div>
</template>
<script setup lang="ts">
import BlinkInput from "@/components/global/BlinkInput.vue";
import DocumentUtil from "@/utils/DocumentUtil";
import {onMounted, reactive} from "vue";
import SelectOption from "@/classes/SelectOption";
import MultipleDatePicker from "@/components/global/MultipleDatePicker.vue";

const props = defineProps({
  startTimestamp: Number,
  endTimestamp: Number
});

const state = reactive({
  validName: false,
  repeatOptions: [
    SelectOption.of('0', '없음'),
    SelectOption.of('1', '매년 (예: 매년 5월 9일~ 17일 반복)'),
    SelectOption.of('2', '매월 (예: 매월 9일 ~ 17일 반복'),
  ],
  isNotPeriod: false
});

const methods = {
  validateName() {
    const nameInput = DocumentUtil.getHtmlElementById<HTMLInputElement>('anniversary-name');
    state.validName = nameInput.value.length > 0
    return state.validName;
  }
}

onMounted(() => {
  console.log(props.startTimestamp, props.endTimestamp)
  state.isNotPeriod = (props.startTimestamp !== undefined && props.startTimestamp > 0) && (props.endTimestamp === undefined || props.endTimestamp === 0)
})
</script>
<style scoped lang="scss">

</style>
