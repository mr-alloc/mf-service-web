<script setup lang="ts">

import FamilySelector from "@/components/header/FamilySelector.vue";
import FamilyMembers from "@/components/main/FamilyMembers.vue";
import {useOwnFamiliesStore} from "@/stores/OwnFamiliesStore";
import {inject, reactive} from "vue";
import {DefaultButtonValue} from "@/classes/DefaultButtonValue";
import PopupUtil from "@/utils/PopupUtil";
import PageButtonGroup from "@/components/PageButtonGroup.vue";
import {hasSelectedFamilyId} from "@/utils/LocalCache";
import {MemberRole} from "@/classes/constant/MemberRole";
import {useMemberInfoStore} from "@/stores/MemberInfo";

const ownFamiliesStore = useOwnFamiliesStore();
const memberInfoStore = useMemberInfoStore();
const emitter = inject("emitter");
const state = reactive({
  buttons: [
    DefaultButtonValue.of("생성", ["fas", "users"], () => PopupUtil.popupCreateFamily(emitter)),
    DefaultButtonValue.of("초대", ["fas", "user-plus"], () => PopupUtil.popupInviteFamily(emitter),
        () => hasSelectedFamilyId() && MemberRole.SUB_MASTER.isGrantedFrom(memberInfoStore.memberInfo.role)),
  ]
});
</script>

<template>
  <div class="families-container">
    <span class="page-title">패밀리</span>
    <div class="family-selector-wrapper">
      <FamilySelector/>
    </div>
    <PageButtonGroup :buttons="state.buttons.filter(button => button.visibleCondition())"/>
    <Transition name="fade">
      <FamilyMembers v-show="ownFamiliesStore.hasSelectFamily"/>
    </Transition>
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
