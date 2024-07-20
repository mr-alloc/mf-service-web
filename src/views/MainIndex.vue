<template>
  <div class="main-container">
    <div class="title-area">
      <span class="title-text">미션 패밀리에 합류할 준비가 완료 되었나요?</span>
    </div>
    <div class="answer-area">
      <span class="answer-yes" v-on:click="methods.joinUs">합류하기</span>
    </div>
  </div>
</template>
<script setup lang="ts">
import {useAlertStore} from "@/stores/AlertStore";
import {useMemberInfoStore} from "@/stores/MemberInfoStore";
import {AccountRole} from "@/constant/AccountRole";
import {useRouter} from "vue-router";

const memberInfoStore = useMemberInfoStore();
const alertStore = useAlertStore();
const router = useRouter();
const methods = {
  joinUs() {
    if (memberInfoStore.getCurrentAccountRole().isGrantedFrom(AccountRole.MEMBER)) {
      alertStore.guide("회원가입 안내", "이미 회원이시군요! 캘린더로 보내드리겠습니다!", 5);
      router.push("/calendar");
    } else {
      alertStore.guide("회원가입 안내", "합류를 위해 회원가입 페이지로 안내할게요!", 10);
      router.push("/sign-up");
    }
  }
}
</script>
<style scoped lang="scss">
@import "@assets/main";

.main-container {
  background-color: $soft-dark;
  width: 100%;
  height: 100%;
  position: relative;

  .title-area {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 50%;

    .title-text {
      font-size: 2rem;
      color: white;
      position: relative;
      font-weight: bold;

      &:after {
        position: absolute;
        top: 0;
        right: -10px;
        content: "";
        width: 5px;
        height: 100%;
        background-color: white;
        display: block;
        border-radius: 5px;

        animation: blink 1s infinite;
      }
    }
  }

  .answer-area {
    display: flex;
    justify-content: center;
    align-items: center;
    top: 0;
    left: 0;
    height: 100%;
    width: 100%;
    position: absolute;

    .answer-yes {
      font-size: 2rem;
      color: white;
      font-weight: bold;
      cursor: pointer;
      transition: .2s;

      &:hover {
        color: $soft-dark;
        background-color: white;
      }
    }
  }
}

@keyframes blink {
  0% {
    opacity: 1;
  }
  50% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
}
</style>
