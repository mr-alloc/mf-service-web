import type MissionDetail from "@/classes/MissionDetail";
import CollectionUtil from "@/utils/CollectionUtil";
import MissionStatus from "@/constant/MissionStatus";
import TemporalUtil from "@/utils/TemporalUtil";
import DateUtil from "@/utils/DateUtil";

export default class CalendarMission {
    public static readonly START_AT_ASCENDING_CONDITION = (a: CalendarMission, b: CalendarMission) => a.startAt - b.startAt;

    private readonly _id: number;
    private readonly _status: MissionStatus;
    private readonly _type: number;
    private readonly _name: string;
    private readonly _startAt: number;
    private readonly _endAt: number;

    constructor(id: number, status: MissionStatus, type: number, name: string, startAt: number, endAt: number) {
        this._id = id;
        this._status = status;
        this._type = type;
        this._name = name;
        this._startAt = startAt;
        this._endAt = endAt;
    }

    get id(): number {
        return this._id;
    }

    get status(): MissionStatus {
        return this._status;
    }

    get type(): number {
        return this._type;
    }

    get name(): string {
        return this._name;
    }

    get startAt(): number {
        return this._startAt;
    }

    get endAt(): number {
        return this._endAt;
    }

    public toString(): string {
        const start = TemporalUtil.toMoment(this._startAt, true).format(DateUtil.DEFAULT_DATE_TIME_FORMAT);
        const end = TemporalUtil.toMoment(this._endAt, true).format(DateUtil.DEFAULT_DATE_TIME_FORMAT);
        return `[${this._status.name}] ${this._name} ${start} ~ ${end}`;
    }


    static of(detail: MissionDetail, startAt: number, endAt: number): Array<CalendarMission> {
        const schedule = detail.schedule;
        const stateMap = CollectionUtil.toMap(detail.states ?? [], (state) => state.startAt);
        return schedule.consist(startAt, endAt).map((period) => new CalendarMission(
            detail.id,
            MissionStatus.fromValue(stateMap.get(period.startAt)?.status ?? 0),
            detail.type,
            detail.name,
            period.startAt,
            period.endAt
        ));
    }
}
