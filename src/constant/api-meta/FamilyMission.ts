import Spec from "@/constant/api-meta/ApiSpecification";
import {HttpMethod} from "@/constant/HttpMethod";

const getFamilyCalendarSpec = Spec.of(HttpMethod.GET, "/v1/family/mission/calendar")
    .andDefaultMessage("이번달 패밀리 미션정보 조회에 실패 했어요.")
    .andPairs([]);

export default {
    GetFamilyCalendar: getFamilyCalendarSpec
}
