import {type Moment} from "moment-timezone";
import TemporalUtil from "@/utils/TemporalUtil";
import DateUtil from "@/utils/DateUtil";
import DayOfWeek from "@/constant/DayOfWeek";

export default class CalendarDate {

    public static readonly TIMESTAMP_ASCENDING_CONDITION = (a: CalendarDate, b: CalendarDate) => a.timestamp - b.timestamp;

    private readonly _value: Moment;
    private readonly _timestamp: number;
    private readonly _localTimestamp: number;
    private readonly _dateStr: string;
    private readonly _year: number;
    private readonly _month: number;
    private readonly _weekOfCalendar: number;
    private readonly _date: number;
    private readonly _dayOfWeek: DayOfWeek;
    private readonly _hour: number;
    private readonly _minute: number;
    private readonly _second: number;


    constructor(timestamp: number, weekOfCalendar?: number) {
        const current = TemporalUtil.toMoment(timestamp, true);
        this._value = current;
        this._timestamp = timestamp;
        this._localTimestamp = current.unix();
        this._dateStr = current.format(DateUtil.DEFAULT_DATE_FORMAT);
        this._year = current.year();
        this._month = current.month() + 1;
        this._weekOfCalendar = weekOfCalendar ?? 0;
        this._date = current.date();
        this._dayOfWeek = DayOfWeek.fromSundayStartValue(current.day())!;
        this._hour = current.hour();
        this._minute = current.minute();
        this._second = current.second();
    }

    get value(): Moment {
        return this._value;
    }

    get timestamp(): number {
        return this._timestamp;
    }

    get localTimestamp(): number {
        return this._localTimestamp;
    }

    get dateStr(): string {
        return this._dateStr;
    }

    get year(): number {
        return this._year;
    }

    get month(): number {
        return this._month;
    }

    get weekOfCalendar(): number {
        return this._weekOfCalendar;
    }

    get date(): number {
        return this._date;
    }

    get dayOfWeek(): DayOfWeek {
        return this._dayOfWeek;
    }

    get hour(): number {
        return this._hour;
    }

    get minute(): number {
        return this._minute;
    }

    get second(): number {
        return this._second;
    }

    isSameMonth(month: number): boolean {
        return this._month === month;
    }

    public toString() {
        return `${this._dateStr} ${this._dayOfWeek.name}`;
    }
}
