export class ResponseBody {
    private readonly _id: number

    constructor(id: number) {
        this._id = id;
    }

    get id(): number {
        return this._id;
    }

    static fromJson(json: any): ResponseBody {
        return new ResponseBody(json.id);
    }
}
