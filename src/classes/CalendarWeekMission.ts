import type CalendarMission from "@/classes/CalendarMission";
import TemporalUtil from "@/utils/TemporalUtil";

//이 객체는 한개의 스케쥴의 1주이상으로 걸쳐있는경우 나누기위해 사용되므로, _startAt은 걸쳐있는 주 내에서 표시할 시작시간이며, 이와 동일하게 _endAt또한 걸쳐있는 주 내에서 표시할 끝시간이다.
export default class CalendarWeekMission {

    private readonly _startAt: number;
    private readonly _endAt: number;
    private readonly _mission: CalendarMission;

    constructor(startAt: number, endAt: number, mission: CalendarMission) {
        this._startAt = startAt;
        this._endAt = endAt;
        this._mission = mission;
    }

    get startAt(): number {
        return this._startAt;
    }

    get endAt(): number {
        return this._endAt;
    }

    get mission(): CalendarMission {
        return this._mission;
    }


    public static of(startOfWeek: number, endOfWeek: number, mission: CalendarMission): CalendarWeekMission {
        const startAt = startOfWeek >= mission.startAt ? startOfWeek : mission.startAt;
        const endAt = endOfWeek <= mission.endAt ? endOfWeek : mission.endAt;

        return new CalendarWeekMission(startAt, endAt, mission);
    }

    public toString() {
        const start = TemporalUtil.toDateTimeStr(this._startAt);
        const end = TemporalUtil.toDateTimeStr(this._endAt);
        return `${this._mission.name} (${start} ~ ${end})`;
    }
}
