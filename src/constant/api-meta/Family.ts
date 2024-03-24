import Spec from "@/constant/api-meta/ApiSpecification";
import {HttpMethod} from "@/constant/HttpMethod";

export default {
    CreateFamily: Spec.of(HttpMethod.POST, "/v1/family/create")
        .andDefaultMessage("패밀를 생성하는 도중 오류거 발생 하였습니다.")
        .andPairs([])
}
