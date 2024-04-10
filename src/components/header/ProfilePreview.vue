<script setup lang="ts">
import {MemberRole} from "@/constant/MemberRole";
import {useMemberInfoStore} from "@/stores/MemberInfo";
import {useRouter} from "vue-router";

let router = useRouter();
const memberInfoStore = useMemberInfoStore();
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
}
</script>

<template>
  <div class="user-session-info pushable">
      <span class="user-img-area">
        <img :src="memberInfoStore.memberInfo?.profileImage ?? '@/assets/images/default_user.png'"/>
      </span>
    <div class="current-user" v-on:click="methods.moveToUserInfo()">
      <span class="user-name">{{ methods.getNickname() }}</span>
    </div>
  </div>
</template>

<style scoped lang="scss">
@import "@/assets/main";

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
</style>
