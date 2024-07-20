<template>
  <div class="input-wrapper"
       :class="{
          hold: props.isHold,
          warning: state.isWarning,
          correct: !props.noMark && state.isCorrect
       }">
    <div class="input-area">
      <label v-show="props.label" :for="props.id">{{ props.label }}</label>
      <div class="blink-input-pair">
        <Transition name="left-fade">
          <div class="icon-area" v-show="!props.noMark && state.isCorrect">
            <FontAwesomeIcon class="fa-1x correct-mark" :icon="faCircleCheck" />
          </div>
        </Transition>
        <input class="blink-input"
               ref="input"
               :type="props.type"
               :id="props.id"
               :name="props.name"
               :placeholder="props.placeHolder"
               :disabled="props.isHold"
               :value="state.value ?? props.defaultValue"
               v-on:focusin="methods.focusIn()"
               v-on:focusout="methods.focusOut()"
               v-on:input="props.onInput && props.onInput($event)"
               v-model="state.value"
               v-on:keyup="props.handleKeyEvent"
        />
        <Transition name="left-fade">
          <span class="show-origin" :class="{ active: state.isVisible }" v-show="state.isPassword" v-on:click="methods.visiblePassword()">
            <FontAwesomeIcon class="fa-1x" :icon="faEye" />
          </span>
        </Transition>
      </div>
      <span class="alert" v-show="state.isWarning">
        <FontAwesomeIcon class="fa-1x" :icon="faExclamationTriangle" />
        {{ props.warningMessage }}
      </span>
    </div>
  </div>
</template>

<script setup lang="ts">
import {FontAwesomeIcon} from "@fortawesome/vue-fontawesome";
import {faCircleCheck, faExclamationTriangle, faEye} from "@fortawesome/free-solid-svg-icons";
import {onMounted, reactive, ref} from "vue";

const input = ref(null);
const state = reactive({
  isCorrect: false,
  isWarning: false,
  isPassword: false,
  isVisible: false,
  value: ''
});

const props = defineProps({
  type: String,
  name: String,
  id: String,
  label: String,
  placeHolder: String,
  isHold: Boolean,
  warningMessage: String,
  validate: Function,
  ifVisibleNeed: Function,
  noMark: Boolean,
  defaultValue: String,
  handleKeyEvent: Function,
  onInput: Function
});
const methods =  {
  focusIn() {
    state.isCorrect = false;
    state.isWarning = false;
  },
  async focusOut() {
    //검증을 하지않는경우
    const noValidator = props.validate === undefined
    //에러 메세지를 표시하지않는경우
    const noWarningMessage = props.warningMessage === undefined;

    if (noValidator && noWarningMessage) return;
    const succeed = props.validate && await props.validate();

    state.isWarning = !succeed;
    state.isCorrect = succeed;
  },
  visiblePassword() {
    state.isVisible = !state.isVisible;
    props.ifVisibleNeed && props.ifVisibleNeed(state.isVisible);
  }
}
defineExpose({
  input: input,
});
onMounted(() => {
  if (props.type === 'password') {
    state.isPassword = true;
  }
})
</script>

<style scoped lang="scss">
@import '@assets/main.scss';
.input-wrapper {
  padding: 5px 0;
  width: 100%;
  display: flex;
  justify-content: center;

  span {
    position: relative;
    text-align: center;
    user-select: none;
  }

  .input-area {
    width: 100%;

    .alert {
      font-size: 0.64rem;
      opacity: 0;
    }

    .blink-input-pair {
      display: flex;
      position: relative;

      .icon-area {
        width: 30px;
        display: flex;
        justify-content: center;
        align-items: center;
        color: $correct-green;
      }

      .blink-input {
        display: inline-block;
      }

      .show-origin {
        position: absolute;
        right: 20px;
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        color: $standard-gray-in-white;
        cursor: pointer;
        transition: color $duration;

        &.active {
          color: $standard-weight-gray-in-white;
        }
      }
    }
  }

  &.warning {
    .input-area {

      .blink-input {
        animation-name: horizontal-shaking;
        animation-duration: 0.1s;
        animation-iteration-count: 5;
        border: 1.22px solid $warning-red
      }

      .alert {
        color: $warning-red;
        opacity: 1;
      }
    }
  }

  &.correct {
    .input-area {
      input {
        animation-name: correct-in;
        animation-duration: 0.3s;
        animation-iteration-count: 1;
        background-color: white;
        border-radius: 0px;
        border-bottom: 1.22px solid $correct-green;
      }
    }
  }

  &.narrow {
    margin: 5px auto;
  }
}

@keyframes x-shaking {
  0% { transform: skewX(-5deg); }
  33% { transform: skewX(5deg); }
  66% { transform: skewX(-5deg); }
  100% { transform: skewX(5deg); }
}

@keyframes horizontal-shaking {
  0% { transform: translateX(-1.5px); }
  33% { transform: translateX(1.5px); }
  66% { transform: translateX(-1.5px); }
  100% { transform: translateX(1.5px); }
}

@keyframes correct-in {
  0% { transform: scale(0.9); }
  100% {transform: scale(1);}
}
</style>
