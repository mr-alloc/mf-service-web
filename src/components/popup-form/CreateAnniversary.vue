<template>
  <div class="create-anniversary-container">
    <BlinkInput ref="anniversaryName" label="휴가/기념일 이름" id="anniversary-name" name="anniversaryName"
                place-holder="여름 휴가"
                :validate="methods.validateName" warning-message="이름을 입력해주세요."/>
    <BlinkSelect id="repeat-option" title="반복(옵션)" :options="state.repeatOptions" name="missionType"/>
    <MultipleDatePicker ref="multipleDatePicker" v-if="state.isNotPeriod" id="anniversary-date" label="날짜"
                        name="anniversaryDate"
                        :timestamp="startTimestamp" :default-select="props.startTimestamp"/>
  </div>
</template>
<script setup lang="ts">
import BlinkInput from "@/components/global/BlinkInput.vue";
import {inject, onMounted, reactive, ref} from "vue";
import SelectOption from "@/classes/SelectOption";
import MultipleDatePicker from "@/components/global/MultipleDatePicker.vue";
import {useCalendarStore} from "@/stores/CalendarStore";
import {useThrottleFn} from "@vueuse/core";
import PopupUtil from "@/utils/PopupUtil";
import {PopupType} from "@/stores/status/CurrentPopup";
import {RequestBody, ResponseBody} from "@/classes/api-spec/CreateAnniversary";
import TemporalUtil from "@/utils/TemporalUtil";
import DateUtil from "@/utils/DateUtil";
import {call} from "@/utils/NetworkUtil";
import Anniversary from "@/constant/api-meta/Anniversary";
import {useBackgroundStore} from "@/stores/BackgroundStore";


const emitter = inject("emitter");
const anniversaryName = ref(null);
const multipleDatePicker = ref(null);

const backgroundStore = useBackgroundStore();
const calendarStore = useCalendarStore();
const props = defineProps<{
  startTimestamp: number,
  endTimestamp: number
}>();

const state = reactive({
  anniversaryName: '',
  validName: false,
  repeatOptions: [
    SelectOption.of('0', '없음'),
    SelectOption.of('1', '매년 (예: 매년 5월 9일~ 17일 반복)'),
    SelectOption.of('2', '매월 (예: 매월 9일 ~ 17일 반복'),
  ],
  isNotPeriod: calendarStore.startTimestamp > 0 && calendarStore.endTimestamp === 0,
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
  console.log(props.startTimestamp, props.endTimestamp)
  state.isNotPeriod = (props.startTimestamp! > 0) && (props.endTimestamp! === 0)

  emitter.on("validateCreateAnniversaryForm", useThrottleFn(() => {
    methods.checkAllInput();
    if (!state.isSubmittable) {
      PopupUtil.innerAlert(PopupType.INFO, "생성 실패", "입력값을 확인해주세요.");
      return;
    }

    let requestBody: RequestBody;
    //기간 선택

    if (props.startTimestamp > 0 && props.endTimestamp > 0) {
      requestBody = RequestBody.forPeriod(state.anniversaryName, props.startTimestamp, props.endTimestamp);
    }
    //하루 선택
    else {
      const selected: Set<number> = multipleDatePicker.value?.selected;
      if (state.isNotPeriod && selected?.size === 1) {
        const when = TemporalUtil.toMoment(props.startTimestamp, true);
        const yearMonth = when.format(DateUtil.YYYYMM);
        requestBody = RequestBody.forSingle(state.anniversaryName, yearMonth, when.date())
      }
      //여러날짜 선택
      else if (state.isNotPeriod && selected?.size > 0) {
        const when = TemporalUtil.toMoment(props.startTimestamp, true);
        const yearMonth = when.format(DateUtil.YYYYMM);
        const days = Array.from(selected);
        requestBody = RequestBody.forMultiple(state.anniversaryName, yearMonth, days);
      } else {
        PopupUtil.innerAlert(PopupType.INFO, "생성 실패", "날짜는 최소 한개 선택 되어야합니다.");
        return;
      }
    }

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
