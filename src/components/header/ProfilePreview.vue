<script setup lang="ts">
import {AccountRole} from "@/constant/AccountRole";
import {useMemberInfoStore} from "@/stores/MemberInfo";
import {useRouter} from "vue-router";
import {useLeftMenuStore} from "@/stores/LeftMenuStore";

let router = useRouter();
const memberInfoStore = useMemberInfoStore();
const leftMenuStore = useLeftMenuStore();
const methods = {
  moveToUserInfo() {
    //GUEST
    if (memberInfoStore.needMemberInfo()) {
      router.push("/sign-in")
      return;
    }
    switch (memberInfoStore.memberInfo?.role) {
      case AccountRole.MEMBER:
        router.push("/profile");
        break;
      case AccountRole.ADMIN:
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
}
</script>

<template>
  <div class="user-session-info pushable"
       v-on:click="methods.moveToUserInfo()">
    <span class="user-img-area">
      <img :src="memberInfoStore.memberInfo?.profileImage"/>
    </span>
    <Transition name="fade">
      <div class="current-user" v-show="!leftMenuStore.state.isCollapsed">
        <span class="user-name">{{ methods.getNickname() }}</span>
      </div>
    </Transition>
  </div>
</template>

<style scoped lang="scss">
@import "@/assets/main";

.user-session-info {
  padding: 3px;
  display: flex;
  flex-direction: row;
  border-radius: 5px;
  position: relative;
  height: 35px;
  margin: 5px 0;

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
    position: absolute;
    left: calc(35px - 3px);
    width: calc(205px - 6px - 30px);
    height: 30px;

    .user-name {
      font-weight: bold;
    }
  }
}
</style>
