<template>
  <header>
    <div class="brand-area">
      <div class="brand-logo">
        <img alt="Vue logo" class="logo" src="@/assets/images/logo.gif" />
      </div>
    </div>
    <div class="user-session-info pushable">
      <span class="user-img-area">
        <img v-if="!memberInfoStore.needMemberInfo()" src="@/assets/images/profile.png"/>
        <FontAwesomeIcon v-else class="fa-xl guest-icon" :icon="faUser" />
      </span>
      <div class="current-user" v-on:click="methods.moveToUserInfo()">
        <span class="user-name">{{ methods.getNickname() }}</span>
      </div>
    </div>
    <div class="feature-list-wrapper">
      <nav>
        <ul class="feature-list">
        </ul>
      </nav>
    </div>
  </header>
</template>
<script setup lang="ts">
import {faUser} from "@fortawesome/free-solid-svg-icons";
import {useMemberInfoStore} from "@/stores/MemberInfo";
import {useRouter} from "vue-router";
import {FontAwesomeIcon} from "@fortawesome/vue-fontawesome";

const memberInfoStore = useMemberInfoStore();
let router = useRouter();
const methods = {
  moveToUserInfo() {
    router.push("/sign-in")
  },
  getNickname() {
    return memberInfoStore.needMemberInfo()
        ? "Guest"
        : memberInfoStore?.memberInfo.nickname ?? "No Name";
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
  padding: 0 1.5rem;
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

    .feature-list {
      list-style: none;

      li {
        height: 1.42rem;
      }
    }
  }
}
</style>
