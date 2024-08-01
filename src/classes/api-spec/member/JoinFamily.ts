export class RequestBody {
    private readonly _inviteCode: string;
    private readonly _introduce: string;

    constructor(inviteCode: string, introduce: string) {
        this._inviteCode = inviteCode;
        this._introduce = introduce;
    }

    static of(inviteCode: string, introduce: string): RequestBody {
        return new RequestBody(inviteCode, introduce);
    }

    get inviteCode(): string {
        return this._inviteCode;
    }

    get introduce(): string {
        return this._introduce;
    }

    toJSON() {
        return {
            inviteCode: this._inviteCode,
            introduce: this._introduce
        };
    }
}

export class ResponseBody {
    private readonly _id: number;
    private readonly _name: string;

    constructor(id: number, name: string) {
        this._id = id;
        this._name = name;
    }

    get id(): number {
        return this._id;
    }

    get name(): string {
        return this._name;
    }

    static fromJson(json: any): ResponseBody {
        return new ResponseBody(json.id, json.familyName);
    }
}
