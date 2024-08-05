import Spec from "@/constant/api-meta/ApiSpecification";
import {HttpMethod} from "@/constant/HttpMethod";

export default {
    ConfirmAccount: Spec.of(HttpMethod.POST, "/v1/account/confirm")
        .andDefaultMessage("이메일 형식이 올바르지 않습니다.")
        .andPairs([
            [-1, "이메일 형식이 올바르지 않습니다."],
            [-3, "이미 사용중인 이메일 입니다."],
            [-8, "사전가입 대상이 아닙니다."]
        ]),
    CreateAccount: Spec.of(HttpMethod.POST, "/v1/account/create")
        .andPairs([
            [-1, "이메일 형식이 올바르지 않습니다."],
            [-3, "이미 사용중인 이메일 입니다."],
            [-8, "사전가입 대상이 아닙니다."]
        ]),
    VerifyAccount: Spec.of(HttpMethod.POST, "/v1/account/verify")
        .andDefaultMessage("계정 인증 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.")
        .andPairs([
            [-4, "잘못된 계정 정보입니다."]
        ]),
    RefreshToken: Spec.of(HttpMethod.POST, "/v1/account/refresh")
        .andDefaultMessage("토큰 갱신 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.")
}
