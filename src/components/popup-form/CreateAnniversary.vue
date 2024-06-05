<template>
  <div class="create-anniversary-container">
    <BlinkInput ref="anniversaryName" label="휴가/기념일 이름" id="anniversary-name" name="anniversaryName"
                place-holder="여름 휴가" :validate="methods.validateName" warning-message="이름을 입력해주세요."/>
    <DatePicker ref="multipleDatePicker" id="anniversary-date" label="날짜" name="anniversaryDate"
                :timestamp="props.timestamp" :after-change-mode="methods.handleChangeScheduleMode"/>
  </div>
</template>
<script setup lang="ts">
import BlinkInput from "@/components/global/BlinkInput.vue";
import {inject, onMounted, reactive, ref} from "vue";
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
    if (scheduleMode.value === ScheduleMode.SINGLE.value) {
      return new RequestBody(state.anniversaryName);
    }

    const scheduleInfo = multipleDatePicker.value?.extractResult();
    return new RequestBody(state.anniversaryName, scheduleInfo);
  },
  handleChangeScheduleMode(mode: ScheduleMode) {
    state.scheduleMode = mode;
  }
}

onMounted(() => {
  emitter.on("validateCreateAnniversaryForm", useThrottleFn(() => {
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
      calendarStore.resetSelected();

      emitter.off("validateCreateMissionForm");
      backgroundStore.returnGlobalPopup();
    });

  }, 2000))
})
</script>
<style scoped lang="scss">

</style>
