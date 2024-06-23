<script setup lang="ts">
import {MemberRole} from "@/constant/MemberRole";
import {useFamiliesViewStore} from "@/stores/FamiliesViewStore";
import {useAlertStore} from "@/stores/AlertStore";
import type {FamilyMember} from "@/classes/api-spec/family/GetFamilyMember";

const familiesViewStore = useFamiliesViewStore();
const alertStore = useAlertStore();

const methods = {
  showMemberProfile(member: FamilyMember) {
    alertStore.guide("멤버 프로필", "준비중이에요!")
  }
}
</script>
<template>
  <div class="family-members-container">
    <ul class="member-item-group">
      <li class="member-item-card" :class="{ 'new-member': member.isNewMember }"
          v-on:click="methods.showMemberProfile(member)"
          v-for="(member, index) in familiesViewStore.members as Array<FamilyMember>" :key="index">
        <div class="member-item">
          <div class="role-frame"
               v-if="MemberRole.from(member.role).isGrantedFrom(MemberRole.SUB_MASTER)"
               :class="[MemberRole.from(member.role).simpleName, { floating: MemberRole.from(member.role).isGrantedFrom(MemberRole.SUB_MASTER)}]">
            <span class="role-name">{{ MemberRole.from(member.role).name }}</span>
          </div>
          <div class="image-frame-area">
            <div class="image-frame">
              <img class="member-image" :src="member.image" alt="멤버 이미지"/>
            </div>
          </div>
          <div class="member-info">
            <span class="member-name">{{ member.name }}</span>
          </div>
        </div>
      </li>
    </ul>
  </div>
</template>

<style scoped lang="scss">
@import "@/assets/main";

.family-members-container {
  margin: 34px 0;
  padding: 0 20px;

  .member-item-group {
    list-style: none;
    display: flex;
    padding: 0;

    .member-item-card {
      padding: 10px 12px;
      border-radius: 5px;
      border: 1px solid $standard-light-gray-in-white;
      width: 100px;
      position: relative;
      user-select: none;
      transition: $duration;
      margin: 5px;

      .member-item {
        display: flex;
        flex-direction: column;
        align-items: center;

        .role-frame {
          background-color: white;
          padding: 3px 5px;
          border-radius: 5px;
          border: 1px solid black;
          width: max-content;
          line-height: .4;
          position: absolute;
          top: -11px;

          .role-name {
            font-size: .64rem;
            font-weight: bold;
          }

          &.master {
            background: radial-gradient(ellipse farthest-corner at right bottom, #FEDB37 0%, #FDB931 8%, #9f7928 30%, #8A6E2F 40%, transparent 80%),
            radial-gradient(ellipse farthest-corner at left top, #FFFFFF 0%, #FFFFAC 8%, #D1B464 25%, #5d4a1f 62.5%, #5d4a1f 100%);
            color: black;
          }

          &.sub-master {
            background: linear-gradient(0deg, rgba(170, 169, 173, 1) 25%, rgba(255, 255, 255, 1) 50%, rgba(225, 224, 228, 1) 75%, rgba(254, 253, 255, 1) 100%) 10% round;
          }
        }


        .image-frame-area {
          display: flex;
          justify-content: center;
          align-items: center;
          height: 60px;
          flex-shrink: 0;

          .image-frame {
            display: flex;
            width: 30px;
            height: 30px;
            border-radius: 50%;
            justify-content: center;
            align-items: center;
            overflow: hidden;


            .member-image {
              width: 100%;

            }
          }
        }

        .member-info {
          display: flex;
          flex-grow: 1;
          height: 20px;
          width: 100%;
          justify-content: center;

          .member-name {
            font-size: .84rem;
            line-height: 1.2;
            text-overflow: ellipsis;
            white-space: nowrap;
            overflow: hidden;
            font-weight: bold;
          }
        }
      }

      &:hover {
        background-color: $standard-light-gray-in-white;
        cursor: pointer;
      }

      &.new-member:before {
        content: "N";
        position: absolute;
        top: 3px;
        left: 3px;
        border-radius: 30px;
        font-weight: bold;
        font-size: .64rem;
        color: white;
        width: 15px;
        height: 15px;
        text-align: center;
        background-color: crimson;
      }
    }
  }
}
</style>
