import ScheduleMode from "@/constant/ScheduleMode";
import TemporalUtil from "@/utils/TemporalUtil";
import DateUtil from "@/utils/DateUtil";
import RepeatOption from "@/constant/RepeatOption";
import CalendarDay from "@/classes/CalendarDay";

export default class ScheduleValue {
    private readonly _id: number;
    private readonly _mode: ScheduleMode;
    private readonly _startAt: number;
    private readonly _endAt: number;
    private readonly _repeatOption: number;
    private readonly _repeatValue: number;

    constructor(id: number, mode: number, startAt: number, endAt: number, repeatOption: number, repeatValue: number) {
        this._id = id;
        this._mode = ScheduleMode.fromValue(mode)!;
        this._startAt = startAt;
        this._endAt = endAt;
        this._repeatOption = repeatOption;
        this._repeatValue = repeatValue;
    }

    get id(): number {
        return this._id;
    }

    get mode(): ScheduleMode {
        return this._mode;
    }

    get startAt(): number {
        return this._startAt;
    }

    get endAt(): number {
        return this._endAt;
    }

    get repeatOption(): number {
        return this._repeatOption;
    }

    get repeatValue(): number {
        return this._repeatValue;
    }

    static fromJson(json: any): ScheduleValue {
        return new ScheduleValue(
            json.id,
            json.mode,
            json.startAt,
            json.endAt,
            json.repeatOption,
            json.repeatValue
        );
    }

    consist(calendarStartAt: number, calendarEndAt: number): Array<string> {
        switch (this._mode) {
            case ScheduleMode.SINGLE:
            case ScheduleMode.MULTIPLE:
                return [TemporalUtil.toLocalMoment(this._startAt).format(DateUtil.DEFAULT_DATE_FORMAT)];
            case ScheduleMode.PERIOD: {
                const days = TemporalUtil.getDiffDays(this._startAt, this._endAt) + 1;
                return TemporalUtil.getLocalDaysArray(this._startAt, days)
                    .map(date => date.value.format(DateUtil.DEFAULT_DATE_FORMAT));
            }
            case ScheduleMode.REPEAT: {
                const repeatOption = RepeatOption.fromValue(this._repeatOption)
                const repeatDay = new CalendarDay(this._repeatValue);
                const days = TemporalUtil.getDiffDays(calendarStartAt, calendarEndAt);

                return TemporalUtil.getLocalDaysArray(calendarStartAt, days).filter(calendarDay => {
                    switch (repeatOption) {
                        case RepeatOption.WEEK:
                            return calendarDay.dayOfWeek.value === this._repeatValue;
                        case RepeatOption.MONTH: {
                            return calendarDay.date === repeatDay.date;
                        }
                        case RepeatOption.YEAR:
                            return calendarDay.month === repeatDay.month && calendarDay.date === repeatDay.date;
                        default:
                            throw new Error(`Invalid repeat option: ${repeatOption}`);
                    }
                }).map(date => date.value.format(DateUtil.DEFAULT_DATE_FORMAT));
            }
            default:
                throw new Error(`Invalid schedule mode: ${this._mode}`);
        }
    }
}
