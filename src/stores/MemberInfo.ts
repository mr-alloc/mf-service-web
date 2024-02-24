import {defineStore} from "pinia";
import {ref} from "vue";

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

    return {
        memberInfo,
        needMemberInfo,
        updateMemberInfo,
        removeMemberInfo
    }
})

export class MemberInfo {

    private readonly id: number
    private readonly nickname: string
    private readonly role: number

    constructor(id: number, nickname: string, role: number) {
        this.id = id
        this.nickname = nickname
        this.role = role
    }

    static ofDefault(): MemberInfo {
        return new MemberInfo(0, '', 0)
    }

    notExist(): boolean {
        return this.id === 0
    }
}
