import {defineStore} from "pinia";
import {ref} from "vue";
import {call, dispatchIf} from "@/utils/NetworkUtil";
import MemberAPI from "@/constant/api-meta/Member";
import {getSelectedFamilyId, removeAccessToken} from "@/utils/LocalCache";
import {AlertType, useAlertStore} from "@/stores/AlertStore";
import {useBackgroundStore} from "@/stores/BackgroundStore";

export const useMemberInfoStore = defineStore('memberInfo', () => {
    const memberInfo = ref<MemberInfo>(MemberInfo.ofDefault());

    function updateMemberInfo (memberInfoValue: MemberInfo) {
        memberInfo.value = memberInfoValue
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
        await call(MemberAPI.GetInfo, null,
            (response) => {
                const { id, nickname, role } = response.data
                const selectedFamilyId = getSelectedFamilyId();
                if (nickname === '' && selectedFamilyId !== '0') {
                    alertStore.alert(AlertType.GUIDE, "패밀리 닉네임 선택", `${familyName}에서 사용할 닉네임을 설정 해야해요.`);
                    backgroundStore.useNicknameInitializer(`${familyName}에서 사용할 닉네임을 입력해주세요.`);
                }
                updateMemberInfo(new MemberInfo(id, nickname, role))
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
        hasNickname,
        needMemberInfo,
        updateMemberInfo,
        removeMemberInfo,
        fetchMemberInfo
    }
})

export class MemberInfo {

    private readonly _id: number
    private readonly _nickname: string
    private readonly _role: number
    private readonly _profileImage: string

    constructor(id: number, nickname: string, role: number, profileImage: string | null = null) {
        this._id = id;
        this._nickname = nickname;
        this._role = role;
        this._profileImage = profileImage ?? "/src/assets/images/default_user.png";
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
