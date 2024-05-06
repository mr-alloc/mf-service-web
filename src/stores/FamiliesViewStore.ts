import {defineStore} from "pinia";
import {ref} from "vue";
import {JoinRequest, ResponseBody} from "@/classes/api-spec/family/GetJoinRequests";
import {call} from "@/utils/NetworkUtil";
import Family from "@/constant/api-meta/Family";

export const useFamiliesViewStore = defineStore("families", () => {

    const joinRequests = ref<Array<JoinRequest>>([]);

    async function fetchJoinRequestsAsync() {
        await call<any, ResponseBody>(Family.GetJoinRequests, {}, (response) => {
            const responseBody = ResponseBody.fromJson(response.data);
            joinRequests.value = responseBody.joinRequests;
        });
    }

    return {
        joinRequests,
        fetchJoinRequestsAsync
    }
});
