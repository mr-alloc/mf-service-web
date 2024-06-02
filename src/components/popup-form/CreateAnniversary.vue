<template>
  <div class="create-anniversary-container">
    <BlinkInput ref="anniversaryName" label="휴가/기념일 이름" id="anniversary-name" name="anniversaryName"
                place-holder="여름 휴가"
                :validate="methods.validateName" warning-message="이름을 입력해주세요."/>
    <DatePicker ref="multipleDatePicker" id="anniversary-date" label="날짜" name="anniversaryDate"
                :timestamp="props.timestamp"/>
  </div>
</template>
<script setup lang="ts">
import BlinkInput from "@/components/global/BlinkInput.vue";
import {inject, onMounted, reactive, ref} from "vue";
import SelectOption from "@/classes/SelectOption";
import DatePicker from "@/components/global/DatePicker.vue";
import {useCalendarStore} from "@/stores/CalendarStore";
import {useThrottleFn} from "@vueuse/core";
import PopupUtil from "@/utils/PopupUtil";
import {PopupType} from "@/stores/status/CurrentPopup";
import {RequestBody, ResponseBody} from "@/classes/api-spec/CreateAnniversary";
import {call} from "@/utils/NetworkUtil";
import Anniversary from "@/constant/api-meta/Anniversary";
import {useBackgroundStore} from "@/stores/BackgroundStore";


const emitter = inject("emitter");
const anniversaryName = ref(null);
const multipleDatePicker = ref(null);

const backgroundStore = useBackgroundStore();
const calendarStore = useCalendarStore();
const props = defineProps<{
  timestamp: number,
}>();

const state = reactive({
  anniversaryName: '',
  validName: false,
  repeatOptions: [
    SelectOption.of('0', '없음'),
    SelectOption.of('1', '매년 (예: 매년 5월 9일~ 17일 반복)'),
    SelectOption.of('2', '매월 (예: 매월 9일 ~ 17일 반복'),
  ],
  isSubmittable: false
});

const methods = {
  validateName() {
    const input = anniversaryName.value?.input as HTMLInputElement | null;
    state.anniversaryName = input?.value ?? "";
    state.validName = state.anniversaryName.length > 0
    if (!state.validName) {
      input?.focus();
      return;
    }

    return state.validName;
  },
  checkAllInput() {
    methods.validateName();
    state.isSubmittable = state.validName;
  }
}

onMounted(() => {
  emitter.on("validateCreateAnniversaryForm", useThrottleFn(() => {
    methods.checkAllInput();
    if (!state.isSubmittable) {
      PopupUtil.innerAlert(PopupType.INFO, "생성 실패", "입력값을 확인해주세요.");
      return;
    }

    let requestBody: RequestBody = {} as RequestBody;

    call<RequestBody, ResponseBody>(Anniversary.CreateAnniversary, requestBody, (response) => {
      const responseBody = ResponseBody.fromJson(response.data);
      const created = responseBody.created;
      calendarStore.addAnniversary(created);
      calendarStore.resetSelected();

      emitter.off("validateCreateMissionForm");
      backgroundStore.returnGlobalPopup();
    });

  }, 2000))
})
</script>
<style scoped lang="scss">

</style>
