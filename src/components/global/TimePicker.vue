<template>
  <div class="timepicker-container">
    <div class="collapse-controller">
      <button type="button" class="btn-primary" v-on:click="methods.toggleCollapse">
        <FontAwesomeIcon v-show="!state.isSelectMode" class="fa-1x" :icon="faClock"/>
        <span class="btn-content">{{ state.isSelectMode ? '취소' : '제한시간 선택' }}</span>
      </button>
    </div>
    <Transition name="fade">
      <div class="detail-time-setting" v-show="state.isSelectMode">
        <div class="timer-wrapper">
          <div class="mini-timer-area">
            <TemporalUnitIndicator ref="day" :unit="TemporalUnit.DAY" unit-text=":"/>
            <TemporalUnitIndicator ref="hour" :unit="TemporalUnit.HOUR" unit-text=":"/>
            <TemporalUnitIndicator ref="minute" :unit="TemporalUnit.MINUTE" unit-text=":"/>
            <TemporalUnitIndicator ref="second" :unit="TemporalUnit.SECOND" unit-text=""/>
          </div>
          <div class="timer-controller">
            <ul class="control-button-group">
              <li class="button-item" v-for="(unit, index) in TemporalUnit.values()" :key="unit.value">
                <button type="button" class="plus" v-on:click="() => methods.increaseValue(unit.seconds)">1{{
                    unit.name
                  }}
                </button>
              </li>
            </ul>
          </div>
        </div>
        <div class="reset-area">
          <button type="button" class="btn-primary" v-on:click="methods.resetValue">
            <FontAwesomeIcon class="fa-1x" :icon="faRotateRight"/>
          </button>
        </div>
      </div>
    </Transition>
  </div>
</template>
<script setup lang="ts">
import {FontAwesomeIcon} from "@fortawesome/vue-fontawesome";
import {reactive, ref} from "vue";
import TemporalUnitIndicator from "@/components/global/TemporalUnitIndicator.vue";
import TemporalUnit from "@/constant/TemporalUnit";
import {faClock} from "@fortawesome/free-regular-svg-icons";
import type {TemporalUnitIndicatorExpose} from "@/types/ExposeType";
import {faRotateRight} from "@fortawesome/free-solid-svg-icons";
import PopupUtil from "@/utils/PopupUtil";
import {PopupType} from "@/stores/status/CurrentPopup";

const day = ref<TemporalUnitIndicatorExpose | null>(null);
const hour = ref<TemporalUnitIndicatorExpose | null>(null);
const minute = ref<TemporalUnitIndicatorExpose | null>(null);
const second = ref<TemporalUnitIndicatorExpose | null>(null);

const props = defineProps<{
  defaultValue: number
}>();

const state = reactive({
  isSelectMode: false,
  value: 0
});

const methods = {
  toggleCollapse() {
    state.isSelectMode = !state.isSelectMode;
    if (!state.isSelectMode) {
      methods.resetValue();
    }
  },
  calculateAll() {
    day.value?.calculate(state.value);
    hour.value?.calculate(state.value);
    minute.value?.calculate(state.value);
    second.value?.calculate(state.value);
  },
  increaseValue(seconds: number) {
    const toBeResult = state.value + seconds
    if (Math.floor(toBeResult / TemporalUnit.DAY.seconds) >= 100) {
      PopupUtil.innerAlert(PopupType.WARNING, "시간 제한 초과", "100일 이상은 설정할 수 없습니다.");
      return;
    }
    state.value += seconds;
    methods.calculateAll();
  },
  resetValue() {
    state.value = props.defaultValue;
    methods.calculateAll();
  }
}
defineExpose({
  getValue: () => state.value
});
</script>
<style scoped lang="scss">
@import "@assets/main";

.timepicker-container {
  margin: 10px auto;
  width: 270px;

  .collapse-controller {
    padding: 5px 0;

    button {
      width: 100%;

      .btn-content {
        margin: 0 5px;
      }
    }
  }

  .detail-time-setting {
    display: flex;
    flex-direction: row;
    justify-content: flex-end;
    align-items: center;

    .timer-wrapper {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;

      .mini-timer-area {
        display: flex;
        justify-content: center;
        align-items: center;
        padding: 3px;
      }

      .timer-controller {
        .control-button-group {
          display: flex;
          justify-content: center;
          align-items: center;

          .button-item {
            margin: 0 5px;

            .plus {
              padding: 3px;
              background-color: $standard-light-gray-in-white;
              border-radius: 5px;

              &:hover {
                background-color: $standard-gray-in-white;
                cursor: pointer;
              }

              &:before {
                content: "+";
                padding: 0 3px;
              }
            }


          }
        }
      }
    }

    .reset-area {
      display: flex;
      justify-content: center;
      align-items: center;

      .btn-primary {
        padding: .9rem;
        width: 100%;
      }
    }
  }
}
</style>
