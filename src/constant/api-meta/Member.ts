import Spec from "@/constant/api-meta/ApiSpecification";
import {HttpMethod} from "@/constant/HttpMethod";
import Family from "@/constant/api-meta/Family";

export default {
    GetInfo: Spec.of(HttpMethod.GET, "/v1/member/info")
        .andDefaultMessage("프로필을 불러오는 중 오류가 발생했습니다."),
    ChangeMemberNickname: Spec.of(HttpMethod.PUT, "/v1/member/nickname")
        .andDefaultMessage("닉네임은 2~10자로 입력해주세요.")
        .andPairs([
            [-3, "닉네임은 2~10자로 입력해주세요."],
            [-4, "이미 사용중인 닉네임 입니다."]
        ])
        .whenFamily(Family.MemberNickName),
    GetMemberDetail: Spec.of(HttpMethod.GET, "/v1/member/detail")
        .andDefaultMessage("회원 정보를 불러오는 도중 오류가 발생 하였습니다.")
        .andPairs([
            [-1, "존재하지 않는 회원 입니다."],
            [-4, "잘못된 계정입니다."]
        ]),
    RequestJoinFamily: Spec.of(HttpMethod.POST, "/v1/member/join_request")
        .andDefaultMessage("가입 요청중 오류가 발생 하였습니다.")
        .andPairs([
            [-5, "잘못된 초대코드 입니다."],
            [-6, "이미 가입을 요청한 패밀리 입니다."],
            [-7, "이미 가입된 패밀리 입니다."],
        ])
}
