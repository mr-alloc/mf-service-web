import Spec from "@/constant/api-meta/ApiSpecification";
import {HttpMethod} from "@/constant/HttpMethod";

const createComment = Spec.of(HttpMethod.POST, `/v1/state/{stateId}/comment`);
export default {
    CreateComment: createComment
        .andDefaultMessage("댓글 추가에 실패 하였습니다."),
    GetComments: Spec.of(HttpMethod.GET, `/v1/state/{stateId}/comment`)
}
