import AnniversaryValue from "@/classes/api-spec/AnniversaryValue";

export class ResponseBody {

    private readonly _anniversaries: Array<AnniversaryValue>;

    constructor(aniversaries: Array<AnniversaryValue>) {
        this._anniversaries = aniversaries;
    }

    get anniversaries(): Array<AnniversaryValue> {
        return this._anniversaries;
    }

    static fromJson(json: any): ResponseBody {
        return new ResponseBody(json.anniversaries.map(AnniversaryValue.fromJson));
    }
}
