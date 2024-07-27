<template>
  <div class="mission-state-container">
    <div class="detail-collapse-controller" :class="{ open: state.openDetail }">
      <div class="controller-button" v-on:click="() => state.openDetail = !state.openDetail">
        <Transition name="fade">
          <span class="button-text" v-show="!state.openDetail">
            <MissionStatusIndicator :status="props.status" :type="props.detail.type"/>
          </span>
        </Transition>
        <Transition name="fade">
          <span class="button-text" v-show="state.openDetail">미션 상세</span>
        </Transition>
        <span class="button-icon"><FontAwesomeIcon icon="caret-down"/></span>
      </div>
      <Transition name="down-fade-smooth">
        <div class="collapse-area" v-show="state.openDetail">
          <div class="detail-pair" v-if="MissionStatus.fromCode(props.status).isNotIn(MissionStatus.ALWAYS)">
            <div class="state-text">
              <span>미션 종류</span>
            </div>
            <div class="detail-content">
              <BlinkSelect id="mission-type" :options="state.typeOptions" :before-change="methods.selectType"
                           :current-index="state.typeOptions.findIndex(option => option.value === `${props.detail.type}`)"/>
            </div>
          </div>
          <div class="detail-pair" v-if="MissionType.fromValue(props.detail.type).isNotIn(MissionType.SCHEDULE)">
            <div class="state-text">
              <span>상태</span>
            </div>
            <div class="detail-content">
              <MissionStatusTimeline  :state-id="props.stateId" :status="props.status" :detail="props.detail" :start-stamp="props.stateTime"/>
            </div>
          </div>
          <div class="detail-pair"
               v-if="ownFamiliesStore.hasSelectFamily && MissionStatus.fromCode(props.status).isNotIn(MissionStatus.ALWAYS)">
            <div class="state-text">
              <span>담당자</span>
            </div>
            <div class="detail-content">
              <SimpleSelector default-option-name="멤버 선택" :before-change="methods.selectMember" id="assignee"
                              :options="state.members as Array<SelectImageOption>" v-if="ownFamiliesStore.hasSelectFamily"
                              :current-index="state.members.findIndex(member => member.id === props.detail.assignee)"/>
            </div>
          </div>
          <div class="detail-pair">
            <div class="state-text">
              <span>생성자</span>
            </div>
            <div class="detail-content">
              <ImageNicknamePair
                  :option="props.members.find(member => member.id === props.detail.reporter) ?? SelectImageOption.of(0, profileStore.profileMember.nickname, LocalAsset.DEFAULT_USER_PROFILE)"/>
            </div>
          </div>
        </div>
      </Transition>
    </div>
  </div>
</template>
<script setup lang="ts">
import MissionStatus from "@/constant/MissionStatus";
import SelectImageOption from "@/classes/api-spec/SelectImageOption";
import LocalAsset from "@/constant/LocalAsset";
import ImageNicknamePair from "@/components/global/ImageNicknamePair.vue";
import SimpleRadio from "@/components/global/SimpleRadio.vue";
import SimpleSelector from "@/components/global/SimpleSelector.vue";
import type MissionDetail from "@/classes/MissionDetail";
import MissionType from "@/constant/MissionType";
import { inject, reactive } from 'vue'
import SelectOption from "@/classes/SelectOption";
import PopupUtil from "@/utils/PopupUtil";
import * as ChangeFamilyMissionAttribute from "@/classes/api-spec/mission/ChangeFamilyMissionAttribute";
import {call} from "@/utils/NetworkUtil";
import Mission from "@/constant/api-meta/Mission";
import {FontAwesomeIcon} from "@fortawesome/vue-fontawesome";
import {useAlertStore} from "@/stores/AlertStore";
import {useProfileMemberStore} from "@/stores/ProfileMemberStore";
import MissionStatusIndicator from "@/components/global/MissionStatusIndicator.vue";
import {useOwnFamiliesStore} from "@/stores/OwnFamiliesStore";
import {useFamiliesViewStore} from "@/stores/FamiliesViewStore";
import MissionStatusTimeline from '@/components/MissionStatusTimeline.vue'

const emitter: any = inject("emitter");
const ownFamiliesStore = useOwnFamiliesStore();
const familiesViewStore = useFamiliesViewStore();
const alertStore = useAlertStore();
const profileStore = useProfileMemberStore();
const props = defineProps<{
  detail: MissionDetail,
  status: number,
  stateId: number,
  stateTime: number,
  members: SelectImageOption [],
}>();
const state = reactive({
  typeOptions: MissionType.values().map(MissionType.toSelectOption),
  openDetail: false,
  statusOptions: MissionStatus.values().filter(MissionStatus.NOT_DELETED_FILTER).map(MissionStatus.toSelectOption),
  members: familiesViewStore.members.map(member => member.toSelectImageOption())
});
const methods = {
  selectType(option: SelectOption, afterChange: () => void) {
    PopupUtil.confirm("미션종류 변경", `${option.text}(으)로 변경 하시겠습니까?`, () => {
      const requestBody = ChangeFamilyMissionAttribute.RequestBody.forType(props.detail.id, parseInt(option.value));
      call<ChangeFamilyMissionAttribute.RequestBody, ChangeFamilyMissionAttribute.ResponseBody>(Mission.ChangeMissionAttribute, requestBody, (response) => {
        const responseBody = ChangeFamilyMissionAttribute.ResponseBody.fromJson(response.data);
        const changed = responseBody.changed;
        if (changed.type === parseInt(option.value)) {
          alertStore.success("미션 종류 변경", `미션 종류가 변경 되었어요.`);
          afterChange();
        } else {
          alertStore.warning("미션 종류 변경", `미션 종류 변경에 실패했어요.`);
        }
      });
    });

  },
  selectMember(member: SelectImageOption, afterChange: () => void) {
    if (member.id === props.detail.assignee) {
      return;
    }
    PopupUtil.confirm("미션 수행자 변경", `${member.name}님을 미션 수행자로 지정하시겠습니까?`, () => {
      const requestBody = ChangeFamilyMissionAttribute.RequestBody.forAssignee(props.detail.id, member.id);

      call<ChangeFamilyMissionAttribute.RequestBody, ChangeFamilyMissionAttribute.ResponseBody>(Mission.ChangeMissionAttribute, requestBody, (response) => {
        const responseBody = ChangeFamilyMissionAttribute.ResponseBody.fromJson(response.data);
        const changed = responseBody.changed;
        if (changed.assignee === member.id) {
          alertStore.success("수행자 변경", `${member.name}님을 미션 수행자로 지정하였습니다.`);
          afterChange();
        } else {
          alertStore.warning("수행자 변경", `${member.name}님을 미션 수행자로 지정하지 못했습니다.`);
        }
      });
    });
  },
}
</script>
<style scoped lang="scss">
@import "@assets/main";

.mission-state-container {

  .detail-collapse-controller {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 10px 20px;
    flex-direction: column;

    &.open {
      .controller-button {
        border-bottom-left-radius: 0;
        border-bottom-right-radius: 0;

        .button-icon {
          transform: rotate(180deg);
        }
      }

      .collapse-area {
        height: max-content;
        border-left: 1px solid $standard-light-gray-in-white;
        border-right: 1px solid $standard-light-gray-in-white;
        border-bottom: 1px solid $standard-light-gray-in-white;
        border-bottom-left-radius: 3px;
        border-bottom-right-radius: 3px;
      }
    }

    .controller-button {
      display: flex;
      align-items: center;
      width: 100%;
      padding: 5px 20px;
      border-radius: 3px;
      transition: $duration;
      border: 1px solid $standard-light-gray-in-white;
      position: relative;
      justify-content: flex-end;

      .button-text {
        position: absolute;
        flex-grow: 1;
        font-weight: bold;
        left: 0;
        margin-left: 20px;
      }

      .button-icon {
        display: flex;
        flex-shrink: 0;
        width: 1.5rem;
        justify-content: center;
        align-items: center;
        transition: .4s;
        height: 1.5rem;
      }

      &:hover {
        cursor: pointer;
        background-color: $standard-light-gray-in-white;
      }
    }

    .collapse-area {
      width: 100%;
      height: 0;
      transition: height .2s ease;

      .detail-pair {
        display: flex;
        flex-direction: row;
        padding: 3px 20px;

        .state-text {
          display: flex;
          justify-content: flex-start;
          align-items: center;
          width: 60px;
          flex-shrink: 0;
        }

        .detail-content {
          flex-grow: 1;
          display: flex;
          justify-content: center;
          align-items: center;
        }
      }
    }
  }
}
</style>
