<template>
  <div class="mission-state-changer-container">
    <SimpleButton :button-name="methods.getButtonName()"
                  :click-behavior="methods.changeStatus"
                  :submittable="state.nextStatus.code !== MissionStatus.DELETED.code" />
  </div>
</template>
<script setup lang="ts">
import { inject, onMounted, reactive } from 'vue'
import MissionStatus from '@/constant/MissionStatus'
import PopupUtil from '@/utils/PopupUtil'
import * as ChangeFamilyMissionAttribute from '@/classes/api-spec/mission/ChangeFamilyMissionAttribute'
import { call } from '@/utils/NetworkUtil'
import Mission from '@/constant/api-meta/Mission'
import { useAlertStore } from '@/stores/AlertStore'
import type MissionDetail from '@/classes/MissionDetail'
import SimpleButton from '@/components/global/SimpleButton.vue'

const alertStore = useAlertStore();
const emitter: any = inject('emitter');
const props = defineProps<{
  status: MissionStatus,
  stateId: number,
  detail: MissionDetail,
  startStamp: number
}>();
const methods = {
  changeStatus(event: PointerEvent) {
    const message = methods.getNextStatusMessage();
    if (state.nextStatus.code === MissionStatus.DELETED.code) {
      return;
    }
    PopupUtil.confirm("미션 상태 변경", message, () => {
      const requestBody = ChangeFamilyMissionAttribute.RequestBody.forStatus(props.stateId, props.detail.id, state.nextStatus.code, props.startStamp);
      call<ChangeFamilyMissionAttribute.RequestBody, ChangeFamilyMissionAttribute.ResponseBody>(Mission.ChangeMissionAttribute, requestBody,
        (response) => {
          const responseBody = ChangeFamilyMissionAttribute.ResponseBody.fromJson(response.data);
          const changed = responseBody.changed;
          const statusCode = changed.findStateById(props.stateId)?.status ?? 0;
          const status = MissionStatus.fromCode(statusCode);
          switch (status) {
            case MissionStatus.IN_PROGRESS:
              alertStore.guide("상태 변경", `미션이 시작되었습니다. 남은 시간 안에 완료할 수 있도록 노력하세요!`);
              emitter.emit("fetchMissionDetail");
              emitter.emit('fetchCalendar', true)
              break;
            case MissionStatus.COMPLETED:
              alertStore.success("미션 클리어!", `"${props.detail.name}" 미션을 완료하였습니다.`);
              emitter.emit('fetchCalendar')
              break;
            default:
              break;
          }
        });
    });
  },
  getNextStatus(currentStatus: MissionStatus) {
    switch (currentStatus.code) {
      case MissionStatus.CREATED.code:
        return MissionStatus.IN_PROGRESS;
      case MissionStatus.IN_PROGRESS.code:
        return MissionStatus.COMPLETED
      default:
        return MissionStatus.DELETED;
    }
  },
  getNextStatusMessage() {
    switch(state.nextStatus.code) {
      case MissionStatus.IN_PROGRESS.code:
        return "미션을 시작 할까요?";
      case MissionStatus.COMPLETED.code:
        return "미션을 종료(완료) 할까요?"
      default:
        return "";
    }
  },
  getButtonName() {
    switch(state.nextStatus.code) {
      case MissionStatus.IN_PROGRESS.code:
        return "미션 시작!";
      case MissionStatus.COMPLETED.code:
        return "미션 처리!"
      default:
        return "완료된 미션";
    }
  },
}

const state = reactive({
  nextStatus: methods.getNextStatus(props.status)
});
onMounted(() => {
  console.log('next status', state.nextStatus.name);
})
</script>
<style scoped lang="scss">
@import "@assets/main";

.mission-state-changer-container {
  padding: 0 20px;
}
</style>
