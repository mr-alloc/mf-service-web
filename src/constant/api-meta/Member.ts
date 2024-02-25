import Spec from "@/constant/api-meta/ApiSpecification";
import {HttpMethod} from "@/constant/HttpMethod";

export default {
    GetInfo: Spec.of(HttpMethod.GET, "/v1/member/info")
        .andDefaultMessage("회원 정보를 불러오는 중 오류가 발생했습니다."),
    ChangeMemberNickname: Spec.of(HttpMethod.PUT, "/v1/member/nickname")
        .andDefaultMessage("닉네임을 변경하는 중 오류가 발생했습니다.")
        .andPairs([
            [-3, "닉네임은 2~10자로 입력해주세요."]
        ])
}
