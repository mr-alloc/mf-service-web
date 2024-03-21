<template>
  <div class="create-mission-container">
    <div class="container-body">
      <div class="mission-form" id="create-mission-form">
        <BlinkSelect id="mission-type" title="미션종류" :options="state.missionOptions" name="missionType"/>
        <BlinkInput id="mission-title" name="missionTitle" type="text" label="제목" placeHolder="미션 제목"
                    :is-hold="state.inputHold" :validate="methods.validateMissionTitle"
                    warning-message="미션 제목을 입력해 주세요." :no-mark="true"
        />
        <BlinkInput id="mission-content" name="missionContent" type="text" label="부제 (옵션)" placeHolder="미션 부제"
                    :is-hold="state.inputHold" :no-mark="true"
        />
        <SimpleRadio id="mission-deadline" :options="state.deadlineOptions" label="기한"
                     :etc-option="new SelectOption('0', '기타(일)')"
                     etc-placeholder="일단위 입력" :etc-value-function="(day: string) => methods.dayToSecond(day)"/>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import {inject, onMounted, reactive} from "vue";
import SelectOption from "@/classes/SelectOption";
import SimpleRadio from "@/components/global/SimpleRadio.vue";
import {NotificationType, useNotificationStore} from "@/stores/NotificationStore";
import {useBackgroundStore} from "@/stores/BackgroundStore";
import DocumentUtil from "@/utils/DocumentUtil";
import Mission from "@/constant/api-meta/Mission";
import {call} from "@/utils/NetworkUtil";
import {useThrottleFn} from "@vueuse/core";

const notificationStore = useNotificationStore();
const backgroundStore = useBackgroundStore();
const emitter = inject("emitter");

const state = reactive({
  inputHold: false,
  isSubmittable: false,

  //인풋 상태
  missionNameInputValidate: false,
  missionContentInputValidate: false,

  //미션 종류
  missionOptions: [
    new SelectOption("1", "미션"),
    new SelectOption("2", "미션팩"),
    new SelectOption("3", "스텝미션"),
    new SelectOption("4", "타임미션"),
    new SelectOption("5", "프로젝트"),
    new SelectOption("6", "비밀(랜덤 등장)"),
    new SelectOption("7", "서프라이즈"),
    new SelectOption("8", "고정(매일, 매주, 매월)"),
    new SelectOption("9", "간격미션(시간간격)")
  ],
  deadlineOptions: [
    new SelectOption("3600", "한시간"),
    new SelectOption("21600", "6시간"),
    new SelectOption("86400", "하루"),
    new SelectOption("604800", "일주일"),
    new SelectOption("2592000", "30일"),
  ]
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
  }
}


onMounted(() => {
  emitter.on("validateCreateMissionForm", useThrottleFn(() => {
    methods.checkAllInput();
    if (!state.isSubmittable) {
      notificationStore.notice(NotificationType.INFO, "생성 가이드", "입력되지 않은 값이 있는것 같아요! 한번 더 확인후 생성해주세요!")
      return;
    }

    const missionTitleInput = DocumentUtil.getHtmlElementById<HTMLInputElement>("mission-title");
    const missionContentInput = DocumentUtil.getHtmlElementById<HTMLInputElement>("mission-content");
    const missionTypeSelect = DocumentUtil.getHtmlElementById<HTMLSelectElement>("mission-type");
    const missionDeadlineInput = DocumentUtil.getHtmlElementById<HTMLInputElement>("mission-deadline");

    const requestBody = {
      missionName: missionTitleInput.value,
      missionSubName: missionContentInput.value,
      missionType: missionTypeSelect.value,
      deadline: missionDeadlineInput.value
    }

    if (missionDeadlineInput.value === '') {
      notificationStore.notice(NotificationType.INFO, "생성 가이드", "기한을 선택해 주세요.")
      return;
    }

    call(Mission.CreateMission, requestBody, (response) => {
          const missionName = missionTitleInput.value;
          notificationStore.notice(NotificationType.SUCCESS, "미션 생성 완료!", `"${missionName}" 미션을 생성하였습니다.`);
          emitter.emit("drawMemberCalendar")
          //이벤트 발행 취소
          emitter.off("validateCreateMissionForm")
          backgroundStore.returnGlobalPopup();
        },
        (spec, error) => {
          const body = error.response.data;
          const message = spec.getMessage(body.code);
          notificationStore.notice(NotificationType.WARNING, "미션 생성 오류", message);
        }
    )

  }, 2000))
})
</script>
<style scoped lang="scss">
@import "@/assets/main.scss";

.create-mission-container {
  display: flex;
  justify-content: center;
  align-items: center;

  .container-body {
  }
}
</style>
