import {defineStore} from "pinia";
import {ref} from "vue";
import {call} from "@/utils/NetworkUtil";
import MemberAPI from "@/constant/api-meta/Member";
import {removeAccessToken} from "@/utils/LocalCache";
import {useRouter} from "vue-router";
import {type IProfileMember, useProfileMemberStore} from "@/stores/ProfileMemberStore";
import LocalAsset from "@/constant/LocalAsset";

export const useMemberInfoStore = defineStore('memberInfo', () => {
    const memberInfo = ref<ProfileMember>(ProfileMember.ofDefault());

    function updateMemberInfo(memberInfoValue: ProfileMember) {
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
        memberInfo.value = ProfileMember.ofDefault();
    }

    async function fetchMemberInfo() {
        await call<any, any>(MemberAPI.GetInfo, null,
            (response) => {
                const { id, nickname, role } = response.data
                updateMemberInfo(new ProfileMember(id, nickname, role))
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

export class ProfileMember implements IProfileMember {

    private readonly _id: number
    private readonly _nickname: string
    private readonly _role: number
    private readonly _profile: string

    constructor(id: number, nickname: string, role: number, profile: string | null = null) {
        this._id = id;
        this._nickname = nickname;
        this._role = role;
        this._profile = profile ?? LocalAsset.DEFAULT_USER_PROFILE;
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

    static ofDefault(): ProfileMember {
        return new ProfileMember(0, '', 0)
    }

    notExist(): boolean {
        return this._id === 0
    }
}
