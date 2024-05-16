import type {Moment} from "moment-timezone";
import DateUtil from "@/utils/DateUtil";

export interface IMission {
    id: number;
    status: number;
    title: string;
    startDate: number;

    get groupingDate(): string;
}

export class FamilyMission implements IMission {
    private readonly _id: number;
    private readonly _status: number;
    private readonly _title: string;
    private readonly _startTime: number;
    private readonly _endTime: number;
    private readonly _startDate: number;

    constructor(id: number, status: number, title: string, startTime: number, endTime: number, startDate: number) {
        this._id = id;
        this._status = status;
        this._title = title;
        this._startTime = startTime;
        this._endTime = endTime;
        this._startDate = startDate;
    }

    get id(): number {
        return this._id;
    }

    get status(): number {
        return this._status;
    }

    get title(): string {
        return this._title;
    }

    get startDate(): number {
        return this._startDate;
    }

    get startTime(): number {
        return this._startTime;
    }

    get endTime(): number {
        return this._endTime;
    }

    get groupingDate(): string {
        return DateUtil.secondToDateString(this._startDate);
    }


    static fromJson(json: any): FamilyMission {
        return new FamilyMission(json.id, json.status, json.name, json.startTime ?? 0, json.endTime ?? 0, json.startDate);
    }

}

export class CalendarMission implements IMission {
    private readonly _id: number;
    private readonly _status: number;
    private readonly _title: string;
    private readonly _deadline: number;
    private readonly _startDate: number;

    constructor(id: number, status: number, title: string, deadline: number, startDate: number) {
        this._id = id;
        this._status = status;
        this._title = title;
        this._deadline = deadline;
        this._startDate = startDate;
    }

    get id(): number {
        return this._id;
    }

    get status(): number {
        return this._status;
    }

    get title(): string {
        return this._title;
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
        return new CalendarMission(json.id, json.status, json.name, json.deadline ?? 0, json.startDate);
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

    static fromJson(json: any, missionMapper: (mission: any) => IMission): ResponseBody {
        const calendar = json.calendar.map(missionMapper);
        const holidays = json.holidays.map((holiday: any) => CalendarHoliday.fromJson(holiday));
        return new ResponseBody(calendar, holidays);
    }
}
