import {defineStore} from "pinia";
import {ref} from "vue";
import {FamilyProfileMember, ResponseBody} from "@/classes/api-spec/family/GetFamilyMembersOwn";
import Family from "@/constant/api-meta/Family";
import {call} from "@/utils/NetworkUtil";
import {AlertType, useAlertStore} from "@/stores/AlertStore";
import {useOwnFamiliesStore} from "@/stores/OwnFamiliesStore";
import {useBackgroundStore} from "@/stores/BackgroundStore";
import {useProfileMemberStore} from "@/stores/ProfileMemberStore";
import {MemberRole} from "@/constant/MemberRole";

export const useFamilyMemberInfoStore = defineStore('familyMemberInfo', () => {
    const familyMemberInfo = ref<FamilyProfileMember>(FamilyProfileMember.ofDefault());

    async function fetchFamilyMemberAsync() {
        const ownFamiliesStore = useOwnFamiliesStore();
        const alertStore = useAlertStore();
        const backgroundStore = useBackgroundStore();
        const profileMemberStore = useProfileMemberStore();
        await call<any, ResponseBody>(Family.GetFamilyMembersOwn, {}, (response) => {
            const responseBody = ResponseBody.fromJson(response.data);
            const memberInfo = responseBody.memberInfo;
            familyMemberInfo.value = memberInfo;
            profileMemberStore.updateProfileMember(memberInfo);

            if (memberInfo.nickname === '' && ownFamiliesStore.hasSelectFamily) {
                alertStore.alert(AlertType.GUIDE, "패밀리 닉네임 선택", `${memberInfo.familyName}에서 사용할 닉네임을 설정 해야해요.`);
                backgroundStore.useNicknameInitializer(`${memberInfo.familyName}에서 사용할 닉네임을 입력해주세요.`, true);
            }
        });
    }

    function getCurrentMemberRole() {
        return MemberRole.from(familyMemberInfo.value.role);
    }

    return {
        familyMemberInfo,
        fetchFamilyMemberAsync,
        getCurrentMemberRole
    }
});


