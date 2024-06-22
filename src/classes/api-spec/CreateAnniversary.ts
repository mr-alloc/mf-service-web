import AnniversaryValue from "@/classes/api-spec/AnniversaryValue";
import type IDatePickerOutput from "@/classes/component-protocol/IDatePickerOuput";

export class RequestBody {

    private readonly _name: string;
    private readonly _scheduleInfo?: IDatePickerOutput

    constructor(name: string, scheduleInfo?: IDatePickerOutput) {
        this._name = name;
        this._scheduleInfo = scheduleInfo;
    }

    get name(): string {
        return this._name;
    }

    toJSON() {
        return {
            name: this._name,
            scheduleInfo: this._scheduleInfo
        }
    }
}

export class ResponseBody {
    private readonly _created: Array<AnniversaryValue>;

    constructor(created: Array<AnniversaryValue>) {
        this._created = created;
    }

    get created(): Array<AnniversaryValue> {
        return this._created;
    }

    static fromJson(json: any): ResponseBody {
        return new ResponseBody(json.created.map(AnniversaryValue.fromJson));
    }
}
