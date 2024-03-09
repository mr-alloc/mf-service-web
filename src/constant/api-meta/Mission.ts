import Spec from "@/constant/api-meta/ApiSpecification";
import {HttpMethod} from "@/constant/HttpMethod";

export default {
    CreateMission: Spec.of(HttpMethod.POST, "/v1/mission/create")
        .andDefaultMessage("미션 생성에 실패 하였습니다.")
        .andPairs([])


}
