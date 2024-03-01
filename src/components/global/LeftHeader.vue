<template>
  <header>
    <div class="brand-area">
      <RouterLink to="/">
        <div class="brand-logo">
          <img alt="Vue logo" class="logo" src="@/assets/images/logo.gif"/>
        </div>
      </RouterLink>
    </div>
    <div class="user-session-info pushable">
      <span class="user-img-area">
        <img v-if="!memberInfoStore.needMemberInfo()" :src="memberInfoStore.memberInfo?.profileImage"/>
        <FontAwesomeIcon v-else class="fa-xl guest-icon" :icon="faUser" />
      </span>
      <div class="current-user" v-on:click="methods.moveToUserInfo()">
        <span class="user-name">{{ methods.getNickname() }}</span>
      </div>
    </div>
    <div class="feature-list-wrapper">
      <nav>
        <ul class="feature-list">
          <FeatureItem :icon="['far', 'lightbulb']" v-show="memberInfoStore.allow(MemberRole.MEMBER)"
                       :click-behavior="methods.createMission"/>
        </ul>
      </nav>
    </div>
    <SimpleNotifier/>
  </header>
</template>
<script setup lang="ts">
import {faUser} from "@fortawesome/free-solid-svg-icons";
import {useMemberInfoStore} from "@/stores/MemberInfo";
import {useRouter} from "vue-router";
import {FontAwesomeIcon} from "@fortawesome/vue-fontawesome";
import FeatureItem from "@/components/global/FeatureItem.vue";
import SimpleNotifier from "@/components/global/SimpleNotifier.vue";
import {NotificationType, useNotificationStore} from "@/stores/NotificationStore";
import {MemberRole} from "@/constant/MemberRole";

const memberInfoStore = useMemberInfoStore();
const notificationStore = useNotificationStore();
let router = useRouter();
const methods = {
  moveToUserInfo() {
    //GUEST
    if (memberInfoStore.needMemberInfo()) {
      router.push("/sign-in")
      return;
    }
    switch (memberInfoStore.memberInfo?.role) {
      case MemberRole.MEMBER:
        router.push("/profile");
        break;
      case MemberRole.ADMIN:
        router.push("/admin");
        break;
      default:
        router.push("/sign-in");
    }
  },
  getNickname() {
    return memberInfoStore.needMemberInfo()
        ? "Guest"
        : memberInfoStore?.memberInfo.nickname ?? "No Name";
  },
  createMission() {
    console.log("미션 생성");
    const random = Math.floor(Math.random() * 10);
    notificationStore.notice(NotificationType.SUCCESS, `${random}. 미션생성 완료`, "\"청첩장 개수확인\" 미션이 생성 되었습니다.")
  }
}
</script>

<style scoped lang="scss">
@import '@/assets/main';
header {
  display: flex;
  flex-direction: column;
  line-height: 1.5;
  max-height: 100vh;
  width: 230px;
  flex-shrink: 0;
  padding: 1.2rem 1.5rem;
  border-right: 1.24px solid $standard-light-gray-in-white;

  .brand-area {
    display: flex;
    flex-direction: row;
    align-items: center;
    cursor: pointer;

    .brand-logo {
      display: flex;
      justify-content: center;
      align-items: center;
      padding: 5px 8px;
      width: 100%;
      flex-shrink: 0;

      .logo {
        width: 100%;
      }
    }

    .brand-name {
      flex-grow: 1;
      display: flex;
      justify-content: center;
      align-items: center;
      width: 100%;
    }
  }

  .user-session-info {
    padding: 5px 8px;
    display: flex;
    flex-direction: row;
    border-radius: 5px;

    .user-img-area {
      display: flex;
      width: 30px;
      height: 30px;
      border-radius: 30px;
      background-color: lightgray;
      justify-content: center;
      align-items: center;
      flex-shrink: 0;
      overflow: hidden;

      .guest-icon {
        color: white;
      }

      img {
        width: 100%;
        height: 100%;
      }
    }

    .current-user {
      flex-grow: 1;
      display: flex;
      justify-content: center;
      align-items: center;
      border-radius: 5px;
      transition: $duration;

      .user-name {
        font-weight: bold;
      }

    }

  }

  .feature-list-wrapper {
    display: flex;

    nav {
      width: 100%;

      .feature-list {
        list-style: none;
        padding: 5px 8px;

      }
    }

  }
}
</style>
