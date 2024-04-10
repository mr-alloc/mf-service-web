<script setup lang="ts">

import {MemberRole} from "@/constant/MemberRole";
import {useMemberInfoStore} from "@/stores/MemberInfo";
import {CurrentPopup, PopupType} from "@/stores/status/CurrentPopup";
import {AlertType, useAlertStore} from "@/stores/AlertStore";
import {useBackgroundStore} from "@/stores/BackgroundStore";
import {inject} from "vue";
import FeatureItem from "@/components/global/FeatureItem.vue";

const memberInfoStore = useMemberInfoStore();
const backgroundStore = useBackgroundStore();
const alertStore = useAlertStore();
const emitter = inject("emitter")!;
const methods = {
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
          alertStore.alert(AlertType.WARNING, "미션생성 취소", "이 메세지가 사라지기 전까지 한번 더 취소 버튼을 누르시면 취소되요!", 5)
          return 5;
        });
    backgroundStore.useGlobalPopup(createMissionPopup);
  },
}
</script>

<template>
  <FeatureItem :icon="['far', 'lightbulb']" v-show="memberInfoStore.allow(MemberRole.MEMBER)"
               :click-behavior="methods.popupCreateMission" button-name="미션 생성"/>
</template>

<style scoped lang="scss">

</style>
