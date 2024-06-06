import ScheduleMode from "@/constant/ScheduleMode";
import AnniversaryValue from "@/classes/api-spec/AnniversaryValue";


export default class CalendarAnniversary {
    private readonly _id: number;
    private readonly _mode: ScheduleMode;
    private readonly _name: string;
    private readonly _date: string;

    private constructor(id: number, type: ScheduleMode, name: string, date: string) {
        this._id = id;
        this._mode = type;
        this._name = name;
        this._date = date;
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

    get date(): string {
        return this._date;
    }

    static of(anniversary: AnniversaryValue, startAt: number, endAt: number): Array<CalendarAnniversary> {
        const scheduleInfo = anniversary.scheduleInfo;
        return scheduleInfo.consist(startAt, endAt)
            .map(date => new CalendarAnniversary(
                anniversary.id,
                scheduleInfo.mode,
                anniversary.name,
                date
            ));
    }
}
