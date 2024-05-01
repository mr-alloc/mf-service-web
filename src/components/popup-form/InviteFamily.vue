<template>
  <div class="invite-family-container">
    <ul class="invite-ways">
      <li class="on-mission-family">
        <BlinkInput id="member-id" name="memberId" type="number" label="멤버 코드" placeHolder="멤버코드를 입력해주세요."
                    :is-hold="state.inputHold"/>
      </li>
    </ul>
  </div>
</template>
<script setup lang="ts">
import BlinkInput from "@/components/global/BlinkInput.vue";
import {reactive} from "vue";

const state = reactive({
  inputHold: false,
})

</script>
<style scoped lang="scss">
@import "@/assets/main";

.invite-family-container {
  display: flex;
  justify-content: center;
  align-items: center;

  .invite-ways {
    list-style: none;
  }
}
</style>
