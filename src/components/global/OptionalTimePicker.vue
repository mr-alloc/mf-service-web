<template>
  <div class="optional-time-picker-container">
    <label v-if="props.label" :for="props.id">{{ props.label }}</label>
    <div class="time-picker-wrapper">
      <input type="hidden" :id="props.id" :name="props.name"/>
      <button class="active-button" type="button" v-on:click="methods.activatePicker">
        <FontAwesomeIcon :icon="['fas', state.isActive ? 'minus' : 'plus']"/>
        <span class="button-text">{{ state.isActive ? '취소' : '지정' }}</span>
      </button>
      <Transition name="down-fade">
        <div class="current-picked-area" v-show="state.isActive">
          <div class="selector-group">
            <div class="am-pm-status">
              <div class="current-value" v-on:click="state.isAmPmSelectMode = !state.isAmPmSelectMode">
              <span class="status-text" :class="state.isAfterNoon ? 'pm' : 'am'">{{
                  state.isAfterNoon ? "오후" : "오전"
                }}</span>
              </div>
              <Transition name="down-fade">
                <ul class="status-group" v-show="state.isAmPmSelectMode">
                  <li class="status-item" v-on:click="methods.toAm()">
                    <span class="status-text am">오전</span>
                  </li>
                  <li class="status-item" v-on:click="methods.toPm()">
                    <span class="status-text pm">오후</span>
                  </li>
                </ul>
              </Transition>
            </div>
            <div class="current-time-value" v-on:click="() => state.isSelectMode = !state.isSelectMode">
              <FontAwesomeIcon :icon="['far', 'clock']"/>
              <span class="time-text">{{
                  TemporalUtil.secondsToTimeStr(state.selectedSeconds, true)
                }}</span>
            </div>
          </div>
          <Transition name="down-fade">
            <ul class="time-group" v-show="state.isSelectMode">
              <li class="minute-item" :key="index" v-for="(seconds, index) in state.times"
                  v-on:click="() => methods.selectTime(seconds)">{{ TemporalUtil.secondsToTimeStr(seconds, true) }}
              </li>
            </ul>
          </Transition>
          <ul class="quick-times-group">
            <li class="quick-time-item" v-on:click="() => methods.addSeconds(600)">+ 10분</li>
            <li class="quick-time-item" v-on:click="() => methods.addSeconds(300)">+ 5분</li>
            <li class="quick-time-item" v-on:click="() => methods.addSeconds(60)">+ 1분</li>
          </ul>
        </div>
      </Transition>
    </div>
  </div>
</template>
<script setup lang="ts">
import {FontAwesomeIcon} from "@fortawesome/vue-fontawesome";
import {onMounted, reactive} from "vue";
import TemporalUtil from "@/utils/TemporalUtil";

const props = defineProps({
  id: String,
  name: String,
  label: String,
})
const state = reactive({
  isActive: false,
  isSelectMode: false,
  isAmPmSelectMode: false,
  isAfterNoon: false,
  divideMinuteCriteria: 60 * TemporalUtil.SECONDS_IN_MINUTE,
  times: [] as Array<number>,
  selectedSeconds: 0,
});
const methods = {
  selectTime(seconds: number) {
    state.selectedSeconds = seconds;
    state.isSelectMode = false;
  },
  addSeconds(seconds: number) {
    const expected = state.selectedSeconds + seconds;
    if (expected > TemporalUtil.SECONDS_IN_DAY) {
      state.selectedSeconds = seconds;
    } else if (expected < 0) {
      state.selectedSeconds = TemporalUtil.SECONDS_IN_DAY + seconds;
    } else {
      state.selectedSeconds += seconds;
    }
  },
  activatePicker() {
    state.isActive = !state.isActive;
    if (!state.isActive) {
      state.isSelectMode = false;
      state.isAmPmSelectMode = false;
      state.selectedSeconds = 0;
    }
  },
  toAm() {
    state.isAfterNoon = false;
    state.isAmPmSelectMode = false;
  },
  toPm() {
    state.isAfterNoon = true;
    state.isAmPmSelectMode = false;
  }
}

defineExpose({
  getValue: () => state.selectedSeconds + (state.isAfterNoon ? TemporalUtil.SECONDS_IN_HALF_DAY : 0)
})
onMounted(() => {
  state.times = [...Array((TemporalUtil.SECONDS_IN_DAY / 2) / state.divideMinuteCriteria).keys()]
      .map((_, idx) => (idx + 1) * state.divideMinuteCriteria);
})
</script>
<style scoped lang="scss">
@import "@assets/main";

.optional-time-picker-container {
  transition: $duration;

  .time-picker-wrapper {
    position: relative;

    .active-button {
      transition: $duration;
      color: $standard-clean-black;
      border-radius: 5px;
      padding: 3px 5px;


      .button-text {
        padding: 2px 5px;
      }

      &:hover {
        background-color: $standard-light-gray-in-white;
        cursor: pointer;
      }
    }

    .time-group {
      overflow-y: scroll;
      height: 150px;
      border: 1px solid $standard-light-gray-in-white;
      border-radius: 5px;
      width: max-content;
      position: absolute;
      background-color: white;
      top: 45px;
      left: 50%;
      z-index: 2;

      .minute-item {
        padding: 3px 12px;
        font-weight: bold;
        transition: $duration;

        &:hover {
          background-color: $standard-light-gray-in-white;
          cursor: pointer;
        }
      }
    }

    .current-picked-area {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      position: relative;

      .selector-group {
        display: flex;
        flex-direction: row;

        .am-pm-status {
          position: relative;
          margin: 0 3px;
          display: flex;
          justify-content: center;
          align-items: center;

          .current-value {
            padding: 3px 8px;
            width: max-content;
            display: flex;
            justify-content: center;
            align-items: center;
            transition: $duration;
            border-radius: 5px;
            background-color: white;

            .status-text {
              padding: 3px 5px;
              line-height: 1;
              font-weight: bold;
              border-radius: 5px;
              width: max-content;
              margin: 3px 0;

              &.am {
                background-color: #b1f6c8;
                color: #068806;
              }

              &.pm {
                background-color: #9db0f5;
                color: #084f91;
              }
            }

            &:hover {
              cursor: pointer;
              background-color: $standard-light-gray-in-white;
            }
          }

          .status-group {
            position: absolute;
            top: 40px;
            background-color: white;
            border-radius: 5px;
            border: 1px solid $standard-light-gray-in-white;
            width: max-content;
            transition: height 0s;


            .status-item {
              padding: 3px 8px;
              transition: $duration;


              .status-text {
                padding: 3px 5px;
                line-height: 1;
                font-weight: bold;
                border-radius: 5px;
                width: max-content;
                margin: 3px 0;

                &.am {
                  background-color: #b1f6c8;
                  color: #068806;
                }

                &.pm {
                  background-color: #9db0f5;
                  color: #084f91;
                }
              }

              &:hover {
                cursor: pointer;
                background-color: $standard-light-gray-in-white;
              }
            }
          }
        }

        .current-time-value {
          position: relative;
          width: max-content;
          padding: 0 12px;
          display: flex;
          justify-content: left;
          align-items: center;
          transition: $duration;
          border-radius: 5px;
          z-index: 1;
          margin: 0 3px;

          .time-text {
            font-weight: bold;
            font-size: 1.1rem;
            padding: 5px 8px;
          }

          &:hover {
            cursor: pointer;
            background-color: $standard-light-gray-in-white;
          }
        }
      }


      .quick-times-group {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        padding: 5px 0;

        .quick-time-item {
          padding: 3px 5px;
          border: 1px solid $standard-light-gray-in-white;
          border-radius: 5px;
          transition: $duration;
          margin: 0 3px;

          &:hover {
            background-color: $standard-light-gray-in-white;
            cursor: pointer;
          }
        }
      }
    }
  }
}
</style>
