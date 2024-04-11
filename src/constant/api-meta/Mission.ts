import Spec from "@/constant/api-meta/ApiSpecification";
import {HttpMethod} from "@/constant/HttpMethod";

const createMissionSpec = Spec.of(HttpMethod.POST, "/v1/mission/create")
    .andDefaultMessage("미션 생성에 실패 하였습니다.")
    .andPairs([]);
const getFamilyCalendarSpec = Spec.of(HttpMethod.GET, "/v1/mission/family-calendar")
    .andDefaultMessage("이번달 패밀리 미션정보 조회에 실패 했어요.")
    .andPairs([]);
const getMemberCalendarSpec = Spec.of(HttpMethod.GET, "/v1/mission/member-calendar")
    .andDefaultMessage("이번달 미션정보 조회에 실패 했어요.")
    .andPairs([])
    .whenFamily(getFamilyCalendarSpec);

export default {
    CreateMission: createMissionSpec,
    GetMemberCalendar: getMemberCalendarSpec,
    GetFamilyCalendar: getFamilyCalendarSpec
}
