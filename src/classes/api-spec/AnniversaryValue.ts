export default class AnniversaryValue {
    private readonly _id: number;
    private readonly _type: number;
    private readonly _name: string;
    private readonly _memberId: number;
    private readonly _familyId: number;
    private readonly _startTimeStamp?: number;
    private readonly _endTimeStamp?: number;
    private readonly _yearMonth?: string;
    private readonly _days?: Array<number>;

    constructor(id: number, type: number, name: string, memberId: number, familyId: number, startTimeStamp?: number, endTimeStamp?: number, yearMonth?: string, days?: Array<number>) {
        this._id = id;
        this._type = type;
        this._name = name;
        this._memberId = memberId;
        this._familyId = familyId;
        this._startTimeStamp = startTimeStamp;
        this._endTimeStamp = endTimeStamp;
        this._yearMonth = yearMonth;
        this._days = days;
    }

    get id(): number {
        return this._id;
    }

    get type(): number {
        return this._type;
    }

    get name(): string {
        return this._name;
    }

    get memberId(): number {
        return this._memberId;
    }

    get familyId(): number {
        return this._familyId;
    }

    get startTimeStamp(): number | undefined {
        return this._startTimeStamp;
    }

    get endTimeStamp(): number | undefined {
        return this._endTimeStamp;
    }

    get yearMonth(): string | undefined {
        return this._yearMonth;
    }

    get days(): Array<number> | undefined {
        return this._days;
    }

    static fromJson(json: any): AnniversaryValue {
        return new AnniversaryValue(
            json.id,
            json.type,
            json.name,
            json.memberId,
            json.familyId,
            json.startAt,
            json.endAt,
            json.yearMonth,
            json.days
        );
    }
}
