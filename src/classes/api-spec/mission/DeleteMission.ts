export class ResponseBody {
    private readonly _missionId: number;

    constructor(missionId: number) {
        this._missionId = missionId;
    }

    get missionId(): number {
        return this._missionId;
    }

    static fromJson(json: any): ResponseBody {
        return new ResponseBody(json.missionId);
    }
}
