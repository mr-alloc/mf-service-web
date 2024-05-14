import {DEFAULT_USER_PROFILE} from "@/constant/LocalAsset";
import type {ProfileMember} from "@/stores/ProfileMemberStore";

export class ResponseBody {
    private readonly _memberInfo: FamilyMemberInfo

    constructor(memberInfo: FamilyMemberInfo) {
        this._memberInfo = memberInfo;
    }

    get memberInfo(): FamilyMemberInfo {
        return this._memberInfo;
    }

    static fromJson(json: any): ResponseBody {
        return new ResponseBody(FamilyMemberInfo.fromJson(json.memberInfo));
    }
}

export class FamilyMemberInfo implements ProfileMember {

    private readonly _id: number
    private readonly _familyName: string
    private readonly _nickname: string
    private readonly _role: number
    private readonly _profile: string

    constructor(id: number, familyName: string, nickname: string, role: number, profile: string | null = null) {
        this._id = id;
        this._familyName = familyName;
        this._nickname = nickname;
        this._role = role;
        this._profile = profile ?? DEFAULT_USER_PROFILE;
    }

    get id(): number {
        return this._id;
    }

    get familyName(): string {
        return this._familyName;
    }

    get nickname(): string {
        return this._nickname ?? "GUEST";
    }

    get role(): number {
        return this._role;
    }

    get profile(): string {
        return this._profile;
    }

    static ofDefault(): FamilyMemberInfo {
        return new FamilyMemberInfo(0, "", "", 0, DEFAULT_USER_PROFILE);
    }

    static fromJson(json: any): FamilyMemberInfo {
        return new FamilyMemberInfo(json.id, json.familyName, json.nickname, json.role, json.profile);
    }
}
