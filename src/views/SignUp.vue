<template>
  <Transition name="fade">
    <div class="sign-up-container">
      <h1>회원가입</h1>
      <div class="form-wrapper-deployer">
        <div class="form-wrapper">
          <form id="sign-up-form" class="sign-up-form">
            <BlinkInput name="userName" type="email" label="이메일" id="email-input" placeHolder="이메일을 입력"
                           :is-hold="state.inputHold" :warning-message="state.emailWarningMessage"
                           :validate="methods.validateEmail"
            />
            <BlinkInput name="userPassword" type="password" label="비밀번호" placeHolder="숫자, 영문, 특수문자를 포함, 8~20자"
                           :is-hold="state.inputHold" warning-message="비밀번호 숫자, 영문, 특수문자를 포함해 8~20자 사용이 가능합니다."
                           :validate="methods.validatePassword" :if-visible-need="(isVisible) => methods.visiblePassword(isVisible, 'userPassword')"
            />
            <BlinkInput name="userPasswordConfirm" type="password" label="비밀번호 확인" placeHolder="비밀번호와 일치"
                           :is-hold="state.inputHold" warning-message="비밀번호가 일치하지 않습니다."
                           :validate="methods.validatePasswordConfirm" :if-visible-need="(isVisible) => methods.visiblePassword(isVisible, 'userPasswordConfirm')"
            />
            <SimpleButton buttonName="회원가입" :click-behavior="methods.signUp" :submittable="state.signUpSubmittable"/>
          </form>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import {reactive} from "vue";
import BlinkInput from "@/components/global/BlinkInput.vue";
import SimpleButton from "@/components/global/SimpleButton.vue";
import {Patterns, validate} from "@/utils/Util";
import {post} from "@/utils/NetworkUtil";
import {useRouter} from "vue-router";
import AccountAPI from "@/constant/api-meta/Account";

const router = useRouter();

const state = reactive({

  emailWarningMessage: "이메일 형식이 올바르지 않습니다.",

  //입력필드 유효성
  emailInputValidate: false,
  passwordInputValidate: false,
  passwordConfirmInputValidate: false,

  //제출 가능여부
  signUpSubmittable: false,

  //입력필드 홀드
  inputHold: false,
});

const methods = {
  async validateEmail(forceFocus: boolean = false) {
    const emailInput: HTMLInputElement = document.getElementsByName('userName')[0]! as HTMLInputElement;
    const isValidate = validate(emailInput.value, Patterns.Email);
    const isConfirm = await post(AccountAPI.CONFIRM_ACCOUNT_V1.name, { email: emailInput.value })
        .then(res => {
          return true
        })
        .catch(err => {
          const body = err.response.data
          const errCode = `${body.code}`
          const message = AccountAPI.CONFIRM_ACCOUNT_V1.codes[errCode]
          state.emailWarningMessage = message ?? AccountAPI.CONFIRM_ACCOUNT_V1.defaultErrorMessage
          return false;
        });
    const succeed = isValidate && isConfirm && (state.emailInputValidate = true);
    succeed || ((state.emailInputValidate = false) && forceFocus && emailInput.focus())
    methods.checkAllInput();
    return succeed;
  },

  validatePassword(forceFocus: boolean = false) {
    const passwordInput = document.getElementsByName('userPassword')[0]! as HTMLInputElement;
    const succeed = validate(passwordInput.value, Patterns.Password) && (state.passwordInputValidate = true);
    succeed || ((state.passwordInputValidate = false) && forceFocus && passwordInput.focus())
    methods.checkAllInput();
    return succeed;
  },

  validatePasswordConfirm(forceFocus: boolean = false) {
    const passwordInput = document.getElementsByName('userPassword')[0]! as HTMLInputElement;
    const passwordConfirmInput = document.getElementsByName('userPasswordConfirm')[0]! as HTMLInputElement;
    const succeed = (passwordConfirmInput.value.length !== 0 && passwordInput.value === passwordConfirmInput.value) && (state.passwordConfirmInputValidate = true);
    succeed || ((state.passwordConfirmInputValidate = false) && forceFocus && passwordConfirmInput.focus());
    methods.checkAllInput();
    return succeed;
  },
  checkAllInput() {
    state.signUpSubmittable = state.emailInputValidate && state.passwordInputValidate && state.passwordConfirmInputValidate;
  },

  visiblePassword(isVisible:boolean, elementName: string) {
    document.getElementsByName(elementName)[0]!['type'] = isVisible ? 'text' : 'password';
  },

  async signUp() {

    //회원가입 요청 가능
    if ( ! state.signUpSubmittable) {
      return false
    }

    await post(AccountAPI.CREATE_ACCOUNT_V1.name, {
      email: (document.getElementsByName('userName')[0]! as HTMLInputElement).value,
      password: (document.getElementsByName('userPassword')[0]! as HTMLInputElement).value
    })
        .then((res) => {
          console.log('res', res)
          router.push('/sign-in')
        })
        .catch((err) => {
          console.log('err', err);
        })
    console.log('after request')
  }
}
</script>

<style lang="scss">
@import "@/assets/main";

.sign-up-container {
  max-width: 400px;
  height: 100%;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  justify-content: center;

  .form-wrapper-deployer {

    .form-wrapper {

      .sign-up-form {

      }
    }
  }
}
</style>
