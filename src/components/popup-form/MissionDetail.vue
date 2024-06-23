<template>
  <div class="mission-detail-container">
    <div class="detail-header-wrapper" v-if="state.detail">
      <ModifiableTitle :title="state.detail.name" :before-change="methods.modifyTitle"/>
      <ExpandableFeatureMenuButton :icon="['fas', 'ellipsis-vertical']" :executable-features="state.features"/>
    </div>
    <MissionState v-if="state.detail" :detail="state.detail" :status="state.status" :members="state.members"/>
    <MissionComments v-if="state.detail" :mission="props.mission" :detail="state.detail"/>
    <div class="deadline-timer"
         v-if="state.detail && MissionType.fromValue(state.detail.type).isNotIn(MissionType.SCHEDULE)">
      <div class="timer-count-wrapper">
        <span class="guide-text signature-shiny">남은 시간</span>
        <span class="remain-time">{{ state.remainTimeStr }}</span>
      </div>
      <div class="fuse-wire-wrapper">
        <span class="progress-fuse-wire"></span>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import {inject, onBeforeMount, reactive} from "vue";
import {useOwnFamiliesStore} from "@/stores/OwnFamiliesStore";
import PopupUtil from "@/utils/PopupUtil";
import {useAlertStore} from "@/stores/AlertStore";
import {call} from "@/utils/NetworkUtil";
import * as ChangeFamilyMissionAttribute from "@/classes/api-spec/mission/ChangeFamilyMissionAttribute";
import * as GetMissionDetail from "@/classes/api-spec/mission/GetMissionDetail";
import * as DeleteMission from "@/classes/api-spec/mission/DeleteMission";
import {useBackgroundStore} from "@/stores/BackgroundStore";
import Mission from "@/constant/api-meta/Mission";
import MissionStatus from "@/constant/MissionStatus";
import ModifiableTitle from "@/components/global/ModifiableTitle.vue";
import TemporalUtil from "../../utils/TemporalUtil";
import ExpandableFeatureMenuButton from "@/components/global/ExpandableFeatureMenuButton.vue";
import ExecutableFeature from "@/classes/api-spec/ExecutableFeature";
import MissionType from "@/constant/MissionType";
import type MissionDetail from "@/classes/MissionDetail";
import MissionState from "@/components/mission/MissionState.vue";
import MissionComments from "@/components/mission/MissionComments.vue";
import CalendarWeekMission from "@/classes/CalendarWeekMission";
import {useFamiliesViewStore} from "@/stores/FamiliesViewStore";


const emitter: any = inject("emitter");
const backgroundStore = useBackgroundStore();
const ownFamiliesStore = useOwnFamiliesStore();
const familiesViewStore = useFamiliesViewStore();
const alertStore = useAlertStore();
const props = defineProps<{
  mission: CalendarWeekMission
}>();

const methods = {
  modifyTitle(title: string, afterChange: (isRollback: boolean) => void) {
    if (state.detail?.name === title) {
      afterChange(false);
      return;
    }
    PopupUtil.confirm("미션명 변경", `미션 이름을 "${title}"으로 변경하시겠습니까?`, () => {
      const requestBody = ChangeFamilyMissionAttribute.RequestBody.forName(props.mission.mission.id, title);
      call<ChangeFamilyMissionAttribute.RequestBody, ChangeFamilyMissionAttribute.ResponseBody>(Mission.ChangeMissionAttribute, requestBody, (response) => {
        const responseBody = ChangeFamilyMissionAttribute.ResponseBody.fromJson(response.data);
        const changed = responseBody.changed;
        console.log(`changed: ${changed.name}, title: ${title} = ${changed.name === title}`);
        if (changed.name === title) {
          alertStore.success("이름 변경", '미션명이 변경 되었어요.');
          state.detail = responseBody.changed;
          emitter.emit("drawCalendar");
          afterChange(false);
        } else {
          alertStore.warning("이름 변경", `미션명 변경에 실패했어요.`);
          afterChange(true)
        }
      })
    }, () => afterChange(true));
  },
  deleteMission(event?: Event) {
    PopupUtil.innerConfirm("미션 삭제", "미션을 삭제하시겠습니까?", () => {
      call<any, DeleteMission.ResponseBody>(Mission.DeleteMission, {missionId: props.mission.mission.id},
          (response) => {
            const responseBody = DeleteMission.ResponseBody.fromJson(response.data);
            if (props.mission.mission.id === responseBody.missionId) {
              alertStore.success("미션 삭제", "미션을 삭제하였습니다.");
              emitter.emit("drawCalendar");
              emitter.emit("resetComponent");
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
    // state.remainSeconds = state.detail.remainSeconds;
    state.remainSeconds = 0;
    const currentStatus = MissionStatus.fromCode(state.status);
    methods.calcRemainTime(currentStatus);
    if (currentStatus === MissionStatus.IN_PROGRESS) {
      setInterval(methods.calcRemainTime, 1000);
    }
  },
  async fetchMissionDetail() {
    await call<any, GetMissionDetail.ResponseBody>(Mission.GetMissionDetail, {missionId: props.mission.mission.id}, (response) => {
      const responseBody = GetMissionDetail.ResponseBody.fromJson(response.data);
      state.detail = responseBody.mission;
      const missionState = state.detail.states.find(state => state.startAt === props.mission.startAt);
      state.stateId = missionState?.id ?? 0;
      state.status = missionState?.status ?? 0;
      backgroundStore.readyPopup();
      methods.countRemainTime();
    });
  }
}

const state = reactive({
  members: familiesViewStore.members.map(member => member.toSelectImageOption()),
  statusOptions: MissionStatus.values().filter(MissionStatus.NOT_DELETED_FILTER).map(MissionStatus.toSelectOption),
  typeOptions: MissionType.values().map(MissionType.toSelectOption),
  features: [
    new ExecutableFeature('삭제', methods.deleteMission)
  ],
  detail: null as MissionDetail | null,
  stateId: 0,
  status: 0,
  remainSeconds: 0,
  remainTimeStr: '00:00:00'
});
onBeforeMount(async () => {
  await methods.fetchMissionDetail();
});
</script>
<style scoped lang="scss">
@import "@/assets/main";

.mission-detail-container {

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
