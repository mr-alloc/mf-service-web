import {defineStore} from "pinia";
import {ref} from "vue";
import {call, dispatchIf} from "@/utils/NetworkUtil";
import MemberAPI from "@/constant/api-meta/Member";
import {removeAccessToken} from "@/utils/LocalCache";

export const useMemberInfoStore = defineStore('memberInfo', () => {
    const memberInfo = ref<MemberInfo>(MemberInfo.ofDefault());

    function updateMemberInfo (memberInfoValue: MemberInfo) {
        memberInfo.value = memberInfoValue
    }

    function needMemberInfo(): boolean {
        return memberInfo.value.notExist();
    }

    function removeMemberInfo() {
        memberInfo.value = MemberInfo.ofDefault();
    }

    async function renewMemberInfo() {
        await call(MemberAPI.GetInfo, null,
            (response) => {
                const { id, nickname, role } = response.data
                updateMemberInfo(new MemberInfo(id, nickname, role))
                console.log('Successfully renew member profile.')
                return;
            },
            (sepc, error) => {
                const res = error.response;
                //인증 실패
                dispatchIf(res.status === 401, '/sign-in', () => {
                    removeAccessToken()
                    console.error('[Failed to authenticate user.]')
                })
            })
    }

    function allow(memberRole: number) {
        return !needMemberInfo() && memberInfo.value.role >= memberRole
    }


    return {
        memberInfo,
        allow,
        needMemberInfo,
        updateMemberInfo,
        removeMemberInfo,
        renewMemberInfo
    }
})

export class MemberInfo {

    private readonly _id: number
    private readonly _nickname: string
    private readonly _role: number
    private readonly _profileImage: string

    constructor(id: number, nickname: string, role: number) {
        this._id = id;
        this._nickname = nickname;
        this._role = role;
        this._profileImage = "/src/assets/images/profile.png";
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

    get profileImage(): string {
        return this._profileImage;
    }

    static ofDefault(): MemberInfo {
        return new MemberInfo(0, '', 0)
    }

    notExist(): boolean {
        return this._id === 0
    }
}
