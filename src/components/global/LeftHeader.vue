<template>
  <header :class="{ collapsed: leftMenuStore.state.isCollapsed}">
    <ProfilePreview/>
    <!--    <div class="brand-area">-->
    <!--      <RouterLink to="/">-->
    <!--        <div class="brand-logo">-->
    <!--          <img alt="Vue logo" class="logo" src="@/assets/images/logo.gif"/>-->
    <!--        </div>-->
    <!--      </RouterLink>-->
    <!--    </div>-->
    <CreateFamilyButton/>
    <CollapsibleMenu title="간소화" :icon="['far', 'square-caret-down']" :rotate="90"
                     :click-behavior="leftMenuStore.collapseMenu"/>
    <CollapsibleMenu title="메인" :icon="['fas', 'house']" allocated-path="/"/>
    <!--    <FamilySelector/>-->
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

  .brand-area {
    display: flex;
    flex-direction: row;
    align-items: center;
    cursor: pointer;

    .brand-logo {
      display: flex;
      justify-content: center;
      align-items: center;
      padding: 5px 8px;
      width: 100%;
      flex-shrink: 0;

      .logo {
        width: 100%;
      }
    }

    .brand-name {
      flex-grow: 1;
      display: flex;
      justify-content: center;
      align-items: center;
      width: 100%;
    }
  }

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
