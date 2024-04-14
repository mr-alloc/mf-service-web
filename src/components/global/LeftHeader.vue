<template>
  <header :class="{ collapsed: leftMenuStore.state.isCollapsed}">
    <FamilySelector/>
    <ProfilePreview/>
    <CollapsibleMenu title="간소화" :icon="['far', 'square-caret-down']"
                     :rotate="leftMenuStore.state.isCollapsed ? 90 : 270"
                     :click-behavior="leftMenuStore.collapseMenu"/>
    <CollapsibleMenu title="메인" :icon="['fas', 'house']" allocated-path="/"
                     :is-current-menu="leftMenuStore.state.activeHomeMenu"/>
    <CollapsibleMenu title="일정" :icon="['fas', 'calendar-days']" allocated-path="/calendar"
                     :is-current-menu="leftMenuStore.state.activeCalendarMenu"/>
    <CreateFamilyButton/>
    <CreateMissionButton/>
    <!--    <div class="feature-list-wrapper">-->
    <!--      <nav>-->
    <!--        <ul class="feature-list">-->
    <!--          <CreateFamilyButton/>-->
    <!--          <CreateMissionButton/>-->
    <!--        </ul>-->
    <!--      </nav>-->
    <!--    </div>-->
    <SimpleNotifier/>
  </header>
</template>
<script setup lang="ts">
import SimpleNotifier from "@/components/global/SimpleNotifier.vue";
import ProfilePreview from "@/components/header/ProfilePreview.vue";
import CreateFamilyButton from "@/components/header/CreateFamilyButton.vue";
import CollapsibleMenu from "@/components/header/CollapsibleMenu.vue";
import {useLeftMenuStore} from "@/stores/LeftMenuStore";
import CreateMissionButton from "@/components/header/CreateMissionButton.vue";
import FamilySelector from "@/components/header/FamilySelector.vue";

const leftMenuStore = useLeftMenuStore();
</script>

<style scoped lang="scss">
@import '@/assets/main';

header {
  display: flex;
  flex-direction: column;
  line-height: 1.5;
  max-height: 100vh;
  width: 230px;
  flex-shrink: 0;
  padding: 20px 12px;
  border-right: 1.24px solid $standard-light-gray-in-white;
  transition: all $duration;
  animation: collapse-in $duration ease-in-out reverse;

  .feature-list-wrapper {
    display: flex;

    nav {
      width: 100%;

      .feature-list {
        list-style: none;
        padding: 5px 8px;

      }
    }
  }

  &.collapsed {
    animation: collapse-in $duration ease-in-out;
    animation-iteration-count: 1;
    width: calc(35px + 24px);
  }
}

@keyframes collapse-in {
  0% {
    width: 230px;
  }

  100% {
    width: calc(35px + 24px);
  }
}
</style>
