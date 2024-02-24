<template>
  <header>
    <div class="brand-area">
      <div class="brand-logo">
        <img alt="Vue logo" class="logo" src="@/assets/logo.svg" width="25" height="25" />
      </div>
      <div class="brand-name">
        <span>Mission Family</span>
      </div>
    </div>
    <div class="user-session-info">
      <span class="user-img-area">
        <FontAwesomeIcon class="fa-xl guest-icon" :icon="faUser" />
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

  <Transition name="fade">
    <div class="container" >
      <RouterView />
    </div>
  </Transition>
  <div class="background" v-show="backgroundStore.needBackground">
    <InitNickname  />
  </div>
</template>
<script setup lang="ts">
import {RouterLink, RouterView, useRouter} from 'vue-router'
import  { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { faUser } from "@fortawesome/free-solid-svg-icons";
import { useMemberInfoStore } from "@/stores/MemberInfo";
import InitNickname from "@/components/global/InitNickname.vue";
import {useBackgroundStore} from "@/stores/BackgroundStore";

const router = useRouter();
const memberInfoStore = useMemberInfoStore();
let backgroundStore = useBackgroundStore();


const methods = {
  moveToUserInfo() {
    router.push("/sign-in")
  },
  getNickname() {
    return memberInfoStore.needMemberInfo()
        ? "Guest"
        : memberInfoStore?.nickname ?? "No Name";
  }
}

</script>
<style lang="scss">
@import '@/assets/main.scss';
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
    height: 60px;

    .brand-logo {
      display: flex;
      justify-content: center;
      align-items: center;
      width: 50px;
      flex-shrink: 0;
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

      .guest-icon {
        color: white;
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

      &:hover {
        cursor: pointer;
        background-color: lightgray;
        scale: 0.85;
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
.container {
  flex-grow: 1;
}
</style>
