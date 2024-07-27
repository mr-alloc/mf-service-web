<template>
  <div class="mission-status-timeline-container">
    <ul class="timeline-groups">
      <li class="each-case" :class="[status.simpleName, {
        current: status.code === props.status,
      }, {
        'signature-shiny': status.code === props.status
      }]" v-bind:key="status.code"
          v-on:click="() => status.code !== props.status && methods.selectStatus(status as MissionStatus)"
          v-for="status in state.missionStatuses">{{ status.name }}</li>
    </ul>
  </div>
</template>
<script setup lang="ts">
import { inject, reactive } from 'vue'
import MissionStatus from '@/constant/MissionStatus'
import PopupUtil from '@/utils/PopupUtil'
import * as ChangeFamilyMissionAttribute from '@/classes/api-spec/mission/ChangeFamilyMissionAttribute'
import { call } from '@/utils/NetworkUtil'
import Mission from '@/constant/api-meta/Mission'
import { useAlertStore } from '@/stores/AlertStore'
import MissionDetail from '@/classes/MissionDetail'

const alertStore = useAlertStore();
const emitter: any = inject("emitter");
const props = defineProps<{
  detail: MissionDetail,
  stateId: number,
  status: number,
  startStamp: number,
}>();
const state = reactive({
  missionStatuses: [MissionStatus.CREATED, MissionStatus.IN_PROGRESS, MissionStatus.COMPLETED]
});
const methods = {
  selectStatus(status: MissionStatus) {
    PopupUtil.confirm("미션 상태 변경", `${status.name}(으)로 변경하시겠습니까?`, () => {
      const requestBody = ChangeFamilyMissionAttribute.RequestBody.forStatus(props.stateId, props.detail.id, Number(status.code), props.startStamp);
      call<ChangeFamilyMissionAttribute.RequestBody, ChangeFamilyMissionAttribute.ResponseBody>(Mission.ChangeMissionAttribute, requestBody,
        (response) => {
          const responseBody = ChangeFamilyMissionAttribute.ResponseBody.fromJson(response.data);
          const changed = responseBody.changed;
          const statusCode = changed.findStateById(props.stateId)?.status ?? 0;
          const status = MissionStatus.fromCode(statusCode);
          switch (status) {
            case MissionStatus.CREATED:
              alertStore.info("미션 초기화", "미션이 사직 전 상태로 변경되었어요.")
              emitter.emit("fetchMissionDetail");
              break;
            case MissionStatus.IN_PROGRESS:
              alertStore.guide("상태 변경", `미션이 시작되었습니다. 남은 시간 안에 완료할 수 있도록 노력하세요!`);
              emitter.emit("fetchMissionDetail");
              emitter.emit("drawCalendar", true)
              break;
            case MissionStatus.COMPLETED:
              alertStore.success("미션 클리어!", `"${props.detail.name}" 미션을 완료하였습니다.`);
              emitter.emit("drawCalendar")
              break;
            default:
              break;
          }
        });
    });
  },
}
</script>
<style scoped lang="scss">
@import "@assets/main";

.mission-status-timeline-container {
  width: 100%;

  .timeline-groups {
    display: flex;
    flex-direction: row;
    justify-content: space-evenly;

    .each-case {
      font-size: .55rem;
      width: 30px;
      height: 30px;
      padding: 3px;
      border-radius: 50px;
      display: flex;
      justify-content: center;
      align-items: center;
      word-break: keep-all;
      background-color: $super-light-signature-purple;
      font-weight: bold;
      color: white;
      border: 1px solid $little-light-signature-purple;
      user-select: none;
      cursor: pointer;

      &.current {
        background-color: $signature-purple;
        cursor: default;
      }
    }
  }
}
</style>
