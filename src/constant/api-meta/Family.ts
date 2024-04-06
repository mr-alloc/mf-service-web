import Spec from "@/constant/api-meta/ApiSpecification";
import {HttpMethod} from "@/constant/HttpMethod";

export default {
    CreateFamily: Spec.of(HttpMethod.POST, "/v1/family/create")
        .andDefaultMessage("패밀를 생성하는 도중 오류가 발생 하였습니다.")
        .andPairs([]),
    GetOwnFamilies: Spec.of(HttpMethod.GET, "/v1/family/own")
        .andDefaultMessage("패밀리 목록을 불러오는 도중 오류가 발생 하였습니다.")
        .andPairs([]),
}
