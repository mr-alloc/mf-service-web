<script setup lang="ts">
import {useMemberInfoStore} from "@/stores/MemberInfoStore";
import {FontAwesomeIcon} from "@fortawesome/vue-fontawesome";
import {useRouter} from "vue-router";
import {AlertType, useAlertStore} from "@/stores/AlertStore";
import {removeTokens} from "@/utils/LocalCache";
import {useBackgroundStore} from "@/stores/BackgroundStore";
import {CurrentPopup, PopupType} from "@/stores/status/CurrentPopup";
import {onMounted, reactive} from "vue";
import Member from "@/constant/api-meta/Member";
import {call} from "@/utils/NetworkUtil";
import {ResponseBody} from "@/classes/api-spec/member/GetMemberDetail";
import {useProfileMemberStore} from "@/stores/ProfileMemberStore";

const memberInfoStore = useMemberInfoStore();
const alertStore = useAlertStore();
const backgroundStore = useBackgroundStore();
const router = useRouter();
const profileMemberStore = useProfileMemberStore();

const state = reactive({
  memberDetail: null as ResponseBody | null
});

const methods = {
  doSignOut() {
    alertStore.alert(AlertType.NONE, "반가웠어요!", `${memberInfoStore.memberInfo?.nickname}님 다음에 또 봐요!`);
    memberInfoStore.removeMemberInfo();
    removeTokens();
    router.push("/sign-in");
  },
  confirmSignOut() {
    if (backgroundStore.needPopup) {
      return;
    }
    const currentPopup = new CurrentPopup(PopupType.NORMAL, "로그아웃", "잘못 누르신 건가요? 아직 헤어지기 아쉬워요!")
        .addButton("확인", () => {
          methods.doSignOut();
          backgroundStore.returnGlobalPopup();
        })
        .addButton("취소", () => {
          backgroundStore.returnGlobalPopup();
        });
    backgroundStore.useGlobalPopup(currentPopup)
  },
  changeNickname() {
    backgroundStore.useNicknameInitializer("변경할 닉네임을 입력해주세요.");
  },
  getFormattedDate(at: number) {
    if (!at) return ""
    const date = new Date(at * 1000);
    return `${date.getFullYear()}년 ${date.getMonth() + 1}월 ${date.getDate()}일 ${date.getHours()}:${date.getMinutes()}`
  },
  changeProfile() {
    alertStore.info('프로필 이미지 변경', '아직 준비중이에요! 조금만 기다려주세요!')
  }
}

onMounted(async () => {
  await call<any, ResponseBody>(Member.GetMemberDetail, null,
      response => {
        state.memberDetail = ResponseBody.fromJson(response.data);
      }
  )
})
</script>

<template>
  <div class="member-profile" v-show="state.memberDetail">
    <div class="simple-profiles">
      <div class="profile-image-wrapper">
        <div class="profile-image">
          <img v-if="!memberInfoStore.needMemberInfo()" :src="profileMemberStore.profileMember.profile"/>
        </div>
        <div class="change-profile" v-on:click="methods.changeProfile()">
          <FontAwesomeIcon class="fa-sm" :icon="['fas', 'pen']"/>
        </div>
      </div>
      <div class="nickname-area" v-on:click="methods.changeNickname()">
        <span class="member-nickname">{{ profileMemberStore.profileMember.nickname }}</span>
      </div>
      <div class="sign-out-area">
        <button type="button" v-on:click="methods.confirmSignOut()">
          <FontAwesomeIcon class="fa-2x" :icon="['fas', 'sign-out-alt']"/>
        </button>
      </div>
    </div>
    <div class="account-information">
      <ul class="account-metadata">
        <li class="item-pair">
          <div class="item-key">이메일</div>
          <div class="item-value">{{ state.memberDetail?.email }}</div>
        </li>
        <li class="item-pair">
          <div class="item-key">계정 생성일시</div>
          <div class="item-value">{{ state.memberDetail?.registeredAt }}</div>
        </li>
        <li class="item-pair">
          <div class="item-key">마지막 로그인 일시</div>
          <div class="item-value">{{ state.memberDetail?.lastSignedInAt }}</div>
        </li>
      </ul>
    </div>
  </div>
</template>

<style scoped lang="scss">
@import '@assets/main.scss';

.member-profile {
  padding: 30px 15px;

  .simple-profiles {
    display: flex;
    padding: 5px 15px;
    flex-direction: row;

    .profile-image-wrapper {
      display: flex;
      flex-direction: column;
      flex-shrink: 0;
      width: 50px;
      position: relative;
      justify-content: center;

      .profile-image {
        width: 50px;
        height: 50px;
        border-radius: 50%;
        overflow: hidden;

        img {
          width: 100%;
          height: 100%;
        }
      }

      .change-profile {
        position: absolute;
        width: 20px;
        height: 20px;
        border-radius: 50%;
        display: flex;
        justify-content: center;
        align-items: center;
        background-color: $standard-gray-in-white;
        border: 3px white solid;
        color: #525252;
        bottom: 0px;
        right: -5px;
        transition: .4s;

        &:hover {
          transform: scale(1.1);
          cursor: pointer;
        }
      }
    }

    .nickname-area {
      padding: 5px 15px;
      flex-shrink: 0;
      width: 300px;
      display: flex;
      align-items: center;

      .member-nickname {
        font-size: 1.5rem;
        font-weight: bold;
        color: black;
        border-radius: 10px;
        padding: 5px 10px;
        transition: .4s;
        display: inline-block;

        &:hover {
          cursor: pointer;
          transform: scale(1.1);
          box-shadow: $standard-box-shadow;
        }
      }
    }

    .sign-out-area {
      flex-grow: 1;
      display: flex;
      flex-direction: row-reverse;
      color: $standard-gray-in-white;

      button {
        transition: .4s;
      }

      button:hover {
        color: $standard-clean-black;
        cursor: pointer;
      }
    }
  }

  .password-changer {

  }

  .account-information {
    width: 100%;
    margin: 20px 0px;

    .account-metadata {
      width: 100%;
      list-style: none;

      .item-pair {
        display: flex;
        flex-direction: row;

        .item-key {
          padding: 3px 5px;
          flex-shrink: 0;
          width: 200px;
          font-size: .84rem;

        }

        .item-value {
          padding: 3px 5px;
          flex-grow: 1;
          font-size: .94rem;
          font-weight: bold;
        }
      }
    }
  }
}
</style>
