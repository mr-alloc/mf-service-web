import ScheduleMode from "@/constant/ScheduleMode";
import AnniversaryValue from "@/classes/api-spec/AnniversaryValue";
import type Period from "@/classes/Period";


export default class CalendarAnniversary {
    private readonly _id: number;
    private readonly _mode: ScheduleMode;
    private _name: string;
    private readonly _period: Period;
    private readonly _scheduleTime: number;

    private constructor(id: number, type: ScheduleMode, name: string, period: Period, scheduleTime: number) {
        this._id = id;
        this._mode = type;
        this._name = name;
        this._period = period;
        this._scheduleTime = scheduleTime;
    }

    get id(): number {
        return this._id;
    }

    get mode(): ScheduleMode {
        return this._mode;
    }

    get name(): string {
        return this._name;
    }

    get period(): Period {
        return this._period;
    }

    get scheduleTime(): number {
        return this._scheduleTime;
    }

    static of(anniversary: AnniversaryValue, startAt: number, endAt: number): Array<CalendarAnniversary> {
        const scheduleInfo = anniversary.scheduleInfo;
        return scheduleInfo.consist(startAt, endAt)
            .map(period => new CalendarAnniversary(
                anniversary.id,
                scheduleInfo.mode,
                anniversary.name,
                period,
                anniversary.scheduleInfo.scheduleTime
            ));
    }

    applyName(convertedName: string) {
        this._name = convertedName;
    }
}
