<script setup lang="ts">
import FamilySelector from "@/components/header/FamilySelector.vue";
import {useOwnFamiliesStore} from "@/stores/OwnFamiliesStore";
import {inject, onMounted, reactive} from "vue";
import {DefaultButtonValue} from "@/classes/DefaultButtonValue";
import PopupUtil from "@/utils/PopupUtil";
import PageButtonGroup from "@/components/PageButtonGroup.vue";
import {hasSelectedFamilyId} from "@/utils/LocalCache";
import {MemberRole} from "@/constant/MemberRole";
import {useMemberInfoStore} from "@/stores/MemberInfoStore";
import FamilyInfo from "@/components/main/FamilyInfo.vue";
import TappableView from "@/components/global/TappableView.vue";
import {TabViewComponent} from "@/classes/TabViewComponent";
import {useFamiliesViewStore} from "@/stores/FamiliesViewStore";

const ownFamiliesStore = useOwnFamiliesStore();
const familiesViewStore = useFamiliesViewStore();
const memberInfoStore = useMemberInfoStore();
const emitter = inject("emitter");
const state = reactive({
  buttons: [
    DefaultButtonValue.of("생성", ["fas", "users"], () => PopupUtil.popupCreateFamily(emitter)),
    DefaultButtonValue.of("초대", ["fas", "user-plus"], () => PopupUtil.popupInviteFamily(emitter),
        () => hasSelectedFamilyId() && MemberRole.SUB_MASTER.isGrantedFrom(memberInfoStore.memberInfo.role)),
    DefaultButtonValue.of("가입신청", ["far", "envelope"], () => PopupUtil.popupRequestJoinFamily(emitter))
  ]
});
onMounted(() => {
  emitter.on("fetchFamiliesView", () => {
    //패밀리 멤버정보
    familiesViewStore.fetchFamilyMembersAsync();
    //패밀리 가입요청
    familiesViewStore.fetchJoinRequestsAsync();
    //패밀리 목록
    ownFamiliesStore.fetchOwnFamiliesAsync(true);
  });
})
</script>

<template>
  <div class="families-container">
    <span class="page-title">패밀리</span>
    <div class="family-selector-wrapper">
      <FamilySelector/>
    </div>
    <FamilyInfo v-if="ownFamiliesStore.hasSelectFamily"/>
    <PageButtonGroup :buttons="state.buttons.filter(button => button.visibleCondition())"/>
    <TappableView v-if="ownFamiliesStore.hasSelectFamily" :components="[
        new TabViewComponent('멤버', 'FamilyMembers', familiesViewStore.members.length),
        new TabViewComponent('가입요청', 'JoinRequests', familiesViewStore.joinRequests.length)
    ]"/>
  </div>
</template>

<style scoped lang="scss">
@import "@/assets/main";

.families-container {
  max-width: 768px;
  margin: 0 auto;

  .family-selector-wrapper {
    max-width: 230px;
  }
}
</style>
