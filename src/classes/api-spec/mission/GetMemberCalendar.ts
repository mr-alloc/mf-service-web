import type {Moment} from "moment-timezone";
import DateUtil from "@/utils/DateUtil";

export interface IMission {
    id: number;
    title: string;
    registerDate: number;

    get groupingDate(): string;
}

export class FamilyMission implements IMission {
    private readonly _id: number;
    private readonly _title: string;
    private readonly _startTime: number;
    private readonly _endTime: number;
    private readonly _registerDate: number;

    constructor(id: number, title: string, startTime: number, endTime: number, registerDate: number) {
        this._id = id;
        this._title = title;
        this._startTime = startTime;
        this._endTime = endTime;
        this._registerDate = registerDate;
    }

    get id(): number {
        return this._id;
    }

    get title(): string {
        return this._title;
    }

    get registerDate(): number {
        return this._registerDate;
    }

    get startTime(): number {
        return this._startTime;
    }

    get endTime(): number {
        return this._endTime;
    }

    get groupingDate(): string {
        return DateUtil.secondToDateString(this._startTime);
    }


    static fromJson(json: any): FamilyMission {
        return new FamilyMission(json.id, json.title, json.startTime ?? 0, json.endTime ?? 0, json.registerDate);
    }

}

export class CalendarMission implements IMission {
    private readonly _id: number;
    private readonly _title: string;
    private readonly _deadline: number;
    private readonly _registerDate: number;

    constructor(id: number, title: string, deadline: number, registerDate: number) {
        this._id = id;
        this._title = title;
        this._deadline = deadline;
        this._registerDate = registerDate;
    }

    get id(): number {
        return this._id;
    }

    get title(): string {
        return this._title;
    }

    get deadline(): number {
        return this._deadline;
    }

    get registerDate(): number {
        return this._registerDate;
    }

    get groupingDate(): string {
        return DateUtil.secondToDateString(this._deadline);
    }

    static fromJson(json: any): CalendarMission {
        return new CalendarMission(json.id, json.name, json.deadline ?? 0, json.createdAt ?? 0);
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
