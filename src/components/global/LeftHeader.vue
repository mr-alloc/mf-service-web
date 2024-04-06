<template>
  <header>
    <div class="brand-area">
      <RouterLink to="/">
        <div class="brand-logo">
          <img alt="Vue logo" class="logo" src="@/assets/images/logo.gif"/>
        </div>
      </RouterLink>
    </div>
    <SimpleItemSelect v-if="!memberInfoStore.needMemberInfo() && ownFamiliesStore.families.length > 0"
                      :items="ownFamiliesStore.toSelectItemValue()"
                      default-selected-title="패밀리 이동"
                      :select-function="(item: SelectItemValue) => methods.changeFamily(item)"/>
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
          <FeatureItem :icon="['fas', 'people-group']" v-show="memberInfoStore.allow(MemberRole.MEMBER)"
                       :click-behavior="methods.popupCreateFamily" button-name="패밀리 생성"/>
          <FeatureItem :icon="['far', 'lightbulb']" v-show="memberInfoStore.allow(MemberRole.MEMBER)"
                       :click-behavior="methods.popupCreateMission" button-name="미션 생성"/>
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
import {AlertType, useAlertStore} from "@/stores/AlertStore";
import {MemberRole} from "@/constant/MemberRole";
import {useBackgroundStore} from "@/stores/BackgroundStore";
import {CurrentPopup, PopupType} from "@/stores/status/CurrentPopup";
import {inject, onMounted} from "vue";
import SimpleItemSelect from "@/components/global/SimpleItemSelect.vue";
import {useOwnFamiliesStore} from "@/stores/OwnFamiliesStore";
import type SelectItemValue from "@/classes/SelectItemValue";
import {setSelectedFamilyId} from "@/utils/LocalCache";

const memberInfoStore = useMemberInfoStore();
const notificationStore = useAlertStore();
const backgroundStore = useBackgroundStore();
const ownFamiliesStore = useOwnFamiliesStore();

let router = useRouter();
const emitter = inject("emitter")!;
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
  popupCreateMission() {
    const createMissionPopup = new CurrentPopup(PopupType.NORMAL, "미션 생성")
        .addBodyComponent("CreateMission", {})
        .addButton("생성", () => {
          emitter.emit("validateCreateMissionForm")
        })
        .addCancelButton("취소", () => {
          backgroundStore.returnGlobalPopup()
          emitter.off("validateCreateMissionForm")
        }, () => {
          notificationStore.notice(AlertType.WARNING, "미션생성 취소", "이 메세지가 사라지기 전까지 한번 더 취소 버튼을 누르시면 취소되요!", 5)
          return 5;
        });
    backgroundStore.useGlobalPopup(createMissionPopup);
  },

  popupCreateFamily() {
    const createFamilyPopup = new CurrentPopup(PopupType.NORMAL, "패밀리 생성")
        .addBodyComponent("CreateFamily", {})
        .addButton("생성", () => {
          emitter.emit("validateCreateFamilyForm")
        })
        .addCancelButton("취소", () => {
          backgroundStore.returnGlobalPopup()
          emitter.off("validateCreateFamilyForm")
        }, () => {
          notificationStore.notice(AlertType.WARNING, "패밀리 생성 취소", "이 메세지가 사라지기 전까지 한번 더 취소 버튼을 누르시면 취소되요!", 5)
          return 5;
        });
    backgroundStore.useGlobalPopup(createFamilyPopup);
  },
  changeFamily(item: SelectItemValue) {
    setSelectedFamilyId(item.id);
  }
}
onMounted(() => {
  ownFamiliesStore.fetchOwnFamilies();
})
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
