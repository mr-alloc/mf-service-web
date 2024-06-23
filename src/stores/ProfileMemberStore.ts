import {defineStore} from "pinia";
import {ref} from "vue";
import {ProfileMember} from "@/stores/MemberInfoStore";

export const useProfileMemberStore = defineStore("profileMember", () => {
    const profileMember = ref<IProfileMember>(ProfileMember.ofDefault());

    function updateProfileMember(newer: IProfileMember) {
        profileMember.value = newer;
    }

    return {
        profileMember,
        updateProfileMember
    }
})


export interface IProfileMember {

    get familyName(): string;

    get nickname(): string;

    get role(): number;

    get profile(): string;
}
