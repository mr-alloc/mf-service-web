import {defineStore} from "pinia";
import {ref} from "vue";
import * as GetFamilyMember from "@/classes/api-spec/family/GetFamilyMember";
import {ResponseBody} from "@/classes/api-spec/family/GetFamilyMember";
import * as GetJoinRequests from "@/classes/api-spec/family/GetJoinRequests";
import * as AcceptJoinRequest from "@/classes/api-spec/family/AcceptJoinRequest";
import * as RejectJoinRequest from "@/classes/api-spec/family/RejectJoinRequest";
import {call} from "@/utils/NetworkUtil";
import Family from "@/constant/api-meta/Family";
import FamilyInfo from "@/classes/FamilyInfo";

export const useFamiliesViewStore = defineStore("families", () => {

    const joinRequests = ref<Array<GetJoinRequests.JoinRequest>>([]);
    const members = ref<Array<GetFamilyMember.FamilyMember>>([]);
    const newMemberCount = ref<number>(0);
    const familyInfo = ref<FamilyInfo>(FamilyInfo.ofDefault());

    async function fetchFamilyMembersAsync() {
        await call<any, ResponseBody>(Family.GetFamilyMembers, {}, (response) => {
            const responseBody = ResponseBody.fromJson(response.data);
            members.value = responseBody.members.sort((a, b) => b.role - a.role)
            newMemberCount.value = responseBody.members.filter((member) => member.isNewMember).length;
        });
    }
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

    async function rejectJoinRequestAsync(memberId: number) {
        await call<any, RejectJoinRequest.ResponseBody>(Family.RejectJoinRequest, {memberId: memberId}, (response) => {
            const responseBody = AcceptJoinRequest.ResponseBody.fromJson(response.data);
            //remove element witch memberId is equal to memberId
            joinRequests.value = joinRequests.value.filter((joinRequest) => joinRequest.memberId !== responseBody.id);
        });
    }

    async function fetchFamilyInfoAsync() {
        await call<any, ResponseBody>(Family.GetFamilyInfo, {}, (response) => {
            familyInfo.value = FamilyInfo.fromJson(response.data);
        });
    }

    return {
        joinRequests,
        fetchJoinRequestsAsync,
        acceptJoinRequestAsync,
        rejectJoinRequestAsync,
        members,
        fetchFamilyMembersAsync,
        fetchFamilyInfoAsync,
        familyInfo
    }
});
