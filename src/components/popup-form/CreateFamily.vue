<template>
  <div class="create-family-controller">
    <div class="container-body">
      <BlinkInput id="family-name" name="familyName" type="text" label="패밀리명" placeHolder="패밀리명을 입력해주세요"
                  :is-hold="state.inputHold" :validate="methods.validateFamilyName"
                  warning-message="숫자, 영문, 한글로 2~20만 가능합니다."/>
      <BlinkInput id="family-description" name="familyDescription" type="text" label="패밀리 설명 (선택)"
                  placeHolder="패밀리 설명을 입력해주세요"
                  :is-hold="state.inputHold" :no-mark="true"/>
    </div>
  </div>
</template>
<script setup lang="ts">
import BlinkInput from "@/components/global/BlinkInput.vue";
import {inject, onMounted, reactive} from "vue";
import {AlertType, useAlertStore} from "@/stores/AlertStore";
import {call} from "@/utils/NetworkUtil";
import Family from "@/constant/api-meta/Family";
import {useBackgroundStore} from "@/stores/BackgroundStore";
import {useOwnFamiliesStore} from "@/stores/OwnFamiliesStore";

const emitter: any = inject("emitter");
const familyNameRE = /^[가-힣a-zA-Z0-9 ]{2,20}$/;
const state = reactive({
  inputHold: false,
  isSubmittable: false,

  familyNameInputValidate: false,
})

const methods = {
  validateFamilyName() {
    const familyNameInput: HTMLInputElement = document.getElementById("family-name") as HTMLInputElement;
    state.familyNameInputValidate = familyNameInput.value.length > 0 && familyNameRE.test(familyNameInput.value);

    if (!state.familyNameInputValidate) {
      familyNameInput.focus();
    }
    return state.familyNameInputValidate
  },
  checkAllInput() {
    state.isSubmittable = state.familyNameInputValidate;
  }
}
const alertStore = useAlertStore();
const backgroundStore = useBackgroundStore();
const ownFamiliesStore = useOwnFamiliesStore();
onMounted(() => {
  emitter.on("validateCreateFamilyForm", () => {
    methods.checkAllInput();
    if (!state.isSubmittable) {
      alertStore.alert(AlertType.INFO, "생성 실패", "입력값을 확인해주세요.");
      return;
    }

    const familyName = document.getElementById("family-name") as HTMLInputElement;
    const familyDescription = document.getElementById("family-description") as HTMLInputElement;

    const requestBody = {
      familyName: familyName.value,
      familyDescription: familyDescription.value
    }
    call<any, any>(Family.CreateFamily, requestBody, (response) => {
      //패밀리 정보 갱신
      alertStore.alert(AlertType.SUCCESS, "생성 성공", `${requestBody.familyName} 패밀리가 생성되었습니다.`);
      ownFamiliesStore.fetchOwnFamiliesAsync(true);
      //이벤트 발행 취소
      emitter.off("validateCreateFamilyForm")
      backgroundStore.returnGlobalPopup();
    })
  });
})
</script>
<style scoped lang="scss">
@import "@assets/main.scss";

.create-family-controller {

}

</style>
