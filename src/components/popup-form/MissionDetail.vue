<template>
  <div class="mission-detail-container">
    <ul class="detail-specifications-group">
      <li class="detail-pair">
        <div class="detail-title">
          <span>미션 종류</span>
        </div>
        <div class="detail-content">
          <BlinkSelect id="mission-type" :options="state.typeOptions"
                       :current-selected-index="state.typeOptions.findIndex(option => option.value === state.detail?.type)"/>
        </div>
      </li>
      <li class="detail-pair">
        <div class="detail-title">
          <span>미션 상태</span>
        </div>
        <div class="detail-content">
          <SimpleRadio id="mission-status" :options="state.statusOptions"
                       :current-selected-index="state.statusOptions.findIndex(option => option.value === `${state.detail?.status ?? 0}`)"/>
        </div>
      </li>
      <li class="detail-pair">
        <div class="detail-title">
          <span>미션 수행자</span>
        </div>
        <div class="detail-content">
          <SimpleSelector default-option-name="멤버 선택" :default-selected="2" :before-change="methods.selectMember"
                          :options="state.members" v-if="ownFamiliesStore.hasSelectFamily"
                          :current-selected-index="state.members.findIndex(member => member.id === state.detail.assignee)"/>
        </div>
      </li>
      <li class="detail-pair">
        <div class="detail-title">
          <span>미션 생성자</span>
        </div>
        <div class="detail-content">
          <ImageNicknamePair
              :option="state.members.find(member => member.id === state.detail.reporter) ?? SelectImageOption.ofDefault()"/>
        </div>
      </li>
    </ul>
    <BlinkTextArea id="description" name="description" label="설명" default-value="무슨일을 하든 돕기"/>
  </div>
</template>
<script setup lang="ts">
import {onMounted, reactive} from "vue";
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
import FamilyMission from "@/constant/api-meta/FamilyMission";
import * as ChangeFamilyMissionAttribute from "@/classes/api-spec/mission/ChangeFamilyMissionAttribute";
import * as GetFamilyMissionDetail from "@/classes/api-spec/family/GetFamilyMissionDetail";
import {useBackgroundStore} from "@/stores/BackgroundStore";


const backgroundStore = useBackgroundStore();
const ownFamiliesStore = useOwnFamiliesStore();
const alertStore = useAlertStore();
const props = defineProps({
  missionId: Number
});
const state = reactive({
  members: ownFamiliesStore.members.map(member => member.toSelectImageOption()),
  statusOptions: [
    new SelectOption("0", "대기", "e0e0e0"),
    new SelectOption("1", "진행중", "eddbfb"),
    new SelectOption("3", "일시정지", "fcd1d1"),
    new SelectOption("2", "완료", "c8ffd4"),
  ],
  typeOptions: [
    new SelectOption("1", "미션"),
    new SelectOption("2", "미션팩"),
    new SelectOption("3", "스텝미션"),
  ],
  detail: {} as GetFamilyMissionDetail.FamilyMissionDetail
});
const methods = {
  selectMember(member: SelectImageOption) {
    PopupUtil.innerConfirm("미션 수행자 변경", `${member.name}님을 미션 수행자로 지정하시겠습니까?`, () => {
      const requestBody = ChangeFamilyMissionAttribute.RequestBody.forAssignee(props.missionId!, member.id);
      call<ChangeFamilyMissionAttribute.RequestBody, ChangeFamilyMissionAttribute.ResponseBody>(FamilyMission.ChangeMissionAttribute, requestBody, (response) => {
        const responseBody = ChangeFamilyMissionAttribute.ResponseBody.fromJson(response.data);
        if (responseBody.assignee === member.id) {
          alertStore.success("수행자 변경", `${member.name}님을 미션 수행자로 지정하였습니다.`);
          // state.detail.assignee = member.id;
        } else {
          alertStore.warning("수행자 변경", `${member.name}님을 미션 수행자로 지정하지 못했습니다.`);
        }
      });
    });
  }
}

onMounted(() => {
  if (ownFamiliesStore.hasSelectFamily) {
    call<any, GetFamilyMissionDetail.ResponseBody>(FamilyMission.GetFamilyMissionDetail, {missionId: props.missionId}, (response) => {
      const responseBody = GetFamilyMissionDetail.ResponseBody.fromJson(response.data);
      state.detail = responseBody.mission;
      backgroundStore.readyPopup();
    });
  }
});
</script>
<style scoped lang="scss">
@import "@/assets/main";

.mission-detail-container {
  width: 568px;

  .detail-specifications-group {
    display: flex;
    flex-direction: row;
    margin: 20px 0;
    justify-content: center;


    .detail-pair {
      display: flex;
      flex-direction: column;
      width: max-content;
      border: 1px solid $standard-light-gray-in-white;
      border-collapse: collapse;

      .detail-title {
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
    }
  }
}
</style>
