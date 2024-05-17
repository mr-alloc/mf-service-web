import type {IProfileMember} from "@/stores/ProfileMemberStore";
import LocalAsset from "@/constant/LocalAsset";

export class ResponseBody {
    private readonly _memberInfo: FamilyProfileMember

    constructor(memberInfo: FamilyProfileMember) {
        this._memberInfo = memberInfo;
    }

    get memberInfo(): FamilyProfileMember {
        return this._memberInfo;
    }

    static fromJson(json: any): ResponseBody {
        return new ResponseBody(FamilyProfileMember.fromJson(json.memberInfo));
    }
}

export class FamilyProfileMember implements IProfileMember {

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
        this._profile = profile ?? LocalAsset.DEFAULT_USER_PROFILE;
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

    static ofDefault(): FamilyProfileMember {
        return new FamilyProfileMember(0, "", "", 0, LocalAsset.DEFAULT_USER_PROFILE);
    }

    static fromJson(json: any): FamilyProfileMember {
        return new FamilyProfileMember(json.id, json.familyName, json.nickname, json.role, json.profile);
    }
}
