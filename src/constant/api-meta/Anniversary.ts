import Spec from "@/constant/api-meta/ApiSpecification";
import {HttpMethod} from "@/constant/HttpMethod";

export default {
    CreateAnniversary: Spec.of(HttpMethod.POST, "/v1/anniversary")
        .andDefaultMessage("기념일을 생성하는 도중 오류가 발생 하였습니다.")
}
