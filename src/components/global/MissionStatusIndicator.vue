<template>
  <div class="status-indicator-container">
    <div class="status-frame" :class="[`${state.status.simpleName}`]">
      <span class="status-alias">{{ state.status.name }}</span>
    </div>
  </div>
</template>
<script setup lang="ts">
import {onMounted, reactive} from "vue";
import MissionStatus from "@/constant/MissionStatus";
import MissionType from "@/constant/MissionType";

const props = defineProps<{
  status: number,
  type: number
}>();
const state = reactive({
  status: MissionStatus.CREATED
});
onMounted(() => {
  state.status = MissionType.SCHEDULE.value === props.type
      ? MissionStatus.ALWAYS
      : MissionStatus.fromCode(props.status);
})
</script>
<style scoped lang="scss">
@import "@assets/main";

.status-indicator-container {

  .status-frame {
    line-height: 1;
    width: max-content;
    padding: 2px 5px;
    border-radius: 5px;

    &.created {
      background-color: #ffdada;
      border: 1px solid #ffa7a7;

      .status-alias {
        color: #d13030;
      }
    }

    &.in-progress {
      background-color: #cbeeff;
      border: 1px solid #309fe3;
    }

    &.always {
      background-color: #d1f7d1;
      border: 1px solid $soft-green;

      .status-alias {
        color: $soft-green;
      }
    }

    .status-alias {
      color: black;
    }
  }
}
</style>
