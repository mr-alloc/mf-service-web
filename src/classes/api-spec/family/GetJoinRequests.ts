import {DEFAULT_USER_PROFILE} from "@/constant/LocalAsset";

export class JoinRequest {
    private readonly _memberId: number;
    private readonly _nickname: string;
    private readonly _profile: string;
    private readonly _requestedAt: number;

    constructor(memberId: number, nickname: string, profile: string, requestedAt: number) {
        this._memberId = memberId;
        this._nickname = nickname;
        this._profile = profile ?? DEFAULT_USER_PROFILE;
        this._requestedAt = requestedAt;
    }

    get memberId(): number {
        return this._memberId;
    }

    get nickname(): string {
        return this._nickname;
    }

    get profile(): string {
        return this._profile;
    }

    get requestedAt(): number {
        return this._requestedAt;
    }

    static fromJson(json: any): JoinRequest {
        return new JoinRequest(json.memberId, json.nickname, json.profile, json.requestedAt);
    }
}

export class ResponseBody {
    private readonly _joinRequests: Array<JoinRequest>

    constructor(joinRequests: Array<JoinRequest>) {
        this._joinRequests = joinRequests;
    }

    get joinRequests(): Array<JoinRequest> {
        return this._joinRequests;
    }

    static fromJson(json: any): ResponseBody {
        const joinRequests: Array<JoinRequest> = json.joinRequests.map(JoinRequest.fromJson);
        return new ResponseBody(joinRequests);
    }
}

