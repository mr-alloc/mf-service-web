import DateUtil from "@/utils/DateUtil";
import MissionDetail from "@/classes/MissionDetail";

export interface IMission {
    id: number;
    status: number;
    type: number;
    name: string;
    startDate: number;
    deadline?: number;
    startStamp?: number;
    endStamp?: number;

    get groupingDate(): string;
}

export class FamilyMission implements IMission {
    private readonly _id: number;
    private readonly _status: number;
    private readonly _type: number;
    private readonly _name: string;
    private readonly _startDate: number;
    private readonly _startStamp: number;
    private readonly _endStamp: number;

    constructor(id: number, status: number, type: number, name: string, startStamp: number, endStamp: number, startDate: number) {
        this._id = id;
        this._status = status;
        this._type = type;
        this._name = name;
        this._startStamp = startStamp;
        this._endStamp = endStamp;
        this._startDate = startDate;
    }

    get id(): number {
        return this._id;
    }

    get status(): number {
        return this._status;
    }

    get type(): number {
        return this._type;
    }

    get name(): string {
        return this._name;
    }

    get startDate(): number {
        return this._startDate;
    }

    get startStamp(): number {
        return this._startStamp;
    }

    get endStamp(): number {
        return this._endStamp;
    }

    get groupingDate(): string {
        return DateUtil.secondToDateString(this._startDate);
    }


    static fromJson(json: any): FamilyMission {
        return new FamilyMission(json.id, json.status, json.type, json.name, json.startStamp ?? 0, json.endStamp ?? 0, json.startDate);
    }

}


export class CalendarHoliday {
    private readonly _isLunar: boolean;
    private readonly _name: string;
    private readonly _date: string;

    constructor(isLunar: boolean, name: string, date: string) {
        this._isLunar = isLunar;
        this._name = name;
        this._date = date;
    }

    get isLunar(): boolean {
        return this._isLunar;
    }

    get name(): string {
        return this._name;
    }

    get date(): string {
        return this._date;
    }

    static fromJson(json: any): CalendarHoliday {
        return new CalendarHoliday(json.isLunar, json.name, json.date);
    }
}

export class RequestBody {

    private readonly _startStamp: number;
    private readonly _endStamp: number;

    constructor(startAt: number, endAt: number) {
        this._startStamp = startAt;
        this._endStamp = endAt;
    }

    toJSON() {
        return {
            startAt: this._startStamp,
            endAt: this._endStamp
        }
    }
}

export class ResponseBody {
    private readonly _calendar: Array<MissionDetail>;
    private readonly _holidays: CalendarHoliday []

    constructor(calendar: Array<MissionDetail>, holidays: CalendarHoliday []) {
        this._calendar = calendar;
        this._holidays = holidays;
    }

    get calendar(): Array<MissionDetail> {
        return this._calendar;
    }

    get holidays(): CalendarHoliday [] {
        return this._holidays;
    }

    static fromJson(json: any): ResponseBody {
        const calendar = json.calendar.map(MissionDetail.fromJson);
        const holidays = json.holidays.map(CalendarHoliday.fromJson);
        return new ResponseBody(calendar, holidays);
    }
}
