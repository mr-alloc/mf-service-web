import Spec from "@/constant/api-meta/ApiSpecification";
import {HttpMethod} from "@/constant/HttpMethod";

export default {
    CreateFamily: Spec.of(HttpMethod.POST, "/v1/family/create")
        .andDefaultMessage("패밀를 생성하는 도중 오류가 발생 하였습니다.")
        .andPairs([]),
    GetFamilyInfo: Spec.of(HttpMethod.GET, "/v1/family/info")
    ,
    GetOwnFamilies: Spec.of(HttpMethod.GET, "/v1/family/own")
        .andDefaultMessage("패밀리 목록을 불러오는 도중 오류가 발생 하였습니다.")
        .andPairs([]),
    GetFamilyMembers: Spec.of(HttpMethod.GET, "/v1/family/members")
        .andDefaultMessage("패밀리 멤버 목록을 불러오는 도중 오류가 발생 하였습니다.")
        .andPairs([]),
    MemberNickName: Spec.of(HttpMethod.PUT, "/v1/family/member/nickname")
        .andPairs([
            [-3, "닉네임은 2~10자로 입력해주세요."]
        ]),
    GetJoinRequests: Spec.of(HttpMethod.GET, "/v1/family/join_requests")
        .andPairs([]),
    AcceptJoinRequest: Spec.of(HttpMethod.POST, "/v1/family/accept/{memberId}")
        .andDefaultMessage("가입 요청을 처리하는 도중 오류가 발생 하였습니다.")
        .andPairs([
            [-4, "이미 우리 패밀리에요."],
            [-7, "찾을수 없는 요청이에요! 다른 관리자가 처리했거나, 요청자가 취소했을 수 있어요."]
        ]),
    RejectJoinRequest: Spec.of(HttpMethod.POST, "/v1/family/reject/{memberId}")
        .andDefaultMessage("가입 요청을 거절하는 도중 오류가 발생 하였습니다.")
        .andPairs([
            [-5, "찾을수 없는 요청이에요! 다른 관리자가 처리했거나, 요청자가 취소했을 수 있어요."]
        ]),
    GetFamilyMembersOwn: Spec.of(HttpMethod.GET, "/v1/family/members/own")
        .andDefaultMessage("패밀리 멤버 정보를 불러오는 도중 오류가 발생 하였습니다.")

}
