import Spec from "@/constant/api-meta/ApiSpecification";
import {HttpMethod} from "@/constant/HttpMethod";

export default {
    GetInfo: Spec.of(HttpMethod.GET, "/v1/member/info")
        .andDefaultMessage("프로필을 불러오는 중 오류가 발생했습니다."),
    ChangeMemberNickname: Spec.of(HttpMethod.PUT, "/v1/member/nickname")
        .andDefaultMessage("닉네임은 2~10자로 입력해주세요.")
        .andPairs([
            [-3, "닉네임은 2~10자로 입력해주세요."]
        ]),
    GetMemberDetail: Spec.of(HttpMethod.GET, "/v1/member/detail")
        .andDefaultMessage("회원 정보를 불러오는 도중 오류가 발생 하였습니다.")
        .andPairs([
            [-1, "존재하지 않는 회원 입니다."],
            [-4, "잘못된 계정입니다."]
        ])
}
