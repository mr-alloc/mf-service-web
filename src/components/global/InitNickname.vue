<template>
  <div class="nickname-initializer">
    <div class="back" v-show="memberInfoStore.hasNickname()">
      <FontAwesomeIcon class="fa-4x" :icon="['fas', 'delete-left']"
                       v-on:click="backgroundStore.returnNicknameInitializer()"/>
    </div>
    <div class="title-area">
      <span class="nickname-initializer-title">{{ methods.getGuideNotice() }}</span>
    </div>
    <div class="nickname-form">
      <BlinkInput name="nickname" type="text" placeHolder="닉네임을 입력해주세요"
                  :is-hold="state.inputHold" :warning-message="state.defaultMessage"
                  :validate="methods.validateNickname" :default-value="memberInfoStore.memberInfo?.nickname"
      />
      <SimpleButton buttonName="확인" :click-behavior="methods.initNickname" :submittable="state.nicknameSubmittable"/>
    </div>
  </div>
</template>

<script lang="ts" setup>
import BlinkInput from "@/components/global/BlinkInput.vue";
import SimpleButton from "@/components/global/SimpleButton.vue";
import {onMounted, reactive} from "vue";
import {call} from "@/utils/NetworkUtil";
import Member from "@/constant/api-meta/Member";
import {useMemberInfoStore} from "@/stores/MemberInfo";
import {useBackgroundStore} from "@/stores/BackgroundStore";
import {NotificationType, useNotificationStore} from "@/stores/NotificationStore";
import {FontAwesomeIcon} from "@fortawesome/vue-fontawesome";

const memberInfoStore = useMemberInfoStore();
const backgroundStore = useBackgroundStore();
const notificationStore = useNotificationStore();
const state = reactive({
  nicknameInputValidate: false,
  nicknameSubmittable: false,
  inputHold: false,
  defaultMessage: Member.ChangeMemberNickname.defaultMessage
});

const nickNameRE = /^[가-힣a-zA-Z0-9 ]{2,10}$/;

const methods = {
  ifEnterOnNickname() {
    if (methods.validateNickname()) {
      methods.initNickname();
    }
  },
  validateNickname() {
    const nicknameInput: HTMLInputElement = document.getElementsByName('nickname')[0]! as HTMLInputElement;

    //기존 닉네임이 같은지
    if (memberInfoStore.memberInfo?.nickname === nicknameInput.value) {
      state.nicknameInputValidate = false
      state.defaultMessage = "기존과 다른 닉네임으로 설정 해주세요!"
      return false;
    }

    const validLength = nicknameInput.value.length >= 2 && nicknameInput.value.length <= 10;
    state.nicknameInputValidate = validLength && nickNameRE.test(nicknameInput.value);
    state.nicknameInputValidate && (state.nicknameSubmittable = true);

    return state.nicknameInputValidate;
  },
  async initNickname() {
    if (!methods.validateNickname()) {
      return;
    }
    const nicknameInput: HTMLInputElement = document.getElementsByName('nickname')[0]! as HTMLInputElement;
    await call(Member.ChangeMemberNickname, { nickname: nicknameInput.value },
        async (response) => {
          if (memberInfoStore.hasNickname()) {
            notificationStore.notice(NotificationType.SUCCESS, "닉네임 변경 성공!", `닉네임이 ${nicknameInput.value}로 변경 되었어요!`);
          } else {
            notificationStore.notice(NotificationType.SUCCESS, "첫번째 미션 클리어!", `닉네임 설정에 성공 했어요!\n환영해요 ${nicknameInput.value}님!`);
          }
          await memberInfoStore.renewMemberInfo();
          backgroundStore.returnNicknameInitializer()
        },
        (spec, error) => {
          state.defaultMessage = spec.getMessage(error.response.data.code) ?? spec.defaultMessage;
          return false;
        }
    )

  },
  getGuideNotice() {
    return memberInfoStore.hasNickname()
        ? "변경할 닉네임을 입력해주세요."
        : "합류를 시작하기 위해 닉네임을 정해주세요!";
  }
}

onMounted(() => {
  window.addEventListener('keyup', (event: KeyboardEvent) => {
    if (event.key === "Escape" && backgroundStore.needNicknameInitializer) {
      backgroundStore.returnNicknameInitializer()
    }
  })
})
</script>

<style lang="scss">
@import '@/assets/main';

.nickname-initializer {
  position: absolute;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  z-index: 1;
  background: rgb(255, 255, 255, .3);
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  backdrop-filter: blur(10px);

  animation-name: blur;
  animation-duration: 1s;
  animation-iteration-count: 1;

  .title-area {
    position: absolute;
    display: flex;
    top: 0;
    height: 120px;
    margin: 30px 0;
    justify-content: center;
    align-items: center;

    .nickname-initializer-title {
      font-size: 1.8rem;
      font-weight: 600;
    }
  }

  .nickname-form {
    width: 300px;

  }

  .back {
    position: fixed;
    color: rgb(0, 0, 0, .3);
    top: 9px;
    left: 30px;
    display: flex;
    justify-content: center;
    align-items: center;
    transition: .2s;


    &:hover {
      color: rgb(0, 0, 0, .5);

      svg {

        cursor: pointer;
      }
    }
  }
}

@keyframes blur {
  0% {
    backdrop-filter: blur(0px);
  }
  100% {
    backdrop-filter: blur(10px);
  }
}
</style>
