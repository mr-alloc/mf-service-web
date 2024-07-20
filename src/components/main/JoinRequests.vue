<template>
  <div class="join-requests-container">
    <ul class="request-item-group">
      <li class="join-request-item" v-on:click="methods.showRequestInfo(request as JoinRequest)"
          v-for="(request, index) in familiesViewStore.joinRequests" :key="index">
        <div class="member-info">
          <div class="image-frame">
            <img :src="request.profile" :alt="`요청자 ${request.nickname}의 프로필 이미지`"/>
          </div>
          <div class="join-info">
            <div class="nickname-wrapper">
              <span class="nickname-text">{{ request.nickname }}</span>
            </div>
            <div class="introduce-wrapper"></div>
          </div>
          <div class="requested-time">
            <span class="time-text">{{ DateUtil.toKoreanString(request.requestedAt) }}</span>
          </div>
        </div>
        <div class="response-buttons">
          <IconButton :icon="['fas', 'check']" color="green"
                      v-if="familyMemberInfoStore.getCurrentMemberRole().isGrantedFrom(MemberRole.SUB_MASTER)"
                      :click-behavior="() => methods.acceptJoinRequest(request as JoinRequest)"/>
          <IconButton :icon="['fas', 'ban']" color="crimson"
                      v-if="familyMemberInfoStore.getCurrentMemberRole().isGrantedFrom(MemberRole.SUB_MASTER)"
                      :click-behavior="() => methods.rejectJoinRequest(request as JoinRequest)"/>
        </div>
      </li>
    </ul>
  </div>
</template>
<script setup lang="ts">
import IconButton from "@/components/global/IconButton.vue";
import {useFamiliesViewStore} from "@/stores/FamiliesViewStore";
import DateUtil from "../../utils/DateUtil";
import PopupUtil from "@/utils/PopupUtil";
import {JoinRequest} from "@/classes/api-spec/family/GetJoinRequests";
import {MemberRole} from "@/constant/MemberRole";
import {useFamilyMemberInfoStore} from "@/stores/FamilyMemberInfoStore";

const familyMemberInfoStore = useFamilyMemberInfoStore();
const familiesViewStore = useFamiliesViewStore();
const methods = {
  acceptJoinRequest(request: JoinRequest) {
    PopupUtil.confirm("가입요청", `${request.nickname}님의 가입요청을 수락하시겠습니까?`, () => {
      familiesViewStore.acceptJoinRequestAsync(request.memberId);
    });
  },
  rejectJoinRequest(request: JoinRequest) {
    PopupUtil.confirm("가입요청", `${request.nickname}님의 가입요청을 거절하시겠습니까?`, () => {
      familiesViewStore.rejectJoinRequestAsync(request.memberId);
    });
  },
  showRequestInfo(request: JoinRequest) {
    PopupUtil.alert(`${request.nickname}님의 가입 요청 메세지`, `${request.introduce ?? ""}`);
  }
}
</script>
<style scoped lang="scss">
@import "@assets/main";

.join-requests-container {
  border-radius: 10px;

  .request-item-group {
    max-height: 300px;
    overflow-y: scroll;
    border-radius: 10px;

    .join-request-item {
      display: flex;
      flex-direction: row;
      background-color: white;
      margin-bottom: 1px;
      transition: $duration;
      padding: 5px 12px;

      .member-info {
        display: flex;
        flex-direction: row;
        justify-content: center;
        flex-grow: 1;
        position: relative;

        .image-frame {
          width: 30px;
          height: 30px;
          border-radius: 50%;
          margin: 5px;
          overflow: hidden;
          flex-shrink: 0;


          img {
            width: 100%;
            height: 100%;
          }
        }

        .join-info {
          display: flex;
          flex-direction: column;
          justify-content: center;
          padding: 3px 12px;
          flex-grow: 1;

          .nickname-wrapper {
            display: flex;
            justify-content: flex-start;
            align-items: center;
            line-height: 1;

            .nickname-text {
              font-weight: bold;
              width: 80%;
              text-overflow: ellipsis;
              overflow: hidden;
              white-space: nowrap;
            }
          }

          .introduce-wrapper {
            font-weight: bold;
            font-size: .7rem;
            text-overflow: ellipsis;
            overflow: hidden;
            white-space: nowrap;
            //width: 165px;
            color: $standard-dark-gray-in-white;
          }
        }

        .requested-time {
          position: absolute;
          right: 5px;
          top: 0px;
          font-weight: bold;
          font-size: .64rem;

          .time-text {
            font-weight: bold;

          }
        }
      }

      .response-buttons {
        flex-shrink: 0;
        width: max-content;
        display: flex;
        justify-content: center;
        align-items: center;
      }

      &:hover {
        background-color: $standard-light-gray-in-white;
        cursor: pointer;
      }
    }
  }
}
</style>
