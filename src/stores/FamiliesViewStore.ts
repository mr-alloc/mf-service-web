import {defineStore} from "pinia";
import {ref} from "vue";
import * as GetJoinRequests from "@/classes/api-spec/family/GetJoinRequests";
import * as AcceptJoinRequest from "@/classes/api-spec/family/AcceptJoinRequest";
import {call} from "@/utils/NetworkUtil";
import Family from "@/constant/api-meta/Family";

export const useFamiliesViewStore = defineStore("families", () => {

    const joinRequests = ref<Array<GetJoinRequests.JoinRequest>>([]);

    async function fetchJoinRequestsAsync() {
        await call<any, GetJoinRequests.ResponseBody>(Family.GetJoinRequests, {}, (response) => {
            const responseBody = GetJoinRequests.ResponseBody.fromJson(response.data);
            joinRequests.value = responseBody.joinRequests;
        });
    }

    async function acceptJoinRequestAsync(memberId: number) {
        await call<any, AcceptJoinRequest.ResponseBody>(Family.AcceptJoinRequest, {memberId: memberId}, (response) => {
            const responseBody = AcceptJoinRequest.ResponseBody.fromJson(response.data);
            //remove element witch memberId is equal to memberId
            joinRequests.value = joinRequests.value.filter((joinRequest) => joinRequest.memberId !== responseBody.id);
        });
    }

    return {
        joinRequests,
        fetchJoinRequestsAsync,
        acceptJoinRequestAsync
    }
});
