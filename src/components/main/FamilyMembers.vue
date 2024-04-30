<script setup lang="ts">
import {inject, onMounted, reactive} from "vue";
import {FamilyMember, ResponseBody} from "@/classes/api-spec/family/GetFamilyMember";
import Family from "@/constant/api-meta/Family";
import {call} from "@/utils/NetworkUtil";

const emitter = inject("emitter")!;
const state = reactive({
  familyMembers: [] as Array<FamilyMember>
});
const methods = {
  fetchFamilyMembers() {
    call<any, ResponseBody>(Family.GetFamilyMembers, {}, (response) => {
      const responseBody = ResponseBody.fromJson(response.data);
      state.familyMembers = responseBody.members;
    });
  }
}
onMounted(() => {
  methods.fetchFamilyMembers();
  emitter.on("changeFamily", () => {
    methods.fetchFamilyMembers();
  });
});
</script>
<template>
  <div class="family-members-container">
    <ul class="member-item-group">
      <li v-for="(member, index) in state.familyMembers" :key="index">
        <div class="member-item">
          <div class="member-image-area">
            <img class="member-image" :src="member.image" alt="멤버 이미지"/>
          </div>
          <div class="member-info">
            <span class="member-name">{{ member.name }}</span>
            <span class="member-email">{{ member.role }}</span>
          </div>
        </div>
      </li>
    </ul>
  </div>
</template>

<style scoped lang="scss">
@import "@/assets/main";
</style>
