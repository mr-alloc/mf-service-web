<script setup lang="ts">
import {useMemberInfoStore} from "@/stores/MemberInfoStore";
import {useRouter} from "vue-router";
import {useLeftMenuStore} from "@/stores/LeftMenuStore";
import {AccountRole} from "@/constant/AccountRole";
import {useProfileMemberStore} from "@/stores/ProfileMemberStore";

let router = useRouter();
const memberInfoStore = useMemberInfoStore();
const leftMenuStore = useLeftMenuStore();
const profileMemberStore = useProfileMemberStore();
const methods = {
  moveToUserInfo() {
    console.log('role:', memberInfoStore.memberInfo);
    //GUEST
    if (memberInfoStore.needMemberInfo()) {
      router.push("/sign-in")
      return;
    }
    switch (memberInfoStore.getCurrentMemberRole()) {
      case AccountRole.MEMBER.level:
        router.push("/profile");
        break;
      default:
        router.push("/sign-in");
        break;
    }
  },
  getNickname() {
    return memberInfoStore.needMemberInfo()
        ? "Guest"
        : profileMemberStore.profileMember.nickname ?? "No Name";
  },
}
</script>

<template>
  <div class="user-session-info pushable"
       v-on:click="methods.moveToUserInfo()">
    <span class="user-img-area">
      <img :src="profileMemberStore.profileMember.profile"/>
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
