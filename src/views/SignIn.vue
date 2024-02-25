<template>
    <div class="sign-in-container">
      <h1>로그인</h1>
      <div class="form-wrapper">
        <BlinkInput name="userName" type="email" placeHolder="E-mail"
                    :is-hold="state.inputHold" class="narrow"
                    :validate="methods.validateEmail" :no-mark="true"
                    warning-message="이메일 형식이 올바르지 않습니다."
        />
        <BlinkInput name="userPassword" type="password" placeHolder="Password"
                    :is-hold="state.inputHold" class="narrow" :if-visible-need="(isVisible: boolean) => methods.visiblePassword(isVisible, 'userPassword')"
                    :validate="methods.validatePassword" :no-mark="true"
                    warning-message="비밀번호 숫자, 영문, 특수문자를 포함해 8~20자 사용이 가능합니다."

        />
        <SimpleButton buttonName="로그인" :clickBehavior="methods.signIn" :submittable="state.isSubmittable"/>
      </div>
      <div class="sing-up-notice">
        <span>아직 회원이 아닌가요? <RouterLink to="/sign-up" class="word">회원 가입</RouterLink>으로 미션 패밀리에 합류하세요!</span>
      </div>
    </div>
</template>

<script setup lang="ts">
import {reactive} from 'vue'
import BlinkInput from "@/components/global/BlinkInput.vue";
import {Patterns, validate} from "@/utils/Util";
import SimpleButton from "@/components/global/SimpleButton.vue";
import {call} from "@/utils/NetworkUtil";
import {useRouter} from "vue-router";
import AccountAPI from "@/constant/api-meta/Account";
import {useMemberInfoStore} from "@/stores/MemberInfo";
import {removeAccessToken, removeRefreshToken, setAccessToken, setRefreshToken} from "@/utils/LocalCache";

const router = useRouter();
const memberInfoStore = useMemberInfoStore();

const state = reactive({
  //입력값 유효성 검증
  emailInputValidate: false,
  passwordInputValidate: false,

  inputHold: false,
  isSubmittable: false,
});

const methods = {
  validateEmail() {
    const emailInput: HTMLInputElement = document.getElementsByName('userName')[0]! as HTMLInputElement;
    state.emailInputValidate = validate(emailInput.value, Patterns.Email);

    methods.checkAllInput();
    return state.emailInputValidate;
  },
  validatePassword() {
    const passwordInput: HTMLInputElement = document.getElementsByName('userPassword')[0]! as HTMLInputElement;
    state.passwordInputValidate = validate(passwordInput.value, Patterns.Password);
    methods.checkAllInput();
    return state.passwordInputValidate;
  },
  visiblePassword(isVisible:boolean, elementName: string) {
    const element: HTMLInputElement = document.getElementsByName(elementName)[0] as HTMLInputElement;
    element.type = isVisible ? 'text' : 'password';
  },

  checkAllInput() {
    state.isSubmittable = state.emailInputValidate && state.passwordInputValidate;
  },
  async signIn() {
    if (!state.isSubmittable) return;

    const emailInput: HTMLInputElement = document.getElementsByName('userName')[0]! as HTMLInputElement;
    const passwordInput: HTMLInputElement = document.getElementsByName('userPassword')[0]! as HTMLInputElement;
    const signInResult = await call(AccountAPI.VerifyAccount, { email: emailInput.value, password: passwordInput.value },
        async (response) => {
          const {accessToken, refreshToken} = response.data
          console.log(`accessToken: ${accessToken}, refreshToken: ${refreshToken}`)
          setAccessToken(accessToken)
          setRefreshToken(refreshToken)
          await router.push('/')
          return true
        },
        (spec, error) => {
          const body = error.response.data
          memberInfoStore.removeMemberInfo()
          removeAccessToken()
          removeRefreshToken()
          alert(spec.getMessage(body.code) ?? spec.defaultMessage)
          return false
        }
    );

    return signInResult
  }
}

</script>

<style scoped lang="scss">
@import '@/assets/main';

.sign-in-container {
  display: flex;
  flex-direction: column;
  width: 340px;
  margin: 0 auto;
  height: 100vh;
  justify-content: center;

  .form-wrapper {
    padding: 15px 0px;
    display: flex;
    width: 100%;
    justify-content: space-evenly;
    flex-direction: column;
    align-items: center;
    border-radius: 15px;
    border: lightgray 1px solid;

  }

  .sing-up-notice {
    padding: 5px 8px;
  }
}
</style>
