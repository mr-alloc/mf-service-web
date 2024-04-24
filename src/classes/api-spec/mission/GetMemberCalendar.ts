import type {Moment} from "moment-timezone";
import DateUtil from "@/utils/DateUtil";

export class CalendarMission {
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

    static fromJson(json: any): CalendarMission {
        return new CalendarMission(json.id, json.name, json.deadline ?? 0, json.createAt ?? 0);
    }
}

export class CalendarHoliday {
    private readonly _isLunar: boolean;
    private readonly _name: string;
    private readonly _date: number;

    constructor(isLunar: boolean, name: string, date: number) {
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

    get date(): number {
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
    private readonly _calendar: CalendarMission [];
    private readonly _holidays: CalendarHoliday []

    constructor(calendar: CalendarMission [], holidays: CalendarHoliday []) {
        this._calendar = calendar;
        this._holidays = holidays;
    }

    get calendar(): CalendarMission [] {
        return this._calendar;
    }

    get holidays(): CalendarHoliday [] {
        return this._holidays;
    }

    static fromJson(json: any): ResponseBody {
        const calendar = json.calendar.map((mission: any) => CalendarMission.fromJson(mission));
        const holidays = json.holidays.map((holiday: any) => CalendarHoliday.fromJson(holiday));
        return new ResponseBody(calendar, holidays);
    }
}
