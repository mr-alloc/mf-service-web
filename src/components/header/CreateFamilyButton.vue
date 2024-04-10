<script setup lang="ts">
import {MemberRole} from "@/constant/MemberRole";
import {useMemberInfoStore} from "@/stores/MemberInfo";
import {CurrentPopup, PopupType} from "@/stores/status/CurrentPopup";
import {AlertType, useAlertStore} from "@/stores/AlertStore";
import {inject} from "vue";
import {useBackgroundStore} from "@/stores/BackgroundStore";
import FeatureItem from "@/components/global/FeatureItem.vue";

const memberInfoStore = useMemberInfoStore();
const backgroundStore = useBackgroundStore();
const alertStore = useAlertStore();
const emitter = inject("emitter")!;

const methods = {
  popupCreateFamily() {
    const createFamilyPopup = new CurrentPopup(PopupType.NORMAL, "패밀리 생성")
        .addBodyComponent("CreateFamily", {})
        .addButton("생성", () => {
          emitter.emit("validateCreateFamilyForm");
        })
        .addCancelButton("취소", () => {
          backgroundStore.returnGlobalPopup()
          emitter.off("validateCreateFamilyForm")
        }, () => {
          alertStore.alert(AlertType.WARNING, "패밀리 생성 취소", "이 메세지가 사라지기 전까지 한번 더 취소 버튼을 누르시면 취소되요!", 5)
          return 5;
        });
    backgroundStore.useGlobalPopup(createFamilyPopup);
  },
}
</script>

<template>
  <FeatureItem :icon="['fas', 'people-group']" v-show="memberInfoStore.allow(MemberRole.MEMBER)"
               :click-behavior="methods.popupCreateFamily" button-name="패밀리 생성"/>
</template>

<style scoped lang="scss">

</style>
