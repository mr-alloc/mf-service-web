import {defineStore} from "pinia";
import {ref} from "vue";
import {MemberInfo} from "@/stores/MemberInfo";

export const useProfileMemberStore = defineStore("profileMember", () => {
    const profileMember = ref<ProfileMember>(MemberInfo.ofDefault());

    function updateProfileMember(newer: ProfileMember) {
        profileMember.value = newer;
    }

    return {
        profileMember,
        updateProfileMember
    }
})


export interface ProfileMember {
    get familyName(): string;

    get nickname(): string;

    get role(): number;

    get profile(): string;
}
