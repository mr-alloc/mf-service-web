export default class ResponseBody {

    private readonly _id: number;
    private readonly _inviteCode: string;

    constructor(id: number, inviteCode: string) {
        this._id = id;
        this._inviteCode = inviteCode;
    }

    get id(): number {
        return this._id;
    }

    get inviteCode(): string {
        return this._inviteCode;
    }

    static fromJson(json: any): ResponseBody {
        return new ResponseBody(json.id, json.inviteCode);
    }
}
