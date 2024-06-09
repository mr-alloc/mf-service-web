import Spec from "@/constant/api-meta/ApiSpecification";
import {HttpMethod} from "@/constant/HttpMethod";

const getFamilyCalendarSpec = Spec.of(HttpMethod.GET, "/v1/family/mission/calendar")
    .andDefaultMessage("이번달 패밀리 미션정보 조회에 실패 했어요.")
    .andPairs([]);

export default {
    GetFamilyCalendar: getFamilyCalendarSpec,
    CreateFamilyMission: Spec.of(HttpMethod.POST, "/v1/family/mission")
        .andDefaultMessage("패밀리 미션 생성에 실패 하였습니다.")
        .andPairs([
            [-8, "존재하지 않는 멤버 입니다."]
        ]),
    GetFamilyMissionDetail: Spec.of(HttpMethod.GET, `/v1/family/mission/{missionId}`)
        .andPairs([]),
    ChangeMissionAttribute: Spec.of(HttpMethod.PUT, `/v1/family/mission/{missionId}`)
        .andDefaultMessage("패밀리 미션 정보 수정에 실패 하였습니다.")
        .andPairs([
            [-4, "변경할 내용이 없습니다."]
        ]),
    DeleteFamilyMission: Spec.of(HttpMethod.DELETE, `/v1/family/mission/{missionId}`)
        .andPairs([
            [-2, "존재하지 않는 미션입니다."],
            [-5, "잘못된 접근입니다."]
        ])
}
