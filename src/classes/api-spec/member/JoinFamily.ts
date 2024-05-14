export class RequestBody {
    readonly inviteCode: string;
    readonly introduce: string;

    constructor(inviteCode: string, introduce: string) {
        this.inviteCode = inviteCode;
        this.introduce = introduce;
    }

    static of(inviteCode: string, introduce: string): RequestBody {
        return new RequestBody(inviteCode, introduce);
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
