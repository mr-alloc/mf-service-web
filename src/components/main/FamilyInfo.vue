<template>
  <div class="family-info-container">
    <ul class="pair-item-group">
      <li class="pair-item">
        <span class="pair-of-left">초대코드</span>
        <span class="pair-of-right">
          {{ familiesViewStore.familyInfo.inviteCode }}
          <IconButton :icon="['far', 'copy']" :click-behavior="methods.copyInviteCode"/>
        </span>
      </li>
    </ul>
  </div>
</template>
<script setup lang="ts">
import {inject, onMounted} from "vue";
import {useAlertStore} from "@/stores/AlertStore";
import IconButton from "@/components/global/IconButton.vue";
import {useFamiliesViewStore} from "@/stores/FamiliesViewStore";

const emitter: any = inject("emitter")!;
const alertStore = useAlertStore();
const familiesViewStore = useFamiliesViewStore();
const methods = {
  copyInviteCode() {
    navigator.clipboard.writeText(familiesViewStore.familyInfo.inviteCode).then(() => {
      alertStore.success("클립보드 알림", "초대코드가 복사되었습니다.")
    })
  }
}
onMounted(() => {
  familiesViewStore.fetchFamilyInfoAsync();
  emitter.on("fetchFamilyMember", () => {
    familiesViewStore.fetchFamilyInfoAsync();
  });
});
</script>
<style scoped lang="scss">
@import "@/assets/main";

.family-info-container {
  margin: 1.5rem 0;

  .pair-item-group {
    padding: 0 1.2rem;

    .pair-item {
      display: flex;
      justify-content: left;
      align-items: center;
      width: 100%;

      .pair-of-left {
        font-weight: bold;
        font-size: .89rem;
        padding: 3px 8px;
        max-width: 6rem;
        flex-shrink: 0;
      }

      .pair-of-right {
        flex-grow: 1;
        font-size: .94rem;
        padding: 3px 12px;
        font-weight: bold;
      }
    }
  }
}
</style>
