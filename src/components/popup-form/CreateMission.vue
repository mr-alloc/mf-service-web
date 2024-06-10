<template>
  <div class="create-mission-container">
    <div class="container-body">
      <div class="mission-form" id="create-mission-form">
        <SimpleSelector ref="missionAssigneeInput" id="mission-assignee" name="assignee" title="수행자"
                        default-option-name="멤버 선택"
                        :options="state.members" v-if="ownFamiliesStore.hasSelectFamily"/>
        <BlinkSelect ref="missionTypeInput" id="mission-type" title="미션종류" :options="state.missionOptions"
                     name="missionType"
                     :before-change="methods.changeType"/>
        <BlinkInput ref="missionTitleInput" id="mission-title" name="missionTitle" type="text" label="제목"
                    placeHolder="[11:00] 필라테스 예약"
                    :is-hold="state.inputHold" :validate="methods.validateMissionTitle"
                    warning-message="미션 제목을 입력해 주세요." :no-mark="true"/>
        <BlinkInput ref="missionContentInput" id="mission-content" name="missionContent" type="text" label="설명 (선택)"
                    placeHolder="설명을 입력해주세요."
                    :is-hold="state.inputHold" :no-mark="true"
        />
        <DatePicker ref="datePicker" :timestamp="props.timestamp"
                    :after-change-mode="methods.handleChangeScheduleMode"/>
        <TimePicker ref="timePicker" :default-value="0" v-if="state.missionType.isNotIn(MissionType.SCHEDULE)"/>
        <OptionalTimePicker ref="scheduleTimeInput" id="schedule-time" name="scheduleTime" label="일정"
                            v-if="state.missionType.isIn(MissionType.SCHEDULE)"/>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import {inject, onMounted, reactive, ref} from "vue";
import SelectOption from "@/classes/SelectOption";
import {AlertType, useAlertStore} from "@/stores/AlertStore";
import {useBackgroundStore} from "@/stores/BackgroundStore";
import Mission from "@/constant/api-meta/Mission";
import {call} from "@/utils/NetworkUtil";
import {useThrottleFn} from "@vueuse/core";
import SimpleSelector from "@/components/global/SimpleSelector.vue";
import Family from "@/constant/api-meta/Family";
import {ResponseBody} from "@/classes/api-spec/family/GetFamilyMember";
import SelectImageOption from "@/classes/api-spec/SelectImageOption";
import {useOwnFamiliesStore} from "@/stores/OwnFamiliesStore";
import {hasSelectedFamilyId} from "@/utils/LocalCache";
import LocalAsset from "@/constant/LocalAsset";
import MissionType from "@/constant/MissionType";
import OptionalTimePicker from "@/components/global/OptionalTimePicker.vue";
import {ex} from "@/utils/Undefinable";
import * as CreateMission from "@/classes/api-spec/mission/CreateMission";
import PopupUtil from "@/utils/PopupUtil";
import {PopupType} from "@/stores/status/CurrentPopup";
import DatePicker from "@/components/global/DatePicker.vue";
import ScheduleMode from "@/constant/ScheduleMode";
import TimePicker from "@/components/global/TimePicker.vue";
import type {DatePickerExpose, TimePickerExpose} from "@/types/ExposeType";
import MultipleModeOutput from "@/classes/component-protocol/MultipleModeOutput";
import type InputComponent from "@/classes/InputComponent";
import type NumberValueComponent from "@/classes/NumberValueComponent";
import {useCalendarStore} from "@/stores/CalendarStore";

const missionAssigneeInput = ref<NumberValueComponent | null>(null);
const missionTypeInput = ref<NumberValueComponent | null>(null);
const missionTitleInput = ref<InputComponent | null>(null);
const missionContentInput = ref<InputComponent | null>(null);
const scheduleTimeInput = ref<NumberValueComponent | null>(null);
const datePicker = ref<DatePickerExpose | null>(null);
const timePicker = ref<TimePickerExpose | null>(null);

const calendarStore = useCalendarStore();
const alertStore = useAlertStore();
const backgroundStore = useBackgroundStore();
const ownFamiliesStore = useOwnFamiliesStore();
const emitter: any = inject("emitter");

onMounted(() => {
  methods.setMembers()

  emitter.on("validateCreateMissionForm", useThrottleFn(() => {
    methods.checkAllInput();

    if (!state.isSubmittable) {
      PopupUtil.innerAlert(PopupType.INFO, "생성 실패", "입력값을 확인해주세요.");
      return;
    }

    const requestBody = methods.getRequestBody();
    if (ex(requestBody).no()) {
      return;
    }

    call<CreateMission.RequestBody, CreateMission.ResponseBody>(Mission.CreateMission, requestBody, (response) => {
      const responseBody = CreateMission.ResponseBody.fromJson(response.data);
      calendarStore.addMissions(responseBody.created);
      alertStore.success("미션 생성 완료!", `"${requestBody.name}" 미션을 생성하였습니다.`);
      emitter.emit("drawMemberCalendar")
      //이벤트 발행 취소
      emitter.off("validateCreateMissionForm")
      backgroundStore.returnGlobalPopup();
    });

  }, 2000))
});


const props = defineProps<{
  timestamp: number,
  days?: number
}>();

const inputValues = reactive({
  assignee: 0,
  missionTitle: "",
  missionContent: "",
  missionDeadline: 0,
  scheduleTime: 0,
});
const state = reactive({
  scheduleMode: ScheduleMode.SINGLE,
  missionType: MissionType.SCHEDULE,

  inputHold: false,
  isSubmittable: false,

  //인풋 상태
  isValidTitle: false,
  isValidAssignee: false,
  isValidDeadline: false,
  isValidSchedule: false,

  //미션 종류
  missionOptions: MissionType.values().map(MissionType.toSelectOption),
  deadlineOptions: [
    new SelectOption("3600", "한시간"),
    new SelectOption("21600", "6시간"),
    new SelectOption("86400", "하루"),
    new SelectOption("604800", "일주일"),
    new SelectOption("2592000", "30일"),
  ],
  members: [SelectImageOption.of(0, "멤버선택", LocalAsset.DEFAULT_NO_IMAGE)],
  defaultDeadline: "",
});

const methods = {
  validateMissionTitle() {
    const input: HTMLInputElement = document.getElementById("mission-title") as HTMLInputElement;
    state.isValidTitle = input.value.length !== 0;

    if (!state.isValidTitle) {
      input.focus();
    }
    return state.isValidTitle;
  },
  validateAssignee() {
    state.isValidAssignee = !ownFamiliesStore.hasSelectFamily || inputValues.assignee !== 0;
    if (!state.isValidAssignee) {
      PopupUtil.innerAlert(PopupType.INFO, "수행자 미지정", "수행자를 선택해 주세요.");
    }
    return state.isValidAssignee;
  },
  validateDeadline() {
    state.isValidDeadline = state.missionType !== MissionType.SCHEDULE || inputValues.missionDeadline > 0;
    if (!state.isValidDeadline) {
      alertStore.alert(AlertType.INFO, "생성 가이드", "기한을 선택해 주세요.")
    }

    return state.isValidDeadline;
  },
  validateSchedule() {

  },
  checkAllInput() {
    inputValues.assignee = ex(missionAssigneeInput.value?.getValue()).num();
    inputValues.missionTitle = ex(missionTitleInput.value?.input.value).str();
    inputValues.missionContent = ex(missionContentInput.value?.input.value).str();
    inputValues.missionDeadline = ex(timePicker.value?.getValue()).num();
    inputValues.scheduleTime = ex(scheduleTimeInput.value?.getValue()).num();

    state.isSubmittable = methods.validateMissionTitle() && methods.validateAssignee() && methods.validateDeadline()
  },
  dayToSecond(day: string) {
    return day ? (parseInt(day) * 24 * 60 * 60).toString() : '';
  },
  setMembers() {
    if (hasSelectedFamilyId()) {
      call<any, ResponseBody>(Family.GetFamilyMembers, {}, (response) => {
        const responseBody = ResponseBody.fromJson(response.data);
        responseBody.members.forEach((member) => state.members.push(member.toSelectImageOption()));
      })
    }
  },
  changeType(option: SelectOption, afterChange: () => void) {
    //셀렉터 상태변경
    afterChange();
    //화면상태 변경
    state.missionType = MissionType.fromValue(parseInt(ex(missionTypeInput?.value?.getValue()).str()));
  },
  handleChangeScheduleMode(mode: ScheduleMode) {
    state.scheduleMode = mode;
  },
  getRequestBody(): CreateMission.RequestBody {
    const deadline = state.missionType.value === MissionType.SCHEDULE.value ? 0 : timePicker.value?.getValue();
    const isSingleSchedule = datePicker.value?.getScheduleMode().value === ScheduleMode.SINGLE.value;
    const scheduleInfo = isSingleSchedule
        ? new MultipleModeOutput(new Set([props.timestamp]))
        : datePicker.value?.extractResult()!;

    scheduleInfo?.applyToEachSelected((selected) => selected + inputValues.scheduleTime)

    return new CreateMission.RequestBody(
        inputValues.missionTitle,
        inputValues.missionContent,
        inputValues.assignee,
        state.missionType.value,
        scheduleInfo,
        deadline
    )
  }
}
</script>
<style scoped lang="scss">
@import "@/assets/main.scss";

.create-mission-container {
  display: flex;
  justify-content: center;
  padding: 20px;
  max-height: 50vh;
  overflow-y: scroll;

  .container-body {
    min-width: 400px;

    .mission-from {
    }
  }
}
</style>
