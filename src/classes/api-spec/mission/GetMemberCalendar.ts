import type {Moment} from "moment-timezone";
import DateUtil from "@/utils/DateUtil";

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

export class CalendarMission implements IMission {
    private readonly _id: number;
    private readonly _status: number;
    private readonly _type: number;
    private readonly _name: string;
    private readonly _deadline: number;
    private readonly _startDate: number;

    constructor(id: number, status: number, type: number, name: string, deadline: number, startDate: number) {
        this._id = id;
        this._status = status;
        this._type = type;
        this._name = name;
        this._deadline = deadline;
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

    get deadline(): number {
        return this._deadline;
    }

    get startDate(): number {
        return this._startDate;
    }

    get groupingDate(): string {
        return DateUtil.secondToDateString(this._startDate);
    }

    static fromJson(json: any): CalendarMission {
        return new CalendarMission(json.id, json.status, json.type, json.name, json.deadline ?? 0, json.startDate);
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
    startDate: string;
    endDate: string;

    constructor(startDate: Moment, endDate: Moment) {
        this.startDate = DateUtil.toString(startDate);
        this.endDate = DateUtil.toString(endDate);
    }
}

export class ResponseBody {
    private readonly _calendar: IMission [];
    private readonly _holidays: CalendarHoliday []

    constructor(calendar: CalendarMission [], holidays: CalendarHoliday []) {
        this._calendar = calendar;
        this._holidays = holidays;
    }

    get calendar(): IMission [] {
        return this._calendar;
    }

    get holidays(): CalendarHoliday [] {
        return this._holidays;
    }

    static fromJson(json: any, missionMapper: (mission: IMission) => IMission): ResponseBody {
        const calendar = json.calendar.map(missionMapper);
        const holidays = json.holidays.map((holiday: any) => CalendarHoliday.fromJson(holiday));
        return new ResponseBody(calendar, holidays);
    }
}
