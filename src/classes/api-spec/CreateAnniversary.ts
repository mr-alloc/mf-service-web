import AnniversaryType from "@/constant/AnniversaryType";
import AnniversaryValue from "@/classes/api-spec/AnniversaryValue";

export class RequestBody {

    private readonly _name: string;
    private readonly _type: number;
    private readonly _yearMonth?: string;
    private readonly _days?: Array<number>;
    private readonly _startAt?: number;
    private readonly _endAt?: number;

    constructor(name: string, type: number, yearMonth?: string, days?: Array<number>, startAt?: number, endAt?: number) {
        this._name = name;
        this._type = type;
        this._yearMonth = yearMonth;
        this._days = days;
        this._startAt = startAt;
        this._endAt = endAt;
    }

    get name(): string {
        return this._name;
    }

    get type(): number {
        return this._type;
    }

    get yearMonth(): string | undefined {
        return this._yearMonth;
    }

    get days(): Array<number> | undefined {
        return this._days;
    }

    get startAt(): number | undefined {
        return this._startAt;
    }

    get endAt(): number | undefined {
        return this._endAt;
    }

    toJSON() {
        const body = {} as {
            "name": string;
            "type": number;
            "yearMonth"?: string;
            "days"?: Array<number>;
            "startAt"?: number;
            "endAt"?: number;
        };
        body["name"] = this._name;
        body["type"] = this._type;
        this._yearMonth && (body["yearMonth"] = this._yearMonth);
        this._days && (body["days"] = this._days);
        this._startAt && (body["startAt"] = this._startAt);
        this._endAt && (body["endAt"] = this._endAt);
        return body;
    }

    static forPeriod(name: string, startAt: number, endAt: number) {
        return new RequestBody(name, AnniversaryType.PERIOD.value, undefined, undefined, startAt, endAt);
    }

    static forSingle(name: string, yearMonth: string, day: number) {
        return new RequestBody(name, AnniversaryType.SINGLE.value, yearMonth, [day]);
    }

    static forMultiple(name: string, yearMonth: string, days: Array<number>) {
        return new RequestBody(name, AnniversaryType.MULTIPLE.value, yearMonth, days);
    }
}

export class ResponseBody {
    private readonly _created: AnniversaryValue;

    constructor(created: AnniversaryValue) {
        this._created = created;
    }

    get created(): AnniversaryValue {
        return this._created;
    }

    static fromJson(json: any): ResponseBody {
        return new ResponseBody(AnniversaryValue.fromJson(json.created));
    }
}
