<template>
  <div class="create-mission-container">
    <div class="container-body">
      <div class="mission-form" id="create-mission-form">
        <SimpleSelector id="mission-assignee" name="assignee" title="수행자" default-option-name="멤버 선택"
                        :options="state.members" v-if="ownFamiliesStore.hasSelectFamily"/>
        <BlinkSelect id="mission-type" title="미션종류" :options="state.missionOptions" name="missionType"
                     :before-change="methods.changeType"/>
        <BlinkInput id="mission-title" name="missionTitle" type="text" label="제목" placeHolder="[11:00] 필라테스 예약"
                    :is-hold="state.inputHold" :validate="methods.validateMissionTitle"
                    warning-message="미션 제목을 입력해 주세요." :no-mark="true"
        />
        <BlinkInput id="mission-content" name="missionContent" type="text" label="설명 (선택)" placeHolder="설명을 입력해주세요."
                    :is-hold="state.inputHold" :no-mark="true"
        />
        <OptionalTimePicker id="schedule-time" name="scheduleTime" label="일정"/>
        <SimpleRadio id="mission-deadline" :options="state.deadlineOptions" label="기한 (미션 시작시 적용)"
                     :etc-option="new SelectOption('0', '기타(일)')"
                     v-if="state.missionType.isNotIn(MissionType.SCHEDULE)"
                     etc-placeholder="일단위 입력" :etc-value-function="(day: string) => methods.dayToSecond(day)"/>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import {inject, onMounted, reactive} from "vue";
import SelectOption from "@/classes/SelectOption";
import SimpleRadio from "@/components/global/SimpleRadio.vue";
import {AlertType, useAlertStore} from "@/stores/AlertStore";
import {useBackgroundStore} from "@/stores/BackgroundStore";
import DocumentUtil from "@/utils/DocumentUtil";
import Mission from "@/constant/api-meta/Mission";
import {call} from "@/utils/NetworkUtil";
import {useThrottleFn} from "@vueuse/core";
import SimpleSelector from "@/components/global/SimpleSelector.vue";
import Family from "@/constant/api-meta/Family";
import {ResponseBody} from "@/classes/api-spec/family/GetFamilyMember";
import SelectImageOption from "@/classes/api-spec/SelectImageOption";
import {useOwnFamiliesStore} from "@/stores/OwnFamiliesStore";
import {hasSelectedFamilyId} from "@/utils/LocalCache";
import DateUtil from "@/utils/DateUtil";
import LocalAsset from "@/constant/LocalAsset";
import MissionType from "@/constant/MissionType";
import OptionalTimePicker from "@/components/global/OptionalTimePicker.vue";

const alertStore = useAlertStore();
const backgroundStore = useBackgroundStore();
const ownFamiliesStore = useOwnFamiliesStore();
const emitter = inject("emitter");
const props = defineProps({
  startDate: String
})
const state = reactive({
  missionType: MissionType.SCHEDULE,

  inputHold: false,
  isSubmittable: false,

  //인풋 상태
  missionNameInputValidate: false,
  missionContentInputValidate: false,

  //미션 종류
  missionOptions: MissionType.values().map(MissionType.toSelectOption),
  deadlineOptions: [
    new SelectOption("3600", "한시간"),
    new SelectOption("21600", "6시간"),
    new SelectOption("86400", "하루"),
    new SelectOption("604800", "일주일"),
    new SelectOption("2592000", "30일"),
  ],
  members: [SelectImageOption.of(0, "멤버선택", LocalAsset.DEFAULT_NO_IMAGE)]
});

const methods = {
  validateMissionTitle() {
    const input: HTMLInputElement = document.getElementById("mission-title") as HTMLInputElement;
    state.missionNameInputValidate = input.value.length !== 0;

    if (!state.missionNameInputValidate) {
      input.focus();
    }
    return state.missionNameInputValidate;
  },
  checkAllInput() {
    methods.validateMissionTitle();
    state.isSubmittable = state.missionNameInputValidate
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
    state.missionType = MissionType.fromValue(parseInt(option.value));
    //셀렉터 상태변경
    afterChange();
    //화면상태 변경
  }
}


onMounted(() => {
  methods.setMembers()

  emitter.on("validateCreateMissionForm", useThrottleFn(() => {
    methods.checkAllInput();
    if (!state.isSubmittable) {
      alertStore.alert(AlertType.INFO, "생성 가이드", "입력되지 않은 값이 있는것 같아요! 한번 더 확인후 생성해주세요!")
      return;
    }

    const missionTitleInput = DocumentUtil.getHtmlElementById<HTMLInputElement>("mission-title");
    const missionContentInput = DocumentUtil.getHtmlElementById<HTMLInputElement>("mission-content");
    const missionTypeSelect = DocumentUtil.getHtmlElementById<HTMLSelectElement>("mission-type");
    const assigneeInput = DocumentUtil.getHtmlElementById<HTMLSelectElement>("mission-assignee");
    const missionDeadlineInput = DocumentUtil.getHtmlElementById<HTMLInputElement>("mission-deadline");

    const requestBody = {
      name: missionTitleInput.value,
      subName: missionContentInput.value,
      assignee: parseInt(assigneeInput?.value),
      type: missionTypeSelect.value,
      startDate: DateUtil.toUtc(props.startDate ?? DateUtil.getTodayStr(DateUtil.DEFAULT_DATE_FORMAT), DateUtil.DEFAULT_DATE_FORMAT),
      deadline: missionDeadlineInput?.value
    }
    if (assigneeInput?.value === '0') {
      alertStore.info("수행자 미지정", "수행자를 선택해 주세요.");
      return;
    }

    if (missionDeadlineInput?.value === '') {
      alertStore.alert(AlertType.INFO, "생성 가이드", "기한을 선택해 주세요.")
      return;
    }

    call<any, any>(Mission.CreateMission, requestBody, (response) => {
          const missionName = missionTitleInput.value;
          alertStore.alert(AlertType.SUCCESS, "미션 생성 완료!", `"${missionName}" 미션을 생성하였습니다.`);
          emitter.emit("drawMemberCalendar")
          //이벤트 발행 취소
          emitter.off("validateCreateMissionForm")
          backgroundStore.returnGlobalPopup();
        },
        (spec, error) => {
          const body = error.response.data;
          const message = spec.getMessage(body.code);
          alertStore.alert(AlertType.WARNING, "미션 생성 오류", message);
        }
    )

  }, 2000))
});
</script>
<style scoped lang="scss">
@import "@/assets/main.scss";

.create-mission-container {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px;
}
</style>
