import {defineStore} from "pinia";
import {ref} from "vue";
import {call} from "@/utils/NetworkUtil";
import MemberAPI from "@/constant/api-meta/Member";
import {removeAccessToken} from "@/utils/LocalCache";
import {useAlertStore} from "@/stores/AlertStore";
import {useBackgroundStore} from "@/stores/BackgroundStore";
import {DEFAULT_USER_PROFILE} from "@/constant/LocalAsset";
import {useRouter} from "vue-router";
import {type ProfileMember, useProfileMemberStore} from "@/stores/ProfileMemberStore";

export const useMemberInfoStore = defineStore('memberInfo', () => {
    const memberInfo = ref<MemberInfo>(MemberInfo.ofDefault());

    function updateMemberInfo (memberInfoValue: MemberInfo) {
        memberInfo.value = memberInfoValue
        const profileMemberStore = useProfileMemberStore();
        profileMemberStore.updateProfileMember(memberInfoValue);
    }

    function needMemberInfo(): boolean {
        return memberInfo.value.notExist();
    }

    function hasNickname(): boolean {
        return memberInfo.value.nickname !== 'GUEST';
    }

    function removeMemberInfo() {
        memberInfo.value = MemberInfo.ofDefault();
    }

    async function fetchMemberInfo(familyName: string) {
        const backgroundStore = useBackgroundStore();
        const alertStore = useAlertStore();
        await call<any, any>(MemberAPI.GetInfo, null,
            (response) => {
                const { id, nickname, role } = response.data
                updateMemberInfo(new MemberInfo(id, nickname, role))
                return;
            },
            (sepc, error) => {
                const router = useRouter();
                const res = error.response;
                //인증 실패
                if (res.status === 401) {
                    removeAccessToken()
                    console.error('[Failed to authenticate user.]')
                    router.push('/sign-in')
                }
            })
    }

    function allow(memberRole: number) {
        return !needMemberInfo() && memberInfo.value.role >= memberRole
    }

    function getCurrentMemberRole() {
        return memberInfo.value.role
    }


    return {
        memberInfo,
        allow,
        hasNickname,
        needMemberInfo,
        updateMemberInfo,
        removeMemberInfo,
        fetchMemberInfo,
        getCurrentMemberRole
    }
})

export class MemberInfo implements ProfileMember {

    private readonly _id: number
    private readonly _nickname: string
    private readonly _role: number
    private readonly _profile: string

    constructor(id: number, nickname: string, role: number, profile: string | null = null) {
        this._id = id;
        this._nickname = nickname;
        this._role = role;
        this._profile = profile ?? DEFAULT_USER_PROFILE;
    }

    get role(): number {
        return this._role;
    }

    get id(): number {
        return this._id;
    }

    get nickname(): string {
        return this._nickname ?? "GUEST";
    }

    get profile(): string {
        return this._profile;
    }

    get familyName(): string {
        return "";
    }

    static ofDefault(): MemberInfo {
        return new MemberInfo(0, '', 0)
    }

    notExist(): boolean {
        return this._id === 0
    }
}
