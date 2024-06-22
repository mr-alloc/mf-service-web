import Spec from "@/constant/api-meta/ApiSpecification";
import {HttpMethod} from "@/constant/HttpMethod";
import FamilyMission from "@/constant/api-meta/FamilyMission";

const createMissionSpec = Spec.of(HttpMethod.POST, "/v1/mission")
    .andDefaultMessage("미션 생성에 실패 하였습니다.")
    .andPairs([])
    .whenFamily(FamilyMission.CreateFamilyMission);
const getMemberCalendarSpec = Spec.of(HttpMethod.GET, "/v1/mission/calendar")
    .andDefaultMessage("이번달 미션정보 조회에 실패 했어요.")
    .andPairs([])
    .whenFamily(FamilyMission.GetFamilyCalendar);

export default {
    CreateMission: createMissionSpec,
    GetMemberCalendar: getMemberCalendarSpec,
    GetMissionDetail: Spec.of(HttpMethod.GET, `/v1/mission/{missionId}`)
        .whenFamily(FamilyMission.GetFamilyMissionDetail)
        .andPairs([]),
    ChangeMissionAttribute: Spec.of(HttpMethod.PUT, `/v1/mission/{missionId}`)
        .whenFamily(FamilyMission.ChangeMissionAttribute)
        .andDefaultMessage("미션 정보 수정에 실패 하였습니다."),
    DeleteMission: Spec.of(HttpMethod.DELETE, `/v1/mission/{missionId}`)
        .whenFamily(FamilyMission.DeleteFamilyMission)
        .andDefaultMessage("미션 삭제에 실패 하였습니다.")
        .andPairs([
            [-1, "존재하지 않는 미션입니다."],
            [-5, "잘못된 접근입니다."]
        ]),
}
