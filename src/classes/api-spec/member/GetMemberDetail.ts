import DateUtil from "@/utils/DateUtil";
import LocalAsset from "@/constant/LocalAsset";

export class ResponseBody {
    private readonly _id: number;
    private readonly _profile: string;
    private readonly _nickname: string;
    private readonly _email: string;
    private readonly _lastSignedInAt: string;
    private readonly _registeredAt: string;

    constructor(id: number, profile: string, nickname: string, email: string, lastSignedInAt: number, registeredAt: number) {
        this._id = id;
        this._profile = profile ?? LocalAsset.DEFAULT_USER_PROFILE;
        this._nickname = nickname;
        this._email = email;
        this._lastSignedInAt = DateUtil.secondToDateTimeString(lastSignedInAt);
        this._registeredAt = DateUtil.secondToDateTimeString(registeredAt);
    }

    get id(): number {
        return this._id;
    }

    get profile(): string {
        return this._profile;
    }

    get nickname(): string {
        return this._nickname;
    }

    get email(): string {
        return this._email;
    }

    get lastSignedInAt(): string {
        return this._lastSignedInAt;
    }

    get registeredAt(): string {
        return this._registeredAt;
    }

    static fromJson(json: any): ResponseBody {
        return new ResponseBody(
            json.id,
            json.profile,
            json.nickname,
            json.email,
            json.lastSignedInAt,
            json.registeredAt
        );
    }
}
