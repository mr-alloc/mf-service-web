<template>
  <div class="family-invite-code-container">
    <BlinkInput id="invite-code" name="inviteCode" type="text" label="초대코드로 가입신청" placeHolder="초대코드 입력"
                :is-hold="state.isInputHold" :validate="methods.validateInviteCode"
                :warning-message="state.inviteCodeWarningMessage"/>
    <BlinkTextArea id="introduce" name="introduce" label="신청 메세지"/>
  </div>
</template>
<script setup lang="ts">

import {inject, onMounted, reactive} from "vue";
import {useThrottleFn} from "@vueuse/core";
import {useAlertStore} from "@/stores/AlertStore";
import BlinkInput from "@/components/global/BlinkInput.vue";
import DocumentUtil from "@/utils/DocumentUtil";
import {useBackgroundStore} from "@/stores/BackgroundStore";
import {call} from "@/utils/NetworkUtil";
import {RequestBody, ResponseBody} from "@/classes/api-spec/member/JoinFamily";
import Member from "@/constant/api-meta/Member";
import BlinkTextArea from "@/components/global/BlinkTextArea.vue";

const alertStore = useAlertStore();
const backgroundStore = useBackgroundStore();
const emitter = inject("emitter");

const inviteCodeRE = /^[a-f0-9]{32}$/i
const state = reactive({
  inviteCodeWarningMessage: "초대코드 형식이 올바르지 않습니다.",
  isSubmittable: false,
  isInputHold: false
});
const methods = {
  validateInviteCode() {
    const input = DocumentUtil.getHtmlElementById<HTMLInputElement>('invite-code');

    const isValidInviteCode = inviteCodeRE.test(input.value);
    if (!isValidInviteCode) {
      state.inviteCodeWarningMessage = "올바른 초대코드 형식이 아니에요.";
      input.focus();
    }

    return (state.isSubmittable = isValidInviteCode);
  }
}
onMounted(() => {
  emitter.on("validateInviteCodeForm", useThrottleFn(() => {
    if (!state.isSubmittable) {
      alertStore.info("패밀리 가입신청", "초대코드 입력이 필요해요.");
    }

    const input = DocumentUtil.getHtmlElementById<HTMLInputElement>('invite-code');
    const textarea = DocumentUtil.getHtmlElementById<HTMLTextAreaElement>('introduce');

    call<RequestBody, ResponseBody>(Member.RequestJoinFamily, RequestBody.of(input.value, textarea.value), (response) => {
      const responseBody = ResponseBody.fromJson(response.data);
      alertStore.success("가입신청 완료", `요청된 패밀리로 가입신청 완료 되었어요.`);

      emitter.off("validateInviteCodeForm")
      backgroundStore.returnGlobalPopup();
    }, (spec, error) => {
      const body = error.response.data;
      const message = spec.getMessage(body.code);

      alertStore.warning("가입신청 실패", message);
    })

  }, 2000));
})
</script>

<style scoped lang="scss">

</style>
