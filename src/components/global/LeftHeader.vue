<template>
  <header>
    <div class="brand-area">
      <RouterLink to="/">
        <div class="brand-logo">
          <img alt="Vue logo" class="logo" src="@/assets/images/logo.gif"/>
        </div>
      </RouterLink>
    </div>
    <FamilySelector/>
    <ProfilePreview/>
    <div class="feature-list-wrapper">
      <nav>
        <ul class="feature-list">
          <CreateFamilyButton/>
          <CreateMissionButton/>
        </ul>
      </nav>
    </div>
    <SimpleNotifier/>
  </header>
</template>
<script setup lang="ts">
import SimpleNotifier from "@/components/global/SimpleNotifier.vue";
import FamilySelector from "@/components/header/FamilySelector.vue";
import ProfilePreview from "@/components/header/ProfilePreview.vue";
import CreateFamilyButton from "@/components/header/CreateFamilyButton.vue";
import CreateMissionButton from "@/components/header/CreateMissionButton.vue";
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
  padding: 1.2rem 1.5rem;
  border-right: 1.24px solid $standard-light-gray-in-white;

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
}
</style>
