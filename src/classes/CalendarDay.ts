import {type Moment} from "moment-timezone";
import TemporalUtil from "@/utils/TemporalUtil";
import DateUtil from "@/utils/DateUtil";

export default class CalendarDay {

    private readonly _value: Moment;
    private readonly _timestamp: number;
    private readonly _localTimestamp: number;
    private readonly _dateStr: string;
    private readonly _isLocalTime: boolean;
    private readonly _year: number;
    private readonly _month: number;
    private readonly _day: number;


    constructor(value: Moment, isLocalTime: boolean = false) {
        const current = TemporalUtil.toMoment(value.unix(), isLocalTime);
        this._value = current;
        this._timestamp = current.clone().utc(false).unix();
        this._localTimestamp = current.unix();
        this._dateStr = current.format(DateUtil.DEFAULT_DATE_FORMAT);
        this._isLocalTime = isLocalTime;
        this._year = current.year();
        this._month = current.month() + 1;
        this._day = current.date();
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

    get isLocalTime(): boolean {
        return this._isLocalTime;
    }

    get year(): number {
        return this._year;
    }

    get month(): number {
        return this._month;
    }

    get day(): number {
        return this._day;
    }

    isSameMonth(month: number): boolean {
        return this._month === month;
    }
}
