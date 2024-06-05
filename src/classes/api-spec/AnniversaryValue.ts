import ScheduleValue from "@/classes/api-spec/ScheduleValue";

export default class AnniversaryValue {
    private readonly _id: number;
    private readonly _name: string;
    private readonly _scheduleInfo: ScheduleValue;

    constructor(id: number, name: string, scheduleInfo: ScheduleValue) {
        this._id = id;
        this._name = name;
        this._scheduleInfo = scheduleInfo;
    }

    get id(): number {
        return this._id;
    }

    get name(): string {
        return this._name;
    }

    get scheduleInfo(): ScheduleValue {
        return this._scheduleInfo;
    }

    static fromJson(json: any): AnniversaryValue {
        return new AnniversaryValue(
            json.id,
            json.name,
            ScheduleValue.fromJson(json.schedule)
        );
    }
}
