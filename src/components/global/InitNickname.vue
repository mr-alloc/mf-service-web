<template>
  <div class="nickname-initializer">
    <div class="title-area">
      <span class="nickname-initializer-title">합류를 시작하기 위해 닉네임을 정해주세요!</span>
    </div>
    <form class="nickname-form">
      <BlinkInput name="nickname" type="text" placeHolder="닉네임을 입력해주세요"
                  :is-hold="state.inputHold" warning-message="닉네임은 2~10자로 입력해주세요."
                  :validate="methods.validateNickname"
      />
      <SimpleButton buttonName="확인" :click-behavior="methods.initNickname" :submittable="state.nicknameSubmittable"/>
    </form>
  </div>
</template>

<script lang="ts" setup>
import BlinkInput from "@/components/global/BlinkInput.vue";
import SimpleButton from "@/components/global/SimpleButton.vue";
import {reactive} from "vue";
import {call} from "@/utils/NetworkUtil";
import Member from "@/constant/api-meta/Member";
import {useMemberInfoStore} from "@/stores/MemberInfo";
import {useRouter} from "vue-router";
import {useBackgroundStore} from "@/stores/BackgroundStore";

const memberInfoStore = useMemberInfoStore();
const backgroundStore = useBackgroundStore();
const router = useRouter();
const state = reactive({
  nicknameInputValidate: false,
  nicknameSubmittable: false,
  inputHold: false,
});

const nickNameRE = /^[가-힣a-zA-Z0-9 ]{2,10}$/;

const methods = {
  validateNickname() {
    const nicknameInput: HTMLInputElement = document.getElementsByName('nickname')[0]! as HTMLInputElement;
    const validLength = nicknameInput.value.length >= 2 && nicknameInput.value.length <= 10;
    state.nicknameInputValidate = validLength && nickNameRE.test(nicknameInput.value);

    state.nicknameInputValidate && (state.nicknameSubmittable = true);

    return state.nicknameInputValidate;
  },
  async initNickname() {
    const nicknameInput: HTMLInputElement = document.getElementsByName('nickname')[0]! as HTMLInputElement;
    await call(Member.ChangeMemberNickname, { nickname: nicknameInput.value },
        async (response) => {
          console.log('Success to change nickname. remove member cache.');
          await memberInfoStore.renewMemberInfo();
          backgroundStore.returnNicknameInitializer()
    })

  }

}
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
  animation-duration: 3s;
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
