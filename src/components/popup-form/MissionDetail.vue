<template>
  <div class="mission-detail-container">
    <div class="detail-header-wrapper">
      <ModifiableTitle :title="state.detail.name" :before-change="methods.modifyTitle"/>
      <ExpandableFeatureMenuButton :icon="['fas', 'ellipsis-vertical']" :executable-features="state.features"/>
    </div>
    <ul class="detail-specifications-group">
      <li class="detail-pair" v-if="MissionStatus.fromCode(state.detail.status).isNotIn(MissionStatus.ALWAYS)">
        <div class="detail-title">
          <span>미션 종류</span>
        </div>
        <div class="detail-content">
          <BlinkSelect id="mission-type" :options="state.typeOptions" :before-change="methods.selectType"
                       :current-index="state.typeOptions.findIndex(option => option.value === `${state.detail?.type}`)"/>
        </div>
      </li>
      <li class="detail-pair" v-if="MissionStatus.fromCode(state.detail.status).isNotIn(MissionStatus.ALWAYS)">
        <div class="detail-title">
          <span>미션 상태</span>
        </div>
        <div class="detail-content">
          <SimpleRadio id="mission-status" :options="state.statusOptions" :before-change="methods.selectStatus"
                       :current-index="state.statusOptions.findIndex(option => option.value === `${state.detail?.status ?? 0}`)"/>
        </div>
      </li>
      <li class="detail-pair"
          v-if="ownFamiliesStore.hasSelectFamily && MissionStatus.fromCode(state.detail.status).isNotIn(MissionStatus.ALWAYS)">
        <div class="detail-title">
          <span>미션 수행자</span>
        </div>
        <div class="detail-content">
          <SimpleSelector default-option-name="멤버 선택" :before-change="methods.selectMember" id="assignee"
                          :options="state.members" v-if="ownFamiliesStore.hasSelectFamily"
                          :current-index="state.members.findIndex(member => member.id === state.detail.assignee)"/>
        </div>
      </li>
      <li class="detail-pair"
          v-if="ownFamiliesStore.hasSelectFamily && MissionStatus.fromCode(state.detail.status).isNotIn(MissionStatus.ALWAYS)">
        <div class="detail-title">
          <span>미션 생성자</span>
        </div>
        <div class="detail-content">
          <ImageNicknamePair
              :option="state.members.find(member => member.id === state.detail.reporter) ?? SelectImageOption.of(0, '', LocalAsset.DEFAULT_USER_PROFILE)"/>
        </div>
      </li>
    </ul>
    <div class="deadline-timer">
      <div class="timer-count-wrapper">
        <span class="guide-text signature-shiny">남은 시간</span>
        <span class="remain-time">{{ state.remainTimeStr }}</span>
      </div>
      <div class="fuse-wire-wrapper">
        <span class="progress-fuse-wire"></span>
      </div>
    </div>
    <BlinkTextArea id="description" name="description" label="설명" default-value="무슨일을 하든 돕기"/>
  </div>
</template>
<script setup lang="ts">
import {inject, onMounted, reactive} from "vue";
import {useOwnFamiliesStore} from "@/stores/OwnFamiliesStore";
import SimpleSelector from "@/components/global/SimpleSelector.vue";
import SelectImageOption from "@/classes/api-spec/SelectImageOption";
import ImageNicknamePair from "@/components/global/ImageNicknamePair.vue";
import SelectOption from "@/classes/SelectOption";
import SimpleRadio from "@/components/global/SimpleRadio.vue";
import BlinkTextArea from "@/components/global/BlinkTextArea.vue";
import PopupUtil from "@/utils/PopupUtil";
import {useAlertStore} from "@/stores/AlertStore";
import {call} from "@/utils/NetworkUtil";
import * as ChangeFamilyMissionAttribute from "@/classes/api-spec/mission/ChangeFamilyMissionAttribute";
import * as GetMissionDetail from "@/classes/api-spec/mission/GetMissionDetail";
import {MissionDetail} from "@/classes/api-spec/mission/GetMissionDetail";
import * as DeleteMission from "@/classes/api-spec/mission/DeleteMission";
import {useBackgroundStore} from "@/stores/BackgroundStore";
import LocalAsset from "@/constant/LocalAsset";
import Mission from "@/constant/api-meta/Mission";
import MissionStatus from "@/constant/MissionStatus";
import ModifiableTitle from "@/components/global/ModifiableTitle.vue";
import TemporalUtil from "../../utils/TemporalUtil";
import ExpandableFeatureMenuButton from "@/components/global/ExpandableFeatureMenuButton.vue";
import ExecutableFeature from "@/classes/api-spec/ExecutableFeature";
import MissionType from "@/constant/MissionType";


const emitter = inject("emitter");
const backgroundStore = useBackgroundStore();
const ownFamiliesStore = useOwnFamiliesStore();
const alertStore = useAlertStore();
const props = defineProps({
  missionId: Number
});

const methods = {
  selectType(option: SelectOption, afterChange: () => void) {
    PopupUtil.innerConfirm("미션종류 변경", `${option.text}(으)로 변경 하시겠습니까?`, () => {
      const requestBody = ChangeFamilyMissionAttribute.RequestBody.forType(props.missionId!, parseInt(option.value));
      call<ChangeFamilyMissionAttribute.RequestBody, ChangeFamilyMissionAttribute.ResponseBody>(Mission.ChangeMissionAttribute, requestBody, (response) => {
        const responseBody = ChangeFamilyMissionAttribute.ResponseBody.fromJson(response.data);
        if (responseBody.type === parseInt(option.value)) {
          alertStore.success("미션 종류 변경", `미션 종류가 변경 되었어요.`);
          afterChange();
        } else {
          alertStore.warning("미션 종류 변경", `미션 종류 변경에 실패했어요.`);
        }
      });
    });

  },
  modifyTitle(title: string, afterChange: (isRollback: boolean) => void) {
    if (state.detail.name === title) {
      afterChange(false);
      return;
    }
    PopupUtil.innerConfirm("미션명 변경", `미션 이름을 변경하시겠습니까?`, () => {
      const requestBody = ChangeFamilyMissionAttribute.RequestBody.forName(props.missionId!, title);
      call<ChangeFamilyMissionAttribute.RequestBody, ChangeFamilyMissionAttribute.ResponseBody>(Mission.ChangeMissionAttribute, requestBody, (response) => {
        const responseBody = ChangeFamilyMissionAttribute.ResponseBody.fromJson(response.data);
        if (responseBody.title === title) {
          alertStore.success("이름 변경", '미션명이 변경 되었어요.');
          afterChange(false);
        } else {
          alertStore.warning("이름 변경", `미션명 변경에 실패했어요.`);
          afterChange(true)
        }
      })
    }, () => afterChange(true));
  },
  selectMember(member: SelectImageOption, afterChange: () => void) {
    PopupUtil.innerConfirm("미션 수행자 변경", `${member.name}님을 미션 수행자로 지정하시겠습니까?`, () => {
      const requestBody = ChangeFamilyMissionAttribute.RequestBody.forAssignee(props.missionId!, member.id);

      call<ChangeFamilyMissionAttribute.RequestBody, ChangeFamilyMissionAttribute.ResponseBody>(Mission.ChangeMissionAttribute, requestBody, (response) => {
        const responseBody = ChangeFamilyMissionAttribute.ResponseBody.fromJson(response.data);
        if (responseBody.assignee === member.id) {
          alertStore.success("수행자 변경", `${member.name}님을 미션 수행자로 지정하였습니다.`);
          afterChange();
        } else {
          alertStore.warning("수행자 변경", `${member.name}님을 미션 수행자로 지정하지 못했습니다.`);
        }
      });
    });
  },
  selectStatus(option: SelectOption, afterChange: () => void) {
    PopupUtil.innerConfirm("미션 상태 변경", `${option.text}(으)로 변경하시겠습니까?`, () => {
      const requestBody = ChangeFamilyMissionAttribute.RequestBody.forStatus(props.missionId!, Number(option.value));
      call<ChangeFamilyMissionAttribute.RequestBody, ChangeFamilyMissionAttribute.ResponseBody>(Mission.ChangeMissionAttribute, requestBody,
          (response) => {
            const responseBody = ChangeFamilyMissionAttribute.ResponseBody.fromJson(response.data);
            const statusCode = responseBody.status;
            const status = MissionStatus.fromCode(statusCode);
            switch (status) {
              case MissionStatus.CREATED:
                alertStore.info("미션 초기화", "미션이 사직 전 상태로 변경되었어요.")
                methods.fetchMissionDetail();
                break;
              case MissionStatus.IN_PROGRESS:
                alertStore.guide("상태 변경", `미션이 시작되었습니다. 남은 시간 안에 완료할 수 있도록 노력하세요!`);
                methods.fetchMissionDetail();
                emitter.emit("drawMemberCalendar")
                break;
              case MissionStatus.COMPLETED:
                alertStore.success("미션 클리어!", `"${state.detail.name}" 미션을 완료하였습니다.`);
                emitter.emit("drawMemberCalendar")
                backgroundStore.returnGlobalPopup();
                break;
              default:
                break;
            }
          });
    });
  },
  deleteMission(event?: Event) {
    PopupUtil.innerConfirm("미션 삭제", "미션을 삭제하시겠습니까?", () => {
      call<any, DeleteMission.ResponseBody>(Mission.DeleteMission, {missionId: props.missionId},
          (response) => {
            const responseBody = DeleteMission.ResponseBody.fromJson(response.data);
            if (props.missionId === responseBody.missionId) {
              alertStore.success("미션 삭제", "미션을 삭제하였습니다.");
              backgroundStore.returnGlobalPopup();
              emitter.emit("drawMemberCalendar");
            } else {
              alertStore.warning("미션 삭제", "미션을 삭제하지 못했습니다.");
            }
          });
    });
  },
  calcRemainTime(currentStatus: MissionStatus) {
    switch (currentStatus) {
      case MissionStatus.COMPLETED:
        state.remainTimeStr = '완료';
        return;
    }
    state.remainTimeStr = TemporalUtil.secondsToTimeStr(state.remainSeconds--);
  },
  countRemainTime() {
    state.remainSeconds = state.detail.remainSeconds;
    const currentStatus = MissionStatus.fromCode(state.detail.status);
    methods.calcRemainTime(currentStatus);
    if (currentStatus === MissionStatus.IN_PROGRESS) {
      setInterval(methods.calcRemainTime, 1000);
    }
  },
  fetchMissionDetail() {
    call<any, GetMissionDetail.ResponseBody>(Mission.GetMissionDetail, {missionId: props.missionId}, (response) => {
      const responseBody = GetMissionDetail.ResponseBody.fromJson(response.data);
      state.detail = responseBody.mission;
      backgroundStore.readyPopup();
      methods.countRemainTime();
    });
  }
}
const state = reactive({
  members: ownFamiliesStore.members.map(member => member.toSelectImageOption()),
  statusOptions: MissionStatus.values().filter(MissionStatus.NOT_DELETED_FILTER).map(MissionStatus.toSelectOption),
  typeOptions: MissionType.values().map(MissionType.toSelectOption),
  features: [
    new ExecutableFeature('삭제', methods.deleteMission)
  ],
  detail: {} as MissionDetail,
  remainSeconds: 0,
  remainTimeStr: '00:00:00'
});
onMounted(() => {
  methods.fetchMissionDetail();
});
</script>
<style scoped lang="scss">
@import "@/assets/main";

.mission-detail-container {
  width: 568px;

  .detail-header-wrapper {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
  }

  .detail-specifications-group {
    display: flex;
    flex-direction: row;
    margin: 20px 0;
    justify-content: flex-start;
    border: 1px solid $standard-light-gray-in-white;
    border-radius: 10px;
    width: max-content;

    .detail-pair {
      display: flex;
      flex-direction: column;
      width: max-content;
      border-collapse: collapse;
      border-radius: 5px;

      .detail-title {
        overflow: hidden;
        font-weight: bold;
        font-size: .94rem;
        display: flex;
        justify-content: flex-start;
        align-items: center;
        background-color: $standard-gray-in-white;
        padding: 0 5px;
        flex-shrink: 0;
      }

      .detail-content {
        flex-grow: 1;
        display: flex;
        flex-direction: row;
        justify-content: center;
        align-items: center;
        padding: 3px;
      }

      &:first-child {
        .detail-title {
          border-top-left-radius: 5px;
        }
      }

      &:not(:last-child) {
        border-right: 1px solid $standard-light-gray-in-white;
      }

      &:last-child {
        .detail-title {
          border-top-right-radius: 5px;
        }
      }
    }
  }

  .deadline-timer {

    .timer-count-wrapper {
      display: flex;
      flex-direction: row;
      align-items: center;

      .guide-text {
        font-size: .84rem;
        font-weight: bold;
        margin-right: 5px;
        background-color: $signature-purple;
        color: white;
        padding: 3px 5px;
        border-radius: 5px;
      }

      .remain-time {
        padding: 0 20px;
        font-size: 1.2rem;
        font-weight: bold;

        &.normal {
          color: $soft-green;
        }

        &.little-urgent {
          color: $soft-orange;
        }

        &.urgent {
          color: $soft-red;
        }


        &.overdue {
          color: $standard-gray-in-white;
        }
      }
    }

    .fuse-wire-wrapper {

      .progress-fuse-wire {

      }
    }
  }
}
</style>
