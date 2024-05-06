<template>
  <div class="family-info-container">
    <ul class="pair-item-group">
      <li class="pair-item">
        <span class="pair-of-left">초대코드</span>
        <span class="pair-of-right">
          {{ state.inviteCode }}
          <IconButton :icon="['far', 'copy']" :click-behavior="methods.copyInviteCode"/>
        </span>
      </li>
    </ul>
  </div>
</template>
<script setup lang="ts">
import {inject, onMounted, reactive} from "vue";
import {call} from "@/utils/NetworkUtil";
import ResponseBody from "@/classes/api-spec/family/GetFamilyInfo";
import Family from "@/constant/api-meta/Family";
import {useAlertStore} from "@/stores/AlertStore";
import IconButton from "@/components/global/IconButton.vue";

const emitter = inject("emitter")!;
const state = reactive({
  inviteCode: ""
});
const alertStore = useAlertStore();
const methods = {
  fetchFamilyInfo() {
    call<any, ResponseBody>(Family.GetFamilyInfo, {}, (response) => {
      const responseBody = ResponseBody.fromJson(response.data);
      state.inviteCode = responseBody.inviteCode;
    });
  },
  copyInviteCode() {
    navigator.clipboard.writeText(state.inviteCode).then(() => {
      alertStore.success("클립보드 알림", "초대코드가 복사되었습니다.")
    })
  }
}
onMounted(() => {
  methods.fetchFamilyInfo();
  emitter.on("fetchFamilyMember", () => {
    methods.fetchFamilyInfo();
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
