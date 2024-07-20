<template>
  <div class="create-anniversary-container">
    <BlinkInput ref="anniversaryName" label="휴가/기념일 이름" id="anniversary-name" name="anniversaryName"
                place-holder="여름 휴가" :validate="methods.validateName" warning-message="이름을 입력해주세요."/>
    <DatePicker ref="multipleDatePicker" id="anniversary-date" label="날짜" name="anniversaryDate"
                :timestamp="props.timestamp" :after-change-mode="methods.handleChangeScheduleMode"/>
    <div class="control-panel">
      <div class="control-button" v-on:click="methods.createAnniversary">
        <span class="button-text">생성</span>
      </div>
      <div class="control-button" v-on:click="() => emitter.emit('resetComponent')">
        <span class="button-text">취소</span>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import BlinkInput from "@/components/global/BlinkInput.vue";
import {inject, reactive, ref} from "vue";
import DatePicker from "@/components/global/DatePicker.vue";
import {useThrottleFn} from "@vueuse/core";
import PopupUtil from "@/utils/PopupUtil";
import {PopupType} from "@/stores/status/CurrentPopup";
import {RequestBody, ResponseBody} from "@/classes/api-spec/CreateAnniversary";
import ScheduleMode from "@/constant/ScheduleMode";
import type {BlinkInputExpose, DatePickerExpose} from "@/types/ExposeType";
import {ex} from "@/utils/Undefinable";
import {useCalendarStore} from "@/stores/CalendarStore";
import {useBackgroundStore} from "@/stores/BackgroundStore";
import {call} from "@/utils/NetworkUtil";
import Anniversary from "@/constant/api-meta/Anniversary";
import MultipleModeOutput from "@/classes/component-protocol/MultipleModeOutput";
import {useAlertStore} from "@/stores/AlertStore";

const alertStore = useAlertStore();
const calendarStore = useCalendarStore();
const backgroundStore = useBackgroundStore();
const emitter: any = inject("emitter");
const anniversaryName = ref<BlinkInputExpose | null>(null);
const multipleDatePicker = ref<DatePickerExpose | null>(null);
const props = defineProps<{
  timestamp: number,
}>();

const state = reactive({
  scheduleMode: ScheduleMode.SINGLE,
  anniversaryName: '',
  validName: false,
  isSubmittable: false
});

const methods = {
  validateName() {
    state.anniversaryName = anniversaryName.value?.input.value ?? "";
    state.validName = state.anniversaryName.length > 0
    if (!state.validName) {
      anniversaryName.value?.input?.focus();
    }

    return state.validName;
  },
  checkAllInput() {
    methods.validateName();
    state.isSubmittable = state.validName;
  },
  getRequestBody(): RequestBody {
    const scheduleMode = state.scheduleMode as ScheduleMode;
    const isSingle = scheduleMode.value === ScheduleMode.SINGLE.value;
    const scheduleInfo = isSingle
        ? new MultipleModeOutput(new Set([props.timestamp]))
        : multipleDatePicker.value?.extractResult();

    return new RequestBody(state.anniversaryName, scheduleInfo);
  },
  handleChangeScheduleMode(mode: ScheduleMode) {
    state.scheduleMode = mode;
    4
  },
  createAnniversary: useThrottleFn(() => {
    methods.checkAllInput();
    if (!state.isSubmittable) {
      PopupUtil.innerAlert(PopupType.INFO, "생성 실패", "입력값을 확인해주세요.");
      return;
    }

    const requestBody = methods.getRequestBody();
    if (ex(requestBody).no()) {
      return;
    }

    call<RequestBody, ResponseBody>(Anniversary.CreateAnniversary, requestBody, (response) => {
      const responseBody = ResponseBody.fromJson(response.data);
      const created = responseBody.created;
      created.forEach(calendarStore.addAnniversary);
      alertStore.success("기념일 생성 완료!", `"${requestBody.name}"이 등록 되었어요!`);
      calendarStore.resetSelected();

      emitter.emit("drawCalendar");
      emitter.emit("resetComponent");
      backgroundStore.returnGlobalPopup();
    });

  }, 2000)
}
</script>
<style scoped lang="scss">
@import "@assets/main";

.create-anniversary-container {
  padding: 20px;

  .control-panel {
    display: flex;
    flex-direction: row;
    justify-content: space-evenly;
    align-items: center;

    .control-button {
      transition: $duration;
      border-radius: 5px;
      padding: 5px 10px;
      user-select: none;

      .button-text {
        padding: 0;
      }

      &:hover {
        cursor: pointer;
        background-color: $standard-light-gray-in-white;
      }

    }
  }
}
</style>
